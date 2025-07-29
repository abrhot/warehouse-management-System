"use client";

import React from "react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#fafbf8] font-[Manrope,_Noto_Sans,_sans-serif] overflow-x-hidden">
      <div className="layout-container flex flex-col grow h-full">
        <header className="flex items-center justify-between border-b border-[#edf3e8] px-10 py-3"></header>
        <div className="flex flex-1 justify-center px-40 py-5">
          <div className="layout-content-container w-full max-w-[512px] flex flex-col py-5">
            <h3 className="text-[#141b0e] text-2xl font-bold leading-tight tracking-light px-4 text-center pb-2 pt-5">
              Login to Warehouse System
            </h3>

            {/* Email Input */}
            <div className="max-w-[480px] flex flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#141b0e] text-base font-medium leading-normal pb-2">
                  Email or Username
                </p>
                <input
                  type="text"
                  placeholder="Enter your email or username"
                  className="form-input w-full h-14 rounded-xl border border-[#dae6d1] bg-[#fafbf8] p-[15px] text-base text-[#141b0e] placeholder-[#6f9550] focus:border-[#dae6d1] focus:outline-none"
                />
              </label>
            </div>

            {/* Password Input */}
            <div className="max-w-[480px] flex flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#141b0e] text-base font-medium leading-normal pb-2">
                  Password
                </p>
                <div className="flex w-full rounded-xl overflow-hidden">
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="form-input w-full h-14 border border-r-0 border-[#dae6d1] bg-[#fafbf8] p-[15px] pr-2 text-base text-[#141b0e] placeholder-[#6f9550] focus:border-[#dae6d1] focus:outline-none rounded-r-none"
                  />
                  <div className="flex items-center justify-center border border-l-0 border-[#dae6d1] bg-[#fafbf8] px-3 rounded-r-xl text-[#6f9550]">
                    {/* Eye Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M247.31,124.76c...Z" />
                    </svg>
                  </div>
                </div>
              </label>
            </div>

            <div className="px-4 py-3">
  <Link
    href="/dashboard"
    className="inline-flex justify-center items-center h-12 w-full max-w-[480px] rounded-xl bg-[#78df24] text-[#141b0e] text-base font-bold tracking-[0.015em] transition hover:bg-[#6ccd1d]"
  >
    Login
  </Link>
</div>


            {/* Remember Me & Forgot Password */}
            <div className="flex items-center gap-4 px-4 min-h-14">
              <input
                type="checkbox"
                className="h-5 w-5 border-2 border-[#dae6d1] text-[#78df24] focus:ring-0 focus:outline-none rounded"
              />
              <p className="text-[#141b0e] text-base font-normal">Remember me</p>
            </div>

            <p className="text-[#6f9550] text-sm font-normal text-center underline px-4 pt-1">
              Forgot password?
            </p>
            <p className="text-[#6f9550] text-sm font-normal text-center px-4 pt-1 pb-3">
              Need help? Contact admin@ethio.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
