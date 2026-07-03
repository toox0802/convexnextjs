"use client";

import { useConvexAuth, useQuery } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@/components/signoutbutton";
import { api } from "@/convex/_generated/api";

export default function Contact() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  const user = useQuery(api.todos.current);
  const todos = useQuery(api.todos.get);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <p className="text-2xl font-medium mb-4">You must be logged in</p>
          <Link 
            href="/"
            className="text-blue-400 hover:text-blue-500 transition-colors"
          >
            ← Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-12">
      {/* Top Navigation Bar - Apple Style */}
      <nav className="sticky top-0 bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-800 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-xl tracking-tight">
            MyApp
          </Link>
          
          <div className="flex items-center gap-6 text-sm">
            <span className="text-zinc-400">{user?.email}</span>
            <SignOutButton />
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-semibold tracking-tighter mb-2">
            Contact
          </h1>
          <p className="text-zinc-400 text-lg">Manage your account &amp; data</p>
        </div>

        {/* User Info Card */}
        <div className="bg-zinc-900 rounded-3xl p-8 mb-10 border border-zinc-800 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl font-semibold">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-2xl font-semibold">{user?.email}</p>
              <p className="text-emerald-400 text-sm">Signed in</p>
            </div>
          </div>
        </div>

        {/* Todos Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            Your Todos
            <span className="text-sm font-normal text-zinc-500">({todos?.length || 0})</span>
          </h2>

          <div className="space-y-3">
            {todos && todos.length > 0 ? (
              todos.map((todo) => (
                <div
                  key={todo._id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all duration-200 flex items-center gap-4 group"
                >
                  <div className="w-6 h-6 rounded-full border-2 border-zinc-700 group-hover:border-blue-500 transition-colors" />
                  <p className="text-lg">{todo.text}</p>
                </div>
              ))
            ) : (
              <div className="bg-zinc-900 rounded-3xl p-12 text-center border border-zinc-800">
                <p className="text-zinc-500 text-lg">No todos yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-4">
          <Link
            href="/"
            className="flex-1 bg-white text-black font-medium py-4 rounded-2xl text-center hover:bg-zinc-200 transition-colors"
          >
            ← Back to Home
          </Link>
          
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}