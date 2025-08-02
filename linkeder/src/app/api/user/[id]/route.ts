// src/app/api/user/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/server/db";

// Corrected the function signature to destructure params directly.
// This is the standard and recommended way for dynamic route handlers.
export async function GET(
  request: Request,
  { params }: { params: { id:string } }
) {
  const id = params.id; // The dynamic 'id' from the URL

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
