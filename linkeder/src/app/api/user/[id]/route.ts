// src/app/api/user/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const id = context.params.id; 

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
    // It's good practice to type the error object
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
        // Now you can safely access error.message, etc.
        console.error(`Failed to fetch user ${id}:`, error.message);
    } else {
        console.error(`An unknown error occurred while fetching user ${id}:`, error);
    }
    
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}