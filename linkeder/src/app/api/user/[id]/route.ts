// src/app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await db.user.findUnique({
      where: { id: params.id },
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
    console.error(`Failed to fetch user ${params.id}:`, error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
