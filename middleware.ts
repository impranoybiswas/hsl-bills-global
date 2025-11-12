import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const allowedRoles = ["admin", "member", "editor"];
    const userRole = token.role as string;

    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json(
        { message: "Forbidden: Insufficient permission" },
        { status: 403 }
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/api/users/:path*", "/api/customers/:path*", "/api/bills/:path*"],
};
