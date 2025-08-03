// LOCATION: src/app/api/posts/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";

/**
 * GET /api/posts
 * Fetches all posts for the public feed.
 */
export async function GET() {
  try {
    const posts = await db.post.findMany({
      include: { author: { select: { name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/posts
 * Creates a new post. This is a protected route.
 */
export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const { title, content } = (await req.json()) as {
      title: string;
      content: string;
    };

    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required." },
        { status: 400 }
      );
    }

    const post = await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
