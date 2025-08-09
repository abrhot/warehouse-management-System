// C:\Users\USER\Desktop\warehouse-management\src\app\(auth)\login\page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // 👈 1. Import the signIn function

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For loading state
  const router = useRouter();

  // 👇 2. Replace the entire handleLogin function with this new version
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Use the signIn function from NextAuth.js
      const result = await signIn("credentials", {
        // We handle the redirect manually
        redirect: false,
        email: email,
        password: password,
      });

      if (result?.ok) {
        // If login is successful, redirect to the dashboard
        router.push("/dashboard");
      } else {
        // If there's an error, display it
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-500">
            Login to the Warehouse Management System
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 transition-colors duration-300 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

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
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 transition-colors duration-300 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <button
  type="submit"
  disabled={isLoading}
  className="flex items-center justify-center rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-transform duration-150 ease-in-out hover:scale-105 hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-400"
>
  {isLoading ? "Logging in..." : "Login"}
</button>
          </div>
        </form>
      </div>
    </div>
  );
}