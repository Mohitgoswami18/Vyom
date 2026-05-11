import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db.js";
import { User } from "@/models/user.model";
import { uploadToCloudinary } from "@/lib/cloudinary";

// Allowed MIME types per upload type
const ALLOWED_TYPES: Record<string, string[]> = {
  resume: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  "profile-picture": [
    "image/jpeg",
    "image/png",
    "image/webp",
  ],
};

const MAX_SIZE: Record<string, number> = {
  resume: 10 * 1024 * 1024,           // 10 MB
  "profile-picture": 5 * 1024 * 1024,  // 5 MB
};

// POST /api/upload — upload resume or profile picture to Cloudinary
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;

    // Validate inputs
    if (!file || !type) {
      return NextResponse.json(
        { error: "file and type are required" },
        { status: 400 },
      );
    }

    if (!["resume", "profile-picture"].includes(type)) {
      return NextResponse.json(
        { error: 'type must be "resume" or "profile-picture"' },
        { status: 400 },
      );
    }

    // Validate MIME type
    const allowedMimes = ALLOWED_TYPES[type];
    if (!allowedMimes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            type === "resume"
              ? "Only PDF, DOC, and DOCX files are allowed"
              : "Only JPEG, PNG, and WEBP images are allowed",
        },
        { status: 400 },
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE[type]) {
      const maxMB = MAX_SIZE[type] / (1024 * 1024);
      return NextResponse.json(
        { error: `File size must be less than ${maxMB}MB` },
        { status: 400 },
      );
    }

    // Convert to buffer for Cloudinary upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate a unique public ID based on user email
    const sanitizedEmail = session.user.email.replace(/[^a-zA-Z0-9]/g, "_");
    const publicId =
      type === "resume"
        ? `resume_${sanitizedEmail}`
        : `avatar_${sanitizedEmail}`;

    // Upload to Cloudinary
    const result = await uploadToCloudinary(buffer, {
      folder: type === "resume" ? "resumes" : "profile-pictures",
      resourceType: type === "resume" ? "raw" : "image",
      publicId,
    });

    // Update user document in MongoDB
    await connectToDatabase();

    const updateField =
      type === "resume"
        ? { resumeLink: result.url }
        : { profilePicture: result.url };

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateField },
      { new: true },
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: `${type === "resume" ? "Resume" : "Profile picture"} uploaded successfully`,
        url: result.url,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
