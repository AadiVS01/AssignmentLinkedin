import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";


const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

import "@/styles/globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { auth, signOut } from "@/server/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "LinkedIn Clone",
  description: "A simple LinkedIn clone built with Next.js",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

async function TopNav() {
  const session = await auth();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href={session?.user ? "/home" : "/"}
              className="text-2xl font-bold text-blue-600"
            >
              SimpleLinked
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {!session?.user ? (
              <>

                <Link
                  href="/signin"
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/profile"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-md text-sm font-medium text-blue-600 ring-1 ring-inset ring-blue-200 hover:bg-blue-50"
                  >
                    Sign Out
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} bg-gray-50`}>
        <TopNav />
        <main className="py-10">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
