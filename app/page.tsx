"use client";

import { useState } from "react";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { SignOutButton } from "@/components/signoutbutton";
import Link from "next/link";
import { Id } from "../convex/_generated/dataModel";

export default function MainPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  
  const todos = useQuery(api.todos.get);
  const user = useQuery(api.todos.current);     // kept as per your setup

  const { signOut } = useAuthActions();
  const [text, setText] = useState("");

  // Create mutation with optimistic update
  const createTodo = useMutation(api.todos.create).withOptimisticUpdate(
    (localStore, args) => {
      const existingTodos = localStore.getQuery(api.todos.get);
      
      if (existingTodos !== undefined && user?._id) {
        const optimisticTodo = {
          _id: crypto.randomUUID() as Id<"todos">,
          _creationTime: Date.now(),
          userId: user._id,                    // Fixed: was causing build error
          text: args.text,
        };

        localStore.setQuery(
          api.todos.get,
          {},
          [...existingTodos, optimisticTodo]
        );
      }
    }
  );

  // Delete mutation with optimistic update
  const deleteTodo = useMutation(api.todos.remove).withOptimisticUpdate(
    (localStore, args) => {
      const existingTodos = localStore.getQuery(api.todos.get);
      
      if (existingTodos !== undefined) {
        const filteredTodos = existingTodos.filter(
          (todo) => todo._id !== args.id
        );
        
        localStore.setQuery(api.todos.get, {}, filteredTodos);
      }
    }
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await createTodo({ text });
      setText(""); 
    } catch (error) {
      console.error("Failed to create todo:", error);
    }
  };

  const handleDelete = async (id: Id<"todos">) => {
    try {
      await deleteTodo({ id });
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  if (isLoading) {
    return <p className="mt-10 text-center text-gray-500">Checking auth...</p>;
  }
  
  if (!isAuthenticated) {
    return (
      <div className="mt-10 text-center">
        <p className="text-xl">You must be logged in to manage your todos.</p>
      </div>
    );
  }

  if (todos === undefined) {
    return <p className="mt-10 text-center">Loading your todos...</p>;
  }

  return (
    <main className="max-w-md mx-auto mt-10 p-4">
      <p className="mb-2">email: {user?.email}</p>
      <SignOutButton />

      <div className="flex gap-4 my-6">
        <Link href="/contact" className="text-blue-400 hover:underline">
          Go to Contact
        </Link>
        <Link href="/counter" className="text-blue-400 hover:underline">
          Go to Counter
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">My Todos</h1>

      {/* Create Form */}
      <form onSubmit={handleCreate} className="flex gap-2 mb-8">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What do you need to do?"
          className="border p-2 flex-1 rounded text-white bg-zinc-900 border-zinc-700 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          Add
        </button>
      </form>

      {/* Todo List */}
      <ul className="flex flex-col gap-3">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex justify-between items-center border border-zinc-700 bg-zinc-900 p-4 rounded-xl"
          >
            <span>{todo.text}</span>
            <button
              onClick={() => handleDelete(todo._id)}
              className="text-red-600 font-medium hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}

        {todos.length === 0 && (
          <p className="text-gray-500 text-center py-8">Your list is empty.</p>
        )}
      </ul>

      <p className="text-center text-sm text-gray-500 mt-8">
        Total todos: {todos.length}
      </p>
    </main>
  );
}