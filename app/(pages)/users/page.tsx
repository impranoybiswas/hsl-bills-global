"use client";

import EditUser from "@/app/components/EditUser";
import { useUsers } from "@/app/hooks/useUsers";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { TbLoader2 } from "react-icons/tb";

export default function Users() {
  const { data: users, isLoading, isError, refetch } = useUsers({});
  const { data: session, status: sessionStatus } = useSession();
  const userRole =
    sessionStatus === "loading" ? "user" : session?.user?.role || "user";

  return (
    <main>
      <h1 className="h-14 w-full flex items-center text-xl md:text-2xl font-semibold text-green-700">
        All Users
      </h1>

      <div className="card flex-1 relative z-1">
        {/* ===== Table ==== */}
        <div className="w-full h-full overflow-y-scroll overflow-x-auto">
          <table className="min-w-full whitespace-nowrap mb-12">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
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
                {users ? (
                  users?.map((user: User) => (
                    <tr
                      key={user._id}
                      className="odd:bg-white/5 even:bg-white/10 hover:bg-white/20 text-sm text-black/80"
                    >
                      <td className="px-4 py-2 flex items-center justify-center">
                        <Image 
                          src={user.image}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="rounded-md"
                        />
                      </td>
                      <td className="px-4 py-2 text-left">{user.name}</td>
                      <td className="px-4 py-2 text-left">{user.email}</td>
                      <td className="px-4 py-2 text-left font-semibold uppercase">{user.role}</td>
                      <td className="px-4 py-2 text-center">
                        <EditUser
                          user={user}
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
      </div>
    </main>
  );
}
