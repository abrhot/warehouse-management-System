import React from "react";
import MainNav from "@/components/layout/MainNav";
import Link from "next/link";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafbf9] text-[#141810] flex flex-col">
      <MainNav />
      <main className="flex-1 px-6 py-4">{children}</main>
    </div>
  );
}
