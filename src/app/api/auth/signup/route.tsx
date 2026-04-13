import { User } from "@/models/user.model";
import bcrypt from "bcryptjs";
import connectToDatabase from "../../../../lib/db.js";
import { NextResponse } from "next/server";

type Body = {
  name: string;
  email: string;
  password: string;
};

export async function POST(request: Request) {

  console.log("Received signup request");
  try {
    await connectToDatabase();

    const { name, email, password }: Body = await request.json();
    console.log("Parsed request body:", { name, email, password: password ? "****" : null });
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = null;

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error unexpected error occurred sdovlzsiuvozd" },
      { status: 500 },
    );
  }
}