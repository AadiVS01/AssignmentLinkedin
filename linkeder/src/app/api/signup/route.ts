// src/app/api/signup/route.ts
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/server/db";

export async function POST(req: Request) {
  try {
    const { name, email, password, description } = (await req.json()) as {
      name: string;
      email: string;
      password: string;
      description?: string;
    };

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { message: "A user with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        description,
      },
    });

    // Omit password from the response for security
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
    
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
