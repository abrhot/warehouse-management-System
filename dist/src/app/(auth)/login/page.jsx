"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");

function LoginPage() {
    const [email, setEmail] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)("");
    const [isLoading, setIsLoading] = (0, react_1.useState)(false); 
    const router = (0, navigation_1.useRouter)();
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        
        try {
            console.log(`[Login] Attempting login for: ${email}`);
            // Use the simple-login API that sets JWT tokens
            const response = await fetch('/api/auth/simple-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            console.log(`[Login] Response status: ${response.status}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log(`[Login] Login successful:`, data);
                console.log(`[Login] Current cookies:`, document.cookie);
                
                // Add a longer delay to ensure cookie is set and use window.location for full page reload
                setTimeout(() => {
                    console.log(`[Login] Redirecting to dashboard...`);
                    window.location.replace("/dashboard");
                }, 500);
            } else {
                const errorData = await response.json();
                console.log(`[Login] Login failed:`, errorData);
                setError(errorData.message || "Invalid email or password. Please try again.");
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (<div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-500">
            Login to the Warehouse Management System
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-600">
              Email Address
            </label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 transition-colors duration-300 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300" required/>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-600">
              Password
            </label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 transition-colors duration-300 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300" required/>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-transform duration-150 ease-in-out hover:scale-105 hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-400">
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>);
}
