'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email: emailOrUsername,
      password: password,
    });

    if (res?.ok) {
      // Fetch user role from session or an API
      const userInfo = await fetch('/api/auth/user-role');
      const { role } = await userInfo.json();

      if (role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-[#fafbf8] font-[Manrope,_Noto_Sans,_sans-serif] overflow-x-hidden">
      <div className="layout-container flex flex-col grow h-full">
        <div className="flex flex-1 justify-center px-40 py-5">
          <form onSubmit={handleLogin} className="layout-content-container w-full max-w-[512px] flex flex-col py-5">
            <h3 className="text-[#141b0e] text-2xl font-bold text-center pb-5">
              Login to Warehouse System
            </h3>

            {/* Email/Username Input */}
            <div className="px-4 py-3">
              <label className="block text-base font-medium pb-2">Email or Username</label>
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="Enter your email or username"
                className="form-input w-full h-14 rounded-xl border border-[#dae6d1] bg-[#fafbf8] p-[15px] placeholder-[#6f9550]"
              />
            </div>

            {/* Password Input */}
            <div className="px-4 py-3">
              <label className="block text-base font-medium pb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="form-input w-full h-14 rounded-xl border border-[#dae6d1] bg-[#fafbf8] p-[15px] placeholder-[#6f9550]"
              />
            </div>

            {error && (
              <p className="text-red-600 px-4 text-sm py-1">{error}</p>
            )}

            <div className="px-4 py-3">
              <button
                type="submit"
                className="inline-flex justify-center items-center h-12 w-full rounded-xl bg-[#78df24] text-[#141b0e] font-bold hover:bg-[#6ccd1d]"
              >
                Login
              </button>
            </div>

            <div className="flex items-center gap-4 px-4 min-h-14">
              <input type="checkbox" className="h-5 w-5 border-2 border-[#dae6d1]" />
              <p className="text-[#141b0e] text-base">Remember me</p>
            </div>

            <p className="text-[#6f9550] text-sm text-center underline px-4 pt-1">
              Forgot password?
            </p>
            <p className="text-[#6f9550] text-sm text-center px-4 pt-1 pb-3">
              Need help? Contact admin@ethio.com
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
