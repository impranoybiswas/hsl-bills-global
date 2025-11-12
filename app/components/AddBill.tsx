"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useCustomers } from "../hooks/useCustomers";
import axiosSecure from "../libs/axiosSecure";
import toast from "react-hot-toast";
import { generatePDF } from "../libs/generatePDF";
import { FiPlus } from "react-icons/fi";

export default function AddBill({
  userRole,
  refetch,
  addedBy,
}: {
  userRole: string;
  refetch: () => void;
  addedBy: string;
}) {
  const [customerName, setCustomerName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [expiryDate, setExpiryDate] = useState("");
  const [aprxDate, setAprxDate] = useState("");
  const [isMonthly, setIsMonthly] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { data: customers } = useCustomers();

  const canEdit = userRole === "editor" || userRole === "admin";

  // Create unique customer list for dropdown
  const uniqueCustomers = useMemo(() => {
    if (!customers) return [];
    const names = customers.map((c) => c.name);
    return Array.from(new Set(names));
  }, [customers]);

  // Currently selected customer
  const selectedCustomer = useMemo(() => {
    if (!customers || !customerName) return null;
    return customers.find((c) => c.name === customerName) || null;
  }, [customers, customerName]);

  useEffect(() => {
    if (selectedCustomer) {
      setTimeout(() => {
        setIsMonthly(selectedCustomer.isMonthly);
        setQuantity(1);
      }, 0);
    }
  }, [selectedCustomer]);

  // Handle Bill Creation
  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCustomer) {
      toast.error("Please select a customer first.");
      return;
    }

    try {
      const response = await axiosSecure.post("/api/bills", {
        customer: selectedCustomer.name,
        quantity: selectedCustomer.isMonthly ? "monthly" : quantity,
        amount: selectedCustomer.price * quantity,
        aprxDate,
        addedBy,
      });

      toast.success(
        `Bill added successfully! Invoice: ${response.data.invoice}`
      );

      refetch();

      generatePDF({
        invoice: response.data.invoice,
        date: new Date().toISOString(),
        selectedCustomer,
        quantity,
        expiryDate,
      });

      setShowModal(false);
      setCustomerName("");
      setQuantity(1);
      setExpiryDate("");
    } catch (error) {
      console.error("Error adding bill:", error);
      toast.error("Failed to add bill. Check console for details.");
    }
  };

  return (
    <div className="w-full h-full relative z-100">
      <button
        onClick={() => setShowModal(true)}
        className="bg-green-600 hover:bg-green-700 text-white rounded-full transition flex items-center justify-center cursor-pointer shadow-sm group size-12"
      >
        <FiPlus size={25} />
      </button>

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-100"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg"
          >
            <h2 className="text-lg font-semibold mb-4 text-center">
              Create New Bill
            </h2>

            <form onSubmit={handleAddBill} className="flex flex-col">
              <p className="text-sm mt-3 mb-1">Customer</p>
              <select
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="border border-black/20 px-3 py-2 rounded-md w-full mb-2"
              >
                <option value="">Select Customer</option>
                {uniqueCustomers.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <p className="text-sm mt-3 mb-1">Quantity</p>
              {!isMonthly && (
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border border-black/20 px-3 py-2 rounded-md w-full mb-2"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              )}
              <p className="text-sm mt-3 mb-1">Approximate Date</p>
              <input
                type="date"
                value={aprxDate}
                onChange={(e) => setAprxDate(e.target.value)}
                className="border border-black/20 px-3 py-2 rounded-md w-full mb-4"
              />
              <p className="text-sm mb-1">Product Expiry Date</p>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="border border-black/20 px-3 py-2 rounded-md w-full mb-4"
              />

              {selectedCustomer && (
                <p className="text-gray-700 font-medium text-center mb-3">
                  Total Amount:{" "}
                  <span className="text-green-600 font-semibold">
                    ৳{selectedCustomer.price * quantity}
                  </span>
                </p>
              )}

              <button
                type="submit"
                disabled={!canEdit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Add & Download
              </button>
            </form>
            {!canEdit && (
              <p className="mt-3 text-sm text-red-500 text-center">
                Only Admin and Editor can add new Bill
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
