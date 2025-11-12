import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }
}

declare global {
  interface Bill {
    _id: string;
    invoice: string;
    customer: string;
    quantity: number | string;
    amount: number;
    status?: string;
    date: string;
    method?: string;
    paidAt?: string | Date;
    aprxDate?: string | Date;
    addedBy?: string;
  }

  interface Customer {
    _id: string;
    customerId: string;
    name: string;
    address: string;
    price: number;
    isMonthly: boolean;
    product: string;
  }

  interface User {
    _id: string;
    role: string;
    name: string;
    email: string;
    image: string;
  }

  interface Invoice {
    invoice: string;
    date: string;
    selectedCustomer: Customer;
    quantity: number;
    expiryDate: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}

export {};
