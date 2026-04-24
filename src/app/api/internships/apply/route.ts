import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db.js";
import { User } from "@/models/user.model";
import { Application } from "@/models/application.mode";

// POST /api/internships/apply — apply to an internship
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { jobId, company } = body;

    if (!jobId || !company) {
      return NextResponse.json(
        { error: "jobId and company are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if user already applied to this job
    const user = await User.findOne({ email: session.user.email }).populate(
      "applications"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const alreadyApplied = user.applications?.some(
      (app: any) => app.jobId === String(jobId)
    );

    if (alreadyApplied) {
      return NextResponse.json(
        { error: "You have already applied to this internship" },
        { status: 409 }
      );
    }

    // Create the application
    const application = await Application.create({
      jobId: String(jobId),
      company,
      status: "Applied",
      appliedDate: new Date(),
    });

    // Link it to the user and bump counters
    await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $push: { applications: application._id },
        $inc: { appliedCount: 1, applicationSent: 1 },
      }
    );

    return NextResponse.json(
      { message: "Application submitted successfully", application },
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
