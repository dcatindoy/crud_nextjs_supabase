"use client";

import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { UserModel } from "@/models/user";

export default function Home() {
  const [users, setUsers] = useState<UserModel[]>();
  const [newUser, setNewUser] = useState({ name: "", age: "", address: "" });
  const [editingUser, setEditingUser] = useState<UserModel | null>(null);

  useEffect(() => {
    fetchUsers();

    // Subscribe to real-time changes in "users" table
    const subscription = supabase
      .channel("users")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setUsers((prevUsers) => [...prevUsers, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            setUsers((prevUsers) =>
              prevUsers.map((user) =>
                user.id === payload.new.id ? payload.new : user
              )
            );
          } else if (payload.eventType === "DELETE") {
            setUsers((prevUsers) =>
              prevUsers.filter((user) => user.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  async function fetchUsers() {
    const { data, error } = await supabase.from("users").select();
    if (error) console.error("Error fetching users:", error);
    else setUsers(data);
  }

  async function handleCreateUser() {
    if (!newUser.name || !newUser.age || !newUser.address) return;
    await supabase.from("users").insert([
      {
        name: newUser.name,
        age: Number(newUser.age),
        address: newUser.address,
      },
    ]);
    setNewUser({ name: "", age: "", address: "" });
  }

  async function handleUpdateUser() {
    if (!editingUser) return;
    await supabase
      .from("users")
      .update({
        name: editingUser.name,
        age: editingUser.age,
        address: editingUser.address,
      })
      .eq("id", editingUser.id);
    setEditingUser(null);
  }

  async function handleDeleteUser(id: number) {
    await supabase.from("users").delete().eq("id", id);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* Create User Form */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-100">
        <h2 className="text-lg font-semibold mb-2">Add New User</h2>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="number"
          placeholder="Age"
          value={newUser.age}
          onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="text"
          placeholder="Address"
          value={newUser.address}
          onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
          className="border p-2 mr-2 rounded"
        />
        <button
          onClick={handleCreateUser}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Edit User Form */}
      {editingUser && (
        <div className="mb-6 p-4 border rounded-lg bg-yellow-100">
          <h2 className="text-lg font-semibold mb-2">Edit User</h2>
          <input
            type="text"
            value={editingUser.name}
            onChange={(e) =>
              setEditingUser({ ...editingUser, name: e.target.value })
            }
            className="border p-2 mr-2 rounded"
          />
          <input
            type="number"
            value={editingUser.age}
            onChange={(e) =>
              setEditingUser({ ...editingUser, age: Number(e.target.value) })
            }
            className="border p-2 mr-2 rounded"
          />
          <input
            type="text"
            value={editingUser.address}
            onChange={(e) =>
              setEditingUser({ ...editingUser, address: e.target.value })
            }
            className="border p-2 mr-2 rounded"
          />
          <button
            onClick={handleUpdateUser}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Update
          </button>
          <button
            onClick={() => setEditingUser(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
          >
            Cancel
          </button>
        </div>
      )}

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Age</th>
              <th className="py-2 px-4 text-left">Address</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{user.id}</td>
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4">{user.age}</td>
                  <td className="py-2 px-4">{user.address}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
