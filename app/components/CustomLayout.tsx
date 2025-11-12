"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./Navbar";

import LayoutContent from "./LayoutContent";

const queryClient = new QueryClient();

export default function CustomLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" />
        <Navbar />
        <LayoutContent>{children}</LayoutContent>
      </QueryClientProvider>
    </SessionProvider>
  );
}
