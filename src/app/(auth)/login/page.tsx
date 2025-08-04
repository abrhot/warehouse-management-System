"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async () => {
  try {
    const res = await fetch("api\auth\login\route.ts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const { user } = await res.json();

      // Redirect based on role
      if (user.role === "ADMIN") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/user");
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

      {/* Email Field */}
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email or Username"
        className="border p-3 mb-3 w-[300px] rounded-lg"
      />

      {/* Password Field */}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border p-3 mb-3 w-[300px] rounded-lg"
      />

      {/* Error */}
      {error && <p className="text-red-600 mb-3">{error}</p>}

      {/* Login Button */}
      <button
        onClick={handleLogin}
        className="bg-[#78df24] hover:bg-[#6ccd1d] text-black font-bold py-2 px-6 rounded-xl"
      >
        Login
      </button>
    </div>
  );
}
