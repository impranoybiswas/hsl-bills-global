import { getCustomersCollection } from "@/app/libs/collection";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const name = searchParams.get("name");
    const id = searchParams.get("id");

    const collection = await getCustomersCollection();

    const query: Record<string, string | ObjectId> = {};

    if (name) query.name = name;
    if (id) query._id = new ObjectId(id); // ✅ Correct way

    const result = await collection.find(query).toArray();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("GET /api/customers error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// =======================
// POST → Add a New Customer
// =======================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, address, price, isMonthly, product } = body;

    // ✅ Basic validation (allow false boolean)
    if (!name || !address || price === undefined || isMonthly === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const collection = await getCustomersCollection();

    // ✅ Fetch the latest customer to determine next ID
    const lastCustomer = await collection
      .find({})
      .sort({ customerId: -1 })
      .limit(1)
      .toArray();

    // ✅ Generate next sequential ID
    const nextId =
      lastCustomer.length > 0
        ? String(Number(lastCustomer[0].customerId) + 1).padStart(4, "0")
        : "0001";

    // ✅ Prepare the new customer document
    const newCustomer = {
      customerId: nextId,
      name,
      address,
      product,
      price: Number(price),
      isMonthly: Boolean(isMonthly),
      createdAt: new Date().toISOString(),
    };

    // ✅ Insert into MongoDB
    const result = await collection.insertOne(newCustomer);

    return NextResponse.json(
      { insertedId: result.insertedId, ...newCustomer },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/customers error:", error);
    return NextResponse.json(
      { error: "Failed to add customer" },
      { status: 500 }
    );
  }
}

// =======================
// PATCH → Update Bill Status
// =======================
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, address, product, price, isMonthly } = body;

    if (!id) {
      return NextResponse.json({ error: "ID are required" }, { status: 400 });
    }

    const collection = await getCustomersCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          product,
          address,
          price: Number(price),
          isMonthly: Boolean(isMonthly),
          updatedAt: new Date().toISOString(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Customer updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/customers error:", error);
    return NextResponse.json(
      { error: "Failed to update bill status" },
      { status: 500 }
    );
  }
}
