'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// A simple SVG spinner component for the loading state
const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default function CreateUserPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER'); // Default role is USER
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // This function remains UNCHANGED.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      alert(`✅ User "${data.name}" created successfully!`);
      router.push('/admin/users'); // Navigate back to the user list
    } catch (error: any) {
      console.error(error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // The UI is updated here for a more professional look.
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        {/* --- Form Header --- */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Create New User</h1>
          <p className="mt-2 text-sm text-gray-500">
            Fill in the details below to add a new user to the system.
          </p>
        </div>

        {/* --- Form --- */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --- Full Name Input --- */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-gray-600"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 transition-colors duration-300 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          {/* --- Email Input --- */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-600"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 transition-colors duration-300 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          {/* --- Password Input --- */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-gray-600"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 transition-colors duration-300 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          {/* --- Role Select --- */}
          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-semibold text-gray-600"
            >
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 transition-colors duration-300 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* --- Action Buttons --- */}
          <div className="mt-10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push('/admin/users')}
              className="rounded-lg px-6 py-3 font-semibold text-gray-600 transition-colors hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
className="flex items-center justify-center rounded-lg bg-green-500 px-6 py-3 font-semibold text-white shadow-md transition-transform duration-150 ease-in-out hover:scale-105 hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-400"            >
              {isLoading && <Spinner />}
              {isLoading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}