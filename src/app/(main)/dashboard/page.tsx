"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    // Remove token cookie (client-side fallback)
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/landing"); // Redirect to landing page
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafbf8] text-[#141b0e] font-['Manrope','Noto_Sans',sans-serif]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#edf3e8] px-10 py-3">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4">
            <svg viewBox="0 0 48 48" fill="currentColor">
              <path d="M8.57829 8.57829C5.52816 11.6284..." />
            </svg>
          </div>
          <h2 className="text-lg font-bold tracking-tight">EthioTele WMS</h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="rounded-lg bg-[#78df24] px-4 py-2 font-bold text-sm"
          >
            Logout
          </button>
          <button className="rounded-lg bg-[#edf3e8] px-4 py-2 font-bold text-sm">
            Hi, Supervisor Tewodros
          </button>
          <button className="rounded-lg bg-[#edf3e8] p-2">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
              <path d="M221.8,175.94C216.25,166.38..." />
            </svg>
          </button>
          <div
            className="w-10 h-10 rounded-full bg-cover bg-center"
            style={{ backgroundImage: `url("/images/supervisor.jpg")` }}
          />
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-col items-center px-10 py-5">
        <div className="w-full max-w-[960px]">
          <h2 className="text-2xl font-bold px-4 pb-3">Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 pb-6">
            {[
              ["Total Items", "12,345", "+12%", "#07881d"],
              ["Stock In Today", "567", "+5%", "#07881d"],
              ["Stock Out Today", "432", "-3%", "#e71f08"],
              ["Low Stock Alerts", "23", "-10%", "#e71f08"],
            ].map(([label, value, change, color]) => (
              <div key={label} className="border border-[#dae6d1] rounded-lg p-4 flex flex-col gap-1">
                <p className="text-base font-medium">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-base font-medium" style={{ color }}>{change}</p>
              </div>
            ))}
          </div>

          {/* Recent Activity Table */}
          <h2 className="text-xl font-bold px-4 pb-3">Recent Activity</h2>
          <div className="overflow-x-auto px-4">
            <table className="w-full border border-[#dae6d1] rounded-lg overflow-hidden">
              <thead className="bg-[#fafbf8]">
                <tr className="text-left text-sm font-medium">
                  <th className="px-4 py-2 w-[160px]">Time</th>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">User</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["10:30 AM", "Fiber Optic Cable", "+100", "Abebe"],
                  ["11:15 AM", "Network Switch", "-50", "Fatuma"],
                  ["12:00 PM", "Power Supply Unit", "+200", "Solomon"],
                  ["1:45 PM", "Ethernet Cable", "-75", "Tigist"],
                  ["2:30 PM", "Router", "+150", "Mulu"],
                ].map(([time, product, qty, user]) => (
                  <tr key={time} className="border-t border-[#dae6d1] text-sm">
                    <td className="px-4 py-2 text-[#6f9550]">{time}</td>
                    <td className="px-4 py-2">{product}</td>
                    <td className="px-4 py-2 text-[#6f9550]">{qty}</td>
                    <td className="px-4 py-2 text-[#6f9550]">{user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Low Stock Alerts */}
          <h2 className="text-xl font-bold px-4 pt-6 pb-3">Low Stock Alerts</h2>
          <div className="overflow-x-auto px-4">
            <table className="w-full border border-[#dae6d1] rounded-lg overflow-hidden">
              <thead className="bg-[#fafbf8]">
                <tr className="text-left text-sm font-medium">
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2 text-[#6f9550]">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Fiber Optic Cable", "15"],
                  ["Network Switch", "8"],
                  ["Power Supply Unit", "5"],
                ].map(([product, qty]) => (
                  <tr key={product} className="border-t border-[#dae6d1] text-sm">
                    <td className="px-4 py-2">{product}</td>
                    <td className="px-4 py-2 text-[#6f9550]">{qty}</td>
                    <td className="px-4 py-2 text-[#6f9550] font-bold">Restock</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-10 text-[#6f9550] text-base font-normal">
        WMS v1.0 © 2024 · <a href="#" className="underline">Help</a>
      </footer>
    </div>
  );
}
