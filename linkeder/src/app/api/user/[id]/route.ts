// src/app/api/user/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

// Using the more specific NextRequest type for the first argument.
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params; // Destructure id from context.params

  try {
    const user = await db.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        email: true,
        description: true,
        image: true,
        createdAt: true,
        posts: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(`Failed to fetch user ${id}:`, error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
