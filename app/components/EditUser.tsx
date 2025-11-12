"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FiEdit } from "react-icons/fi";
import axiosSecure from "../libs/axiosSecure";

export default function EditUser({
  user,
  userRole,
  refetch,
}: {
  user: User;
  userRole: string;
  refetch: () => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [newRole, setNewRole] = useState("");

  const handleEditBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user._id) return;

    if (!newRole) {
      toast.error("Please select a new role.");
      return;
    }

    try {
      await axiosSecure.patch("/api/users", { email : user.email, role: newRole });

      toast.success("User Role updated successfully!");
      refetch();
      setShowModal(false);
    } catch (error) {
      console.error("❌ Error updating role:", error);
      toast.error("Failed to update role. Check console for details.");
    }
  };
  return (
    <div className="w-full h-full">
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center justify-center gap-2 cursor-pointer w-full h-full text-blue-600 hover:text-blue-800"
      >
        <FiEdit /> Update
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
            <h2 className="text-xl font-semibold mb-4">Edit User Role</h2>
            <p className="text-sm text-left mb-4">
              <b>Name : </b> {user.name} <br/>
              <b>Email : </b> {user.email}
            </p>
            <form onSubmit={handleEditBill} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  User Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                >
                  <option value="user">User</option>
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
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
                  disabled={userRole !== "admin"}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </div>
            </form>
            {userRole !== "admin" && (
              <p className="mt-3 text-sm text-red-500 text-center">
                Only Admin can update Role
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
