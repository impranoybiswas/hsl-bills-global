"use client";

import { useCustomers } from "@/app/hooks/useCustomers";
import { TbLoader2 } from "react-icons/tb";

export default function Customers() {
  const { data: customers, isLoading, isError } = useCustomers();

  return (
    <main>
      <h1 className="h-14 w-full flex items-center text-xl md:text-2xl font-semibold text-green-700">
        All Customers
      </h1>

      <div className="card flex-1">
        {/* ===== Table ==== */}
        <div className="w-full h-full overflow-y-scroll overflow-x-auto">
          <table className="min-w-full whitespace-nowrap">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Product</th>
                <th>Amount</th>
              </tr>
            </thead>

            {isLoading ? (
              <tbody>
                <tr>
                  <td colSpan={5}>
                    <div className="w-full h-50 flex items-center justify-center">
                      <TbLoader2
                        size={50}
                        className="animate-spin text-green-500"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : isError ? (
              <tbody>
                <tr>
                  <td colSpan={5}>
                    <div className="w-full h-50 flex items-center justify-center text-red-500">
                      Failed to load customers.
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {customers ? (
                  customers?.map((customer: Customer) => (
                    <tr
                      key={customer._id}
                      className="odd:bg-white/5 even:bg-white/10 hover:bg-white/20 text-sm text-black/80"
                    >
                      <td className="px-4 py-2 text-center">
                        {customer.customerId}
                      </td>
                      <td className="px-4 py-2 text-left">{customer.name}</td>
                      <td className="px-4 py-2 text-left">
                        {customer.address}
                      </td>
                      <td className="px-4 py-2 text-left">
                        {customer.product || "—"}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold">
                        {customer?.price
                          ? customer.price.toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </main>
  );
}
