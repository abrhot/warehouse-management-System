"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  // Change the function signature to accept a form event
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent the default form submission behavior (page reload)
    e.preventDefault(); 
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const { user } = await res.json();
        
        // Redirect based on role
        if (user.role === "ADMIN") {
          router.push("/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#fafbf8]">
      <h3 className="text-2xl font-bold mb-4">Login to Warehouse System</h3>

      {/* Wrap the inputs and button in a form with an onSubmit handler */}
      <form onSubmit={handleLogin} className="flex flex-col items-center">
        {/* Email Field */}
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email or Username"
          className="border p-3 mb-3 w-[300px] rounded-lg"
          required
        />

        {/* Password Field */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border p-3 mb-3 w-[300px] rounded-lg"
          required
        />

        {/* Error */}
        {error && <p className="text-red-600 mb-3">{error}</p>}

        {/* Login Button with type="submit" */}
        <button
          type="submit" 
          className="bg-[#78df24] hover:bg-[#6ccd1d] text-black font-bold py-2 px-6 rounded-xl"
        >
          Login
        </button>
      </form>
    </div>
  );
}