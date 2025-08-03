// ---------------------------------------------------------------------------
// FILE 1: The API Route that provides the data
// LOCATION: src/app/api/posts/route.ts
// ---------------------------------------------------------------------------
import { NextResponse } from "next/server";
import { db } from "@/server/db"; // Make sure this path to your Prisma client is correct

/**
 * This function handles GET requests to /api/posts.
 * It fetches all posts from the database and returns them.
 */
export async function GET() {
  try {
    // Fetch all posts from the database using Prisma
    const posts = await db.post.findMany({
      // We order the posts by creation date, newest first
      orderBy: {
        createdAt: "desc",
      },
      // We include the author's name to display it on the feed
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    // If successful, return the posts with a 200 OK status
    return NextResponse.json(posts);

  } catch (error) {
    // If an error occurs during the database query, log it for debugging
    console.error("Failed to fetch posts from database:", error);

    // Return a generic 500 Internal Server Error response to the client
    return NextResponse.json(
      { message: "An internal error occurred while fetching posts." },
      { status: 500 }
    );
  }
}


// ---------------------------------------------------------------------------
// FILE 2: The Page Component that displays the data
// LOCATION: src/app/home/page.tsx
// ---------------------------------------------------------------------------

// This interface defines the shape of a single Post object.
// It ensures type safety in your component.
interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string; // The date is a string in the JSON response
  author: {
    name: string | null;
  } | null;
}

/**
 * This function fetches the posts from our internal API endpoint.
 * It's called by the HomePage server component.
 */
async function getPosts(): Promise<Post[]> {
  // Ensure your .env.local file has NEXTAUTH_URL=http://localhost:3000
  const apiUrl = `${process.env.NEXTAUTH_URL}/api/posts`;

  const res = await fetch(apiUrl, {
    // 'no-store' ensures the data is fetched fresh on every request
    cache: "no-store",
  });

  // If the API returns a non-200 status code, we throw an error.
  if (!res.ok) {
    // For debugging, we can log the error response from the API
    const errorBody = await res.text();
    console.error(`API Error Response: Status ${res.status}`, errorBody);
    throw new Error("Failed to fetch posts from the API.");
  }

  // Parse the JSON response and cast it to our Post[] type
  return res.json() as Promise<Post[]>;
}

/**
 * This is the main page component. It's a React Server Component,
 * so it can be async and fetch data directly.
 */
export default async function HomePage() {
  // Await the posts from our data fetching function
  const posts = await getPosts();

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Public Feed</h1>
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800">
                {post.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {/* Safely access author name with a fallback */}
                By {post.author?.name ?? "Anonymous"} on{" "}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-4 text-gray-700 whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          ))
        ) : (
          // This message is shown if the API returns an empty array
          <div className="text-center text-gray-500 bg-white p-8 rounded-lg shadow-md">
            <p>No posts yet. Be the first to post!</p>
          </div>
        )}
      </div>
    </div>
  );
}
