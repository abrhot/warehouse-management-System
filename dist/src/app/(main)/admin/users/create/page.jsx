'use client';
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CreateUserPage;
const react_1 = __importStar(require("react"));
const navigation_1 = require("next/navigation");
// A simple SVG spinner component for the loading state
const Spinner = () => (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>);
function CreateUserPage() {
    const [name, setName] = (0, react_1.useState)('');
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [role, setRole] = (0, react_1.useState)('USER'); // Default role is USER
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const router = (0, navigation_1.useRouter)();
    // This function remains UNCHANGED.
    const handleSubmit = async (e) => {
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
        }
        catch (error) {
            console.error(error);
            alert(`❌ Error: ${error.message}`);
        }
        finally {
            setIsLoading(false);
        }
    };
    // The UI is updated here for a more professional look.
    return (<main className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 p-4">
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
            <label htmlFor="name" className="mb-2 block text-sm font-semibold text-gray-600">
              Full Name
            </label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 transition-colors duration-300 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300" required/>
          </div>

          {/* --- Email Input --- */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-600">
              Email Address
            </label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 transition-colors duration-300 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300" required/>
          </div>

          {/* --- Password Input --- */}
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-600">
              Password
            </label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 transition-colors duration-300 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300" required/>
          </div>

          {/* --- Role Select --- */}
          <div>
            <label htmlFor="role" className="mb-2 block text-sm font-semibold text-gray-600">
              Role
            </label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 transition-colors duration-300 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* --- Action Buttons --- */}
          <div className="mt-10 flex items-center justify-between">
            <button type="button" onClick={() => router.push('/admin/users')} className="rounded-lg px-6 py-3 font-semibold text-gray-600 transition-colors hover:bg-gray-200">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="flex items-center justify-center rounded-lg bg-green-500 px-6 py-3 font-semibold text-white shadow-md transition-transform duration-150 ease-in-out hover:scale-105 hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-400">
              {isLoading && <Spinner />}
              {isLoading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </main>);
}
