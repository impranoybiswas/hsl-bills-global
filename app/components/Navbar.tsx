"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiDotsVertical } from "react-icons/hi";

const items = [
  {
    name: "Bills",
    href: "/",
  },
  {
    name: "Users",
    href: "/users",
  },
  {
    name: "Customers",
    href: "/customers",
  },

  {
    name: "Pranoy",
    href: "https://hsl-bills-pranoy.vercel.app/",
  },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed z-60 bg-white h-14 w-full border-b border-green-500/50 shadow flex items-center justify-between px-4 md:px-8 lg:px-12">
      <Link
      href={"/"}
      className="h-8 w-fit"
      >
        <Image
        className="h-full w-full"
        src="/title.png"
        alt="HSL Title"
        width={100}
        height={100}
      />
      </Link>
      {status === "loading" && (
        <AiOutlineLoading3Quarters size={20} className="animate-spin" />
      )}
      {status === "authenticated" && (
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            {items.map((item) => (
              <Link key={item.name} href={item.href} className="nav-button">
                {item.name}
              </Link>
            ))}
          </div>
          <button onClick={() => signOut()} className="nav-button">
            Log out
          </button>
          <Image
            className="size-8 rounded-md object-cover shadow-sm border border-green-500/50"
            src={session?.user?.image || "/title.png"}
            alt="HSL Title"
            width={100}
            height={100}
          />

          <div className="relative z-100">
            <HiDotsVertical
              onClick={() => setIsOpen(!isOpen)}
              className="size-6 rounded-full object-cover flex md:hidden justify-center items-center font-semibold text-green-700"
            />

            <div
              className={`absolute top-10 right-0 rounded-b-md shadow bg-green-50 min-h-32 cursor-pointer transition-all duration-300 ease-in-out pt-2 px-4 pb-4 flex flex-col gap-3 z-50  ${
                isOpen ? "translate-x-0 opacity-100" : "translate-x-70 opacity-0"
              }`}
            >
              {items.map((item) => (
                <Link key={item.name} href={item.href} className="nav-button">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
