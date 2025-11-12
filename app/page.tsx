"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { GoCheckCircleFill } from "react-icons/go";
import { MdRadioButtonChecked } from "react-icons/md";
import { TbLoader2 } from "react-icons/tb";
import { useSession } from "next-auth/react";
import { useBills } from "./hooks/useBills";
import { useCustomers } from "./hooks/useCustomers";
import EditBill from "./components/EditBill";
import AddBill from "./components/AddBill";

export default function Home() {
  const { data: session, status: sessionStatus } = useSession();
  const userRole =
    sessionStatus === "loading" ? "user" : session?.user?.role || "user";
  const userEmail =
    sessionStatus === "loading" ? "-" : session?.user?.email || "-";
  const [status, setStatus] = useState("");
  const [customer, setCustomer] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const {
    data: bills = [],
    isLoading,
    isError,
    refetch,
  } = useBills({ status, customer, sortOrder });

  const { data: customers } = useCustomers();

  const uniqueCustomers = useMemo(() => {
    if (!customers) return [];
    const names = customers.map((c) => c.name);
    return Array.from(new Set(names));
  }, [customers]);

  const totalPaid = useMemo(
    () =>
      bills
        .filter((b) => b.status === "paid")
        .reduce((sum, b) => sum + b.amount, 0),
    [bills]
  );

  const totalPending = useMemo(
    () =>
      bills
        .filter((b) => b.status === "pending")
        .reduce((sum, b) => sum + b.amount, 0),
    [bills]
  );

  return (
    <main>
      {/* ===== States ==== */}
      <div className="w-full grid grid-cols-2 gap-2 md:gap-3 lg:gap-5 pt-2 pb-5">
        <div className="card p-3 md:p-4">
          <span className="text-xs md:text-sm font-semibold">
            <span className="hidden md:inline-block">Total</span> Paid
          </span>
          <strong className="text-green-600 font-bold text-lg md:text-3xl lg:text-4xl text-shadow-2xs">
            ৳{totalPaid.toLocaleString()}
          </strong>
        </div>

        <div className="card p-3 md:p-5">
          <span className="text-xs md:text-sm font-semibold">
            <span className="hidden md:inline-block">Total</span> Pending
          </span>
          <strong className="text-orange-600 font-bold text-lg md:text-3xl lg:text-4xl text-shadow-2xs">
            ৳{totalPending.toLocaleString()}
          </strong>
        </div>
      </div>

      <div className="card flex-1 flex flex-col overflow-hidden">
        {/* ===== Filters ==== */}
        <div className="flex items-center justify-between gap-2 p-3">
          <div className="flex gap-2">
            <div className="dropCard">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="dropCard">
              <select
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
              >
                <option value="">Customers</option>
                {uniqueCustomers.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="dropCard">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="select"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {/* ===== Table ==== */}

        <div className="w-full h-full overflow-y-scroll overflow-x-auto">
          <table className="min-w-full whitespace-nowrap mb-12">
            <thead className="sticky -top-0.5">
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Quantity</th>
                <th>Amount</th>
                <th>Approximate</th>
                <th>Status</th>
                <th>Paid At</th>
                <th>Method</th>
                <th>Added By</th>
                <th>Actions</th>
              </tr>
            </thead>

            {isLoading ? (
              <tbody>
                <tr>
                  <td colSpan={9}>
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
                  <td colSpan={9}>
                    <div className="w-full h-50 flex items-center justify-center text-green-500">
                      Failed to load bills.
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {bills.map((bill) => (
                  <tr
                    key={bill._id}
                    className="odd:bg-transparent even:bg-black/2 hover:bg-black/3 text-sm text-black/90"
                  >
                    <td>{bill.invoice}</td>
                    <td>{format(bill.date, "dd MMM yyyy")}</td>
                    <td>{bill.customer}</td>
                    <td className="capitalize">{bill.quantity}</td>
                    <td className="text-right font-semibold">
                      {bill.amount.toLocaleString()}
                    </td>
                    <td>
                      {format(bill.aprxDate || new Date(), "dd MMM yyyy")}
                    </td>
                    <td>
                      {bill.status === "paid" ? (
                        <span className="flex items-center gap-2 text-green-600">
                          <GoCheckCircleFill /> PAID
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-orange-600">
                          <MdRadioButtonChecked /> PENDING
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {bill.status === "paid"
                        ? format(bill.paidAt || new Date(), "dd MMM yyyy")
                        : "—"}
                    </td>
                    <td className="uppercase font-semibold">
                      {bill.method || "—"}
                    </td>
                    <td className="text-sm text-black/60">
                      {bill.addedBy || "—"}
                    </td>
                    <td className="bg-blue-50/30">
                      <EditBill
                        userRole={userRole}
                        bill={bill}
                        refetch={refetch}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {/* ===== Floating Add Button ===== */}
        <div className="fixed bottom-10 right-10">
          <AddBill userRole={userRole} refetch={refetch} addedBy={userEmail} />
        </div>
      </div>
    </main>
  );
}
