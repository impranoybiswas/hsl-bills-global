"use client";

import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../libs/axiosSecure";

export function useUsers({
  email,
  enabled = true,
}: {
  email?: string;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ["users", email],
    queryFn: async (): Promise<User[]> => {
      const params: Record<string, string> = {};
      if (email) params.email = email;
      const res = await axiosSecure.get<User[]>("/api/users", {
        params,
      });
      return res.data;
    },
    enabled,
  });
}
