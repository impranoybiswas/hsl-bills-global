"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function UserView() {
  const { data: session, status } = useSession();
  return (
    <main>
      <h1 className="text-3xl md:text-4xl font-semibold text-green-700 mb-6">
        Welcome to HSL Bills
      </h1>
      <p className="text-lg font-semibold text-center">
        Hello {status === "loading" ? "User" : session?.user?.name}
      </p>
      <p className="mt-2 text-center">
        Please Contact{" "}
        <Link
          href="https://impranoybiswas.vercel.app/"
          className="font-semibold text-blue-500 hover:text-blue-700"
        >
          Pranoy
        </Link>{" "}
        to update your role (Admin, Viewer, Editor)
      </p>
    </main>
  );
}
