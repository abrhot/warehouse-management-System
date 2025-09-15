'use client';

import React, { useState } from 'react';

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

// Define a type for the props of the MessageBox component
interface MessageBoxProps {
  message: string;
  type: 'success' | 'error' | '';
  onClose: () => void;
}

// A simple message box component to replace alerts and toasts
// Update the function signature to use the defined interface
const MessageBox = ({ message, type, onClose }: MessageBoxProps) => {
  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-blue-200' : 'bg-red-500';
  const textColor = isSuccess ? 'text-blue-800' : 'text-white';
  const title = isSuccess ? 'Success' : 'Error';

  if (!message) return null;

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-xs rounded-lg p-4 shadow-lg ${bgColor} ${textColor}`}>
      <div className="flex justify-between items-center">
        <h3 className="font-bold">{title}</h3>
        <button onClick={onClose} className={`opacity-70 hover:opacity-100 ${isSuccess ? 'text-blue-800' : 'text-white'}`}>
          &times;
        </button>
      </div>
      <p className="mt-2 text-sm">{message}</p>
    </div>
  );
};

export default function CreateUserPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER'); // Default role is USER
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // This function is updated to use the custom message box
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

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

      // Show success message
      setMessage({
        text: `User "${data.name}" created successfully!`,
        type: 'success',
      });
      // Clear form after successful submission
      setName('');
      setEmail('');
      setPassword('');
      setRole('USER');
      
    } catch (error: any) {
      console.error(error);
      // Show error message
      setMessage({
        text: `Failed to create user: ${error.message}`,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // The UI is updated here for a more professional look.
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Create New User
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Fill in the details below to add a new user to the system.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="mt-10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {}} // Placeholder for back navigation
              className="bg-white text-black font-bold px-6 py-3 border border-gray-300 rounded-md transition-colors hover:bg-blue-600 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center bg-white text-black font-bold px-6 py-3 border border-gray-300 rounded-md transition-colors hover:bg-blue-600 hover:text-white disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              {isLoading && <Spinner />}
              {isLoading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
      <MessageBox
        message={message.text}
        type={message.type}
        onClose={() => setMessage({ text: '', type: '' })}
      />
    </main>
  );
}