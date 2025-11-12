"use client";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function GuestView() {
  return (
    <main>
      <h1 className="text-3xl md:text-4xl font-semibold text-green-700 mb-7">
        Welcome to HSL Bills
      </h1>
      <button
        onClick={() => signIn("google")}
        className="flex items-center gap-3 bg-white border border-gray-300 py-3 px-5 rounded-lg shadow hover:bg-black/5 transition font-medium cursor-pointer"
      >
        <FcGoogle className="size-6" />
        Continue with Google
      </button>
      <p className="mt-5 mb-2 text-green-500">
        Signed in to Show Bills and Add New Bills
      </p>
      <p className="mt-1 text-sm text-black/70">
        Viewer can only see the list of Bills
      </p>
      <p className="mt-1 text-sm text-black/70">
        Editor can add new Bills and update existing Bills
      </p>
    </main>
  );
}
