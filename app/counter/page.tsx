"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { SignOutButton } from "@/components/signoutbutton";

export default function CounterPage() {
  const count = useQuery(api.counter.get) ?? 0;
  const increment = useMutation(api.counter.increment);
  const user = useQuery(api.todos.current)
  const todos = useQuery(api.todos.get)
  const number = todos?.length
 function  handledifresult(){
     if(number != undefined){
        return count - number 
     } 
}
  return (
    <div className="p-10 text-center">
         
         <p>current user : {user?.email}</p>
          <Link href="/">go to home</Link>
          <SignOutButton></SignOutButton>
      <h1 className="text-6xl font-bold mb-8">{count}</h1>

      <button
        onClick={() => increment({ amount: 1 })}
        className="bg-white text-black text-xl px-10 py-4 rounded-2xl font-medium hover:bg-zinc-200 active:scale-95 transition-all"
      >
        Increase Count
      </button>

      <p className="mt-6 text-zinc-500">Your personal counter</p>
        <p>{handledifresult()}</p>
    </div>
  );
}