// components/signoutbutton.tsx
"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const { signOut } = useAuthActions();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-red-600 hover:bg-red-700 active:bg-red-800 transition-all font-medium px-8 py-4 rounded-2xl text-white flex-1"
    >
      Sign Out
    </button>
  );
}