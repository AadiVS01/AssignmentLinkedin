
interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string | null;
  } | null;
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json() as Promise<Post[]>;
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Public Feed</h1>
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800">
                {post.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                By {post.author?.name || "Anonymous"} on{" "}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-4 text-gray-700 whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 bg-white p-8 rounded-lg shadow-md">
            <p>No posts yet. Be the first to post!</p>
          </div>
        )}
      </div>
    </div>
  );
}
