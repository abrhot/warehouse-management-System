'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NotificationPage;
const react_1 = __importDefault(require("react"));
const StatsCards_1 = __importDefault(require("@/components/dashboard/StatsCards"));
const ActivityTable_1 = __importDefault(require("@/components/dashboard/ActivityTable"));
const NotificationList_1 = __importDefault(require("@/components/notfications/NotificationList"));
function NotificationPage() {
    return (<div className="min-h-screen bg-[#fafbf9] text-[#141810] font-sans flex flex-col">
      

      {/* Main content layout */}
      <div className="flex flex-1 justify-center gap-1 py-5 px-6">
        {/* Left: dashboard summary & table */}
        <div className="flex-1 max-w-[920px] flex flex-col">
          <div className="flex flex-wrap justify-between gap-3 p-4">
          </div>
          <StatsCards_1.default />
          <h2 className="text-[22px] font-bold px-4 pb-3 pt-5">Recent Stock Activity</h2>
          <ActivityTable_1.default />
        </div>

        {/* Right: notifications list */}
        <aside className="w-[360px]">
          <NotificationList_1.default />
        </aside>
      </div>
    </div>);
}
