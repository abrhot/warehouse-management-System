'use client';

import React, { useState, ChangeEvent } from 'react';

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

interface MessageBoxProps {
  message: string;
  type: 'success' | 'error' | '';
  onClose: () => void;
}

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

interface MessageState {
  text: string;
  type: 'success' | 'error' | '';
}

export default function CreateUserPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<MessageState>({ text: '', type: '' });
  const [searchQuery, setSearchQuery] = useState('');

  // Handler for the search input field
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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

      setMessage({
        text: `User "${data.name}" created successfully!`,
        type: 'success',
      });

      setName('');
      setEmail('');
      setPassword('');
      setRole('USER');
    } catch (error: any) {
      console.error(error);
      setMessage({
        text: `Failed to create user: ${error.message}`,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Create New User</h2>
          <p className="mt-2 text-sm text-gray-500">
            Fill in the details below to add a new user to the system.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="mt-4 mb-6 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... rest of your form stays the same */}
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