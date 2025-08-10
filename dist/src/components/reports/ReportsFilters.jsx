// src/components/reports/ReportsFilters.tsx
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReportsFilters;
function ReportsFilters({ onChange }) {
    return (<div className="flex flex-col gap-3 px-4">
      <select onChange={(e) => onChange('dateRange', e.target.value)} className="h-14 rounded-xl border border-[#dae7d0] bg-[#fafcf8] px-4 text-base text-[#141b0e]">
        <option value="all">Select Date Range</option>
        <option value="30d">Last 30 Days</option>
        <option value="6m">Last 6 Months</option>
      </select>
      {/* ... Add onChange to other select elements similarly ... */}
    </div>);
}
