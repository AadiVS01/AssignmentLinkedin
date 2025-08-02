// src/app/profile/page.tsx
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import { CreatePostForm } from "@/components/CreatePostForm";

export default async function ProfilePage() {
  const session = await auth();

  // If the user is not logged in, redirect them to the sign-in page.
  if (!session?.user) {
    redirect("/signin");
  }

  // Fetch the user's data directly from the database.
  // This is more efficient than calling our own API route.
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
    // This could happen if the user was deleted from the DB but the session still exists.
    redirect("/signin");
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Column: Profile Info */}
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
          <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="mt-4 text-gray-700">
            {user.description || "No description provided."}
          </p>
        </div>
      </div>

      {/* Right Column: Create Post and Post Feed */}
      <div className="md:col-span-2 space-y-8">
        {/* The form is a separate Client Component */}
        <CreatePostForm />

        {/* User's Posts */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Your Posts
          </h3>
          <div className="space-y-6">
            {user.posts.length > 0 ? (
              user.posts.map((post) => (
                <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="text-xl font-bold text-gray-800">
                    {post.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Posted on {new Date(post.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-3 text-gray-700 whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
                <p>
                  You haven&apos;t posted anything yet. Use the form above to
                  share your thoughts!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
