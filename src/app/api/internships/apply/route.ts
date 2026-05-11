import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db.js";
import { User } from "@/models/user.model";
import { Application } from "@/models/application.mode";
import { autoApply } from "@/lib/playwright-apply";

// Required for Playwright on Vercel (extends function timeout)
export const maxDuration = 60;
export const dynamic = "force-dynamic";

// POST /api/internships/apply — apply to an internship with Playwright automation
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { jobId, company, applyUrl } = body;

    if (!jobId || !company) {
      return NextResponse.json(
        { error: "jobId and company are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Fetch user with their applications and profile data
    const user = await User.findOne({ email: session.user.email }).populate(
      "applications"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already applied
    const alreadyApplied = user.applications?.some(
      (app: any) => app.jobId === String(jobId)
    );

    if (alreadyApplied) {
      return NextResponse.json(
        { error: "You have already applied to this internship" },
        { status: 409 }
      );
    }

    // ── Run Playwright automation ────────────────────────────────────────────
    let automationStatus: "success" | "failed" | "skipped" = "skipped";
    let automationLog = "";
    let automationMessage = "No application URL provided — manual apply required.";

    if (applyUrl) {
      try {
        const result = await autoApply({
          name: user.name ?? session.user.name ?? "",
          email: user.email,
          phone: user.phone ?? "",
          resumeLink: user.resumeLink ?? "",
          coverLetter: `I am excited to apply for this position at ${company}. My skills and experience make me a strong candidate for this role.`,
          applyUrl,
        });

        automationStatus = result.success ? "success" : "failed";
        automationLog = result.log.join("\n");
        automationMessage = result.message;
      } catch (err) {
        automationStatus = "failed";
        automationLog = `Automation crashed: ${(err as Error).message}`;
        automationMessage = "Automation failed — please apply manually.";
      }
    }

    // ── Create Application record ────────────────────────────────────────────
    const application = await Application.create({
      jobId: String(jobId),
      company,
      status: "Applied",
      appliedDate: new Date(),
      resumeLink: user.resumeLink || "",
      automationStatus,
      automationLog,
    });

    // Link to user and bump counters
    await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $push: { applications: application._id },
        $inc: { appliedCount: 1, applicationSent: 1 },
      }
    );

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        application,
        automation: {
          status: automationStatus,
          message: automationMessage,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/internships/apply error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
