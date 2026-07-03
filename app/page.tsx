"use client";

import { useState } from "react";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { SignOutButton } from "@/components/signoutbutton";
import Link from "next/link";
import { Id } from "../convex/_generated/dataModel"; // Import this

export default function MainPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const todos = useQuery(api.todos.get);
  const user = useQuery(api.todos.current);

  const { signOut } = useAuthActions();
  
  const [text, setText] = useState("");

  // Create mutation with optimistic update
  const createTodo = useMutation(api.todos.create).withOptimisticUpdate(
    (localStore, args) => {
      const existingTodos = localStore.getQuery(api.todos.get);
      
      if (existingTodos !== undefined) {
        const optimisticTodo = {
          _id: crypto.randomUUID() as Id<"todos">, // Temporary ID
          _creationTime: Date.now(),
          text: args.text,
          // Add any other fields your todo has (userId, completed, etc.)
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
      // Convex will automatically rollback the optimistic update on error
    }
  };

  const handleDelete = async (id: Id<"todos">) => {
    try {
      await deleteTodo({ id });
    } catch (error) {
      console.error("Failed to delete todo:", error);
      // Convex auto-rolls back on error
    }
  };

  if (isLoading) return <p className="mt-10 text-center text-gray-500">Checking auth...</p>;
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
      <p>email: {user?.email}</p>
      <SignOutButton />
      <Link href="/contact">go to contact</Link>
      <Link href="/counter">go to counter</Link>

      <h1 className="text-2xl font-bold mb-6">My Todos</h1>

      {/* Create Form */}
      <form onSubmit={handleCreate} className="flex gap-2 mb-8">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What do you need to do?"
          className="border p-2 flex-1 rounded text-white"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Add
        </button>
      </form>

      {/* Todo List */}
      <ul className="flex flex-col gap-3">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex justify-between items-center border p-3 rounded shadow-sm"
          >
            <span>{todo.text}</span>
            <button
              onClick={() => handleDelete(todo._id)}
              className="text-red-600 font-medium hover:text-red-800"
            >
              Delete
            </button>
          </li>
        ))}

        {todos.length === 0 && (
          <p className="text-gray-500 text-center">Your list is empty.</p>
        )}
        
      </ul>
      <p>todo length : {todos.length}</p>
    </main>
  );
}