"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FiEdit } from "react-icons/fi";
import axiosSecure from "../libs/axiosSecure";

export default function EditCustomer({
  customer,
  userRole,
  refetch,
}: {
  customer: Customer;
  userRole: string;
  refetch: () => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Prefill existing data if available
  const [name, setName] = useState(customer?.name || "");
  const [address, setAddress] = useState(customer?.address || "");
  const [product, setProduct] = useState(customer?.product || "");
  const [price, setPrice] = useState(String(customer?.price || ""));
  const [isMonthly, setIsMonthly] = useState(customer?.isMonthly || false);

  const handleEditCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer?._id) return toast.error("Missing customer ID!");

    setLoading(true);

    try {
      await axiosSecure.patch("/api/customers", {
        id : customer._id,
        name,
        address,
        product,
        price,
        isMonthly,
      });

      toast.success("Customer updated successfully!");
      refetch();
      setShowModal(false);
    } catch (error) {
      console.error("❌ Error updating customer:", error);
      toast.error("Failed to update customer. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center justify-center gap-2 cursor-pointer w-full h-full text-blue-600 hover:text-blue-800"
      >
        <FiEdit /> Edit
      </button>

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-10"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4 text-center">
              Edit Customer
            </h2>

            <form onSubmit={handleEditCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <input
                  type="text"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="monthly"
                  type="checkbox"
                  checked={isMonthly}
                  onChange={(e) => setIsMonthly(e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="monthly" className="text-sm text-gray-700">
                  Monthly Customer
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={userRole !== "admin" || loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                {userRole !== "admin" && (
                <p className="mt-2 text-sm text-red-500 text-center">
                  Only Admin can edit customers.
                </p>
              )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
