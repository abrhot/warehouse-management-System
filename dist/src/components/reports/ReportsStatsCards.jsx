// src/components/reports/ReportsStatsCards.tsx
'use client'; // <-- Add this to make it a Client Component
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReportsStatsCards;
const swr_1 = __importDefault(require("swr"));
// A simple fetcher function
const fetcher = (url) => fetch(url).then(res => res.json());
function ReportsStatsCards() {
    const { data, error, isLoading } = (0, swr_1.default)('/api/reports/stats', fetcher, {
        refreshInterval: 30000 // Optional: refetch data every 30 seconds
    });
    if (error)
        return <div>Failed to load stats</div>;
    if (isLoading)
        return <div>Loading...</div>; // You can add a shimmer/skeleton loader here
    const stats = [
        { label: 'Total Stock In', value: (data === null || data === void 0 ? void 0 : data.totalStockIn.toLocaleString()) || '0' },
        { label: 'Total Stock Out', value: (data === null || data === void 0 ? void 0 : data.totalStockOut.toLocaleString()) || '0' },
        { label: 'Low Stock Alerts', value: (data === null || data === void 0 ? void 0 : data.lowStockAlerts.toLocaleString()) || '0' },
        { label: 'Total Products Managed', value: (data === null || data === void 0 ? void 0 : data.totalProductsManaged.toLocaleString()) || '0' },
    ];
    return (<div className="flex flex-wrap gap-4 px-4 py-4">
      {stats.map((item, idx) => (<div key={idx} className="flex flex-col flex-1 min-w-[158px] bg-[#edf3e7] p-6 rounded-xl gap-2">
          <p className="text-[#141b0e] text-base font-medium">{item.label}</p>
          <p className="text-[#141b0e] text-2xl font-bold tracking-light">{item.value}</p>
        </div>))}
    </div>);
}
