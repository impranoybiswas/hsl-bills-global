"use client";

import React, { useState } from "react";
import axiosSecure from "../libs/axiosSecure";
import toast from "react-hot-toast";
import { FiPlus } from "react-icons/fi";

export default function AddCustomer({
  userRole,
  refetch,
}: {
  userRole: string;
  refetch: () => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [isMonthly, setIsMonthly] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle form submit
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !address || !price) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (userRole !== "admin") {
      toast.error("Only Admin can add a new customer.");
      return;
    }

    try {
      setLoading(true);
      await axiosSecure.post("/api/customers", {
        name,
        address,
        product,
        price: Number(price),
        isMonthly,
      });

      toast.success(`Customer added successfully!`);
      setShowModal(false);
      setName("");
      setAddress("");
      setPrice("");
      setIsMonthly(false);
      refetch();
    } catch (error) {
      console.error("Error adding customer:", error);
      toast.error("Failed to add customer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full relative">
      <button
        onClick={() => setShowModal(true)}
        className="bg-green-600 hover:bg-green-700 text-white rounded-full transition flex items-center justify-center cursor-pointer shadow-sm group size-12"
      >
        <FiPlus size={25} />
      </button>

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg"
          >
            <h2 className="text-lg font-semibold mb-4 text-center text-green-700">
              Add New Customer
            </h2>

            <form onSubmit={handleAddCustomer} className="flex flex-col gap-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Customer Name"
                className="border px-3 py-2 rounded-md w-full"
              />

              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                className="border px-3 py-2 rounded-md w-full"
              />

              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Product"
                className="border px-3 py-2 rounded-md w-full"
              />

              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                className="border px-3 py-2 rounded-md w-full"
              />

              <div className="flex items-center justify-between border px-3 py-2 rounded-md">
                <label className="font-medium text-gray-700">
                  Is Monthly Customer?
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="isMonthly"
                      checked={isMonthly}
                      onChange={() => setIsMonthly(true)}
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="isMonthly"
                      checked={!isMonthly}
                      onChange={() => setIsMonthly(false)}
                    />
                    No
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={userRole !== "admin" || loading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Adding..." : "Add Customer"}
              </button>

              {userRole !== "admin" && (
                <p className="mt-2 text-sm text-red-500 text-center">
                  Only Admin can add customers.
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
