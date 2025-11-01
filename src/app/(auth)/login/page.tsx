"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
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
import { ChevronDown, ChevronUp } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login form submitted"); // Debug log
    setError("");
    setIsLoading(true);

    try {
      console.log("Attempting login with:", { email, password: "***" }); // Debug log

      console.log("Making API call to /api/simple-login"); // Debug log

      const isTestUser = email.trim() === "test@example.com";

      const response = await fetch("/api/simple-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          createTestUser: isTestUser, // Create the user if it's the test user and it doesn't exist
        }),
      });

      console.log("API response status:", response.status); // Debug log

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);

        // Store user info in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Set authentication cookie for middleware
        
        login(data.user);
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
        <div className="px-4 pb-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setShowCredentials(!showCredentials)}
            className="w-full py-3 flex items-center justify-between text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
          >
            <span>Demo Credentials</span>
            {showCredentials ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showCredentials ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="space-y-2 pt-2">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-blue-900 mb-2">Admin Account</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Email:</span>
                    <code className="bg-white px-2 py-1 rounded text-blue-700">admin@warehouse.com</code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Password:</span>
                    <code className="bg-white px-2 py-1 rounded text-blue-700">test123</code>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-green-900 mb-2">User Account</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Email:</span>
                    <code className="bg-white px-2 py-1 rounded text-green-700">test@example.com</code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Password:</span>
                    <code className="bg-white px-2 py-1 rounded text-green-700">test123</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
