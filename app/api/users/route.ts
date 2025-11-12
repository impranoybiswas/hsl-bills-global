import { getUsersCollection } from "@/app/libs/collection";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

// =======================
// GET → Fetch Users
// =======================
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email");

    const collection = await getUsersCollection();

    const query: Record<string, string | ObjectId> = {};

    if (email) query.email = email;

    const result = await collection.find(query).toArray();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// =======================
// PATCH → Update User Role
// =======================
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    const collection = await getUsersCollection();
    const result = await collection.updateOne(
      { email: body.email },
      {
        $set: {
          role: body.role,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User Role updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/users error:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
