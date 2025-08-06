'use client';

import React from 'react';
import Header from '@/components/dashboard/Header';
import StatsCards from '@/components/dashboard/StatsCards';
import ActivityTable from '@/components/dashboard/ActivityTable';
import NotificationList from '@/components/notfications/NotificationList';
import Link from "next/link";

export default function NotificationPage() {
  return (
    <div className="min-h-screen bg-[#fafbf9] text-[#141810] font-sans flex flex-col">
      

      {/* Main content layout */}
      <div className="flex flex-1 justify-center gap-1 py-5 px-6">
        {/* Left: dashboard summary & table */}
        <div className="flex-1 max-w-[920px] flex flex-col">
          <div className="flex flex-wrap justify-between gap-3 p-4">
          </div>
          <StatsCards />
          <h2 className="text-[22px] font-bold px-4 pb-3 pt-5">Recent Stock Activity</h2>
          <ActivityTable />
        </div>

        {/* Right: notifications list */}
        <aside className="w-[360px]">
          <NotificationList />
        </aside>
      </div>
    </div>
  );
}
