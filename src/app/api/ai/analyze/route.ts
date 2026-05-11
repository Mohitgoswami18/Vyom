import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db.js";
import { User } from "@/models/user.model";
import { proModel } from "@/lib/gemini";
import * as pdfParse from "pdf-parse";

const pdf = (pdfParse as any).default ?? pdfParse;

// POST /api/ai/analyze — analyze resume vs job description
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { jobTitle, company, jobDescription, resumeText: cachedResumeText } = body;

    if (!jobDescription) {
      return NextResponse.json(
        { error: "jobDescription is required" },
        { status: 400 }
      );
    }

    let resumeText = cachedResumeText as string | undefined;

    // If no cached resume text, fetch + parse from Cloudinary
    if (!resumeText) {
      await connectToDatabase();
      const user = await User.findOne({ email: session.user.email }).select(
        "resumeLink name"
      );

      if (!user?.resumeLink) {
        return NextResponse.json(
          {
            summary:
              "No resume uploaded. Please upload your resume in the Profile section for a personalised analysis.",
            missingSkills: [],
            tips: [
              "Upload your resume in the Profile section.",
              "Add your skills manually in the Profile section to get basic match scores.",
            ],
          },
          { status: 200 }
        );
      }

      const pdfResponse = await fetch(user.resumeLink);
      if (!pdfResponse.ok) {
        return NextResponse.json(
          { error: "Could not fetch resume from Cloudinary" },
          { status: 500 }
        );
      }

      const arrayBuffer = await pdfResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const pdfData = await pdf(buffer);
      resumeText = pdfData.text;
    }

    const cleanDescription = jobDescription
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 3000);

    const cleanResume = (resumeText ?? "").slice(0, 4000);

    const prompt = `
You are an expert career counselor and hiring manager. Analyze the following resume against the job description below.
Return ONLY a valid JSON object — no markdown, no code fences, no explanation — with exactly this shape:
{
  "summary": "2-3 sentence honest assessment of how well this candidate fits the role",
  "matchPercentage": <integer 0-100 representing overall fit>,
  "missingSkills": ["skill1", "skill2", "skill3"],
  "strengths": ["strength1", "strength2"],
  "tips": [
    "Specific actionable tip 1 to improve chances for THIS role",
    "Specific actionable tip 2",
    "Specific actionable tip 3"
  ]
}

Job Title: ${jobTitle ?? "Not specified"}
Company: ${company ?? "Not specified"}

--- JOB DESCRIPTION ---
${cleanDescription}

--- CANDIDATE RESUME ---
${cleanResume}
    `.trim();

    const result = await proModel.generateContent(prompt);
    const responseText = result.response.text().trim();

    // Strip markdown fences if Gemini wraps in them
    const jsonString = responseText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const analysis = JSON.parse(jsonString);

    return NextResponse.json(analysis, { status: 200 });
  } catch (error) {
    console.error("POST /api/ai/analyze error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI analysis" },
      { status: 500 }
    );
  }
}
