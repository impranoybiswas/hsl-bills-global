"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import Loading from "../loading";
import GuestView from "./GuestView";
import UserView from "./UserView";

export default function LayoutContent({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const userRole = session?.user?.role || "user";

  if (status === "loading") return <Loading />;
  if (status === "unauthenticated") return <GuestView />;
  if (status === "authenticated") {
    if (userRole === "user") return <UserView />;
    if (["viewer", "editor", "admin"].includes(userRole)) return children;
  }

  return null;
}
