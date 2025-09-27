"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login form submitted"); // Debug log
    setError("");
    setIsLoading(true);

    try {
      console.log("Attempting login with:", { email, password: "***" }); // Debug log

      // Simple hardcoded test login
      if (email === "test@example.com" && password === "test123") {
        console.log("Using hardcoded test credentials"); // Debug log
        // Store user info in localStorage for now
        localStorage.setItem("user", JSON.stringify({
          id: "test-user",
          email: "test@example.com",
          name: "Test User",
          role: "USER"
        }));
        console.log("Redirecting to dashboard..."); // Debug log
        router.push("/dashboard");
        return;
      }

      console.log("Making API call to /api/simple-login"); // Debug log
      // Try the API
      const response = await fetch("/api/simple-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      console.log("API response status:", response.status); // Debug log

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);

        // Store user info in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Set authentication cookie for middleware
        if (data.token) {
          document.cookie = `authToken=${data.token}; path=/; max-age=86400`; // 24 hours
        }
        
        console.log("User stored in localStorage, redirecting to dashboard..."); // Debug log
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        console.log("Login failed:", errorData); // Debug log
        setError(errorData.error || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>Warehouse Management</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
        <div className="p-4 text-center text-sm text-gray-600">
          <p>Test credentials:</p>
          <p><strong>test@example.com</strong> / <strong>test123</strong></p>
        </div>
      </Card>
    </div>
  );
}
