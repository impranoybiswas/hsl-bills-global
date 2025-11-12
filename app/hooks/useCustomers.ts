"use client";

import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../libs/axiosSecure";

interface UseCustomersOptions {
  name?: string;
  id?: string;
  enabled?: boolean;
}

export function useCustomers({
  name,
  id,
  enabled = true,
}: UseCustomersOptions = {}) {
  return useQuery({
    queryKey: ["customers", name, id],
    queryFn: async (): Promise<Customer[]> => {
      const params: Record<string, string> = {};
      if (name) params.name = name;
      if (id) params.id = id;
      const res = await axiosSecure.get<Customer[]>("/api/customers", {
        params,
      });
      return res.data;
    },
    enabled,
  });
}
