"use client";

import AddCustomer from "@/app/components/AddCustomer";
import EditCustomer from "@/app/components/EditCustomer";
import { useCustomers } from "@/app/hooks/useCustomers";
import { useSession } from "next-auth/react";
import { TbLoader2 } from "react-icons/tb";

export default function Customers() {
  const { data: customers, isLoading, isError, refetch } = useCustomers();
  const { data: session, status: sessionStatus } = useSession();
  const userRole =
    sessionStatus === "loading" ? "user" : session?.user?.role || "user";

  return (
    <main>
      <h1 className="h-14 w-full flex items-center text-xl md:text-2xl font-semibold text-green-700">
        All Customers
      </h1>

      <div className="card flex-1 relative z-1">
        {/* ===== Table ==== */}
        <div className="w-full h-full overflow-y-scroll overflow-x-auto">
          <table className="min-w-full whitespace-nowrap mb-12">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Monthly</th>
                <th>Action</th>
              </tr>
            </thead>

            {isLoading ? (
              <tbody>
                <tr>
                  <td colSpan={7}>
                    <div className="w-full p-20 flex items-center justify-center">
                      <TbLoader2
                        size={50}
                        className="animate-spin text-green-500"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : isError || customers?.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={7}>
                    <div className="w-full p-20 flex items-center justify-center text-red-500">
                      No Customers Found.
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
                      <td>
                        {customer.isMonthly ? (
                          <span className="text-green-600">Yes</span>
                        ) : (
                          <span className="text-red-600">No</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <EditCustomer
                          customer={customer}
                          userRole={userRole}
                          refetch={refetch}
                        />
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
        {/* ===== Floating Add Button ===== */}
        <div className="fixed bottom-10 right-10">
          <AddCustomer userRole={userRole} refetch={refetch} />
        </div>
      </div>
    </main>
  );
}
