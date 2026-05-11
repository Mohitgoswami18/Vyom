import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { flashModel } from "@/lib/gemini";

// POST /api/ai/chat — general career assistant chat
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { message, history } = body as {
      message: string;
      history: Array<{ role: "user" | "model"; parts: string }>;
    };

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const systemPrompt = `You are Vyom AI, an expert career counselor specialized in helping students and fresh graduates find internships and entry-level jobs. 
You give concise, actionable advice about resumes, cover letters, interview preparation, skill development, and job searching.
Keep your answers brief (3-5 sentences max) unless the user asks for something detailed.
Be encouraging and specific — avoid generic advice.`;

    // Build conversation history for multi-turn chat
    const chat = flashModel.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [
            {
              text: "Understood! I'm Vyom AI, your career assistant. I'm ready to help you with internships, resumes, interview prep, and more. What would you like to work on?",
            },
          ],
        },
        ...(history ?? []).map((h) => ({
          role: h.role,
          parts: [{ text: h.parts }],
        })),
      ],
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText }, { status: 200 });
  } catch (error) {
    console.error("POST /api/ai/chat error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
