import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";

/**
 * GET /api/user/profile
 * Fetches the profile data for the currently authenticated user.
 */
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
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

    // Omit password from the response for security
    const { password, ...userData } = user;
    return NextResponse.json(userData);
    
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
