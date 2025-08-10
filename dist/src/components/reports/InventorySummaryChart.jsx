"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InventorySummaryChart;
// src/components/reports/InventorySummaryChart.tsx
function InventorySummaryChart() {
    return (<div className="flex flex-col flex-1 min-w-72 border border-[#dae7d0] p-6 rounded-xl">
      <p className="text-base font-medium text-[#141b0e]">Stock In/Out Trends</p>
      <p className="text-[32px] font-bold text-[#141b0e] truncate">+15%</p>
      <div className="flex gap-1">
        <p className="text-[#6f974e] text-base">Last 30 Days</p>
        <p className="text-[#07881d] text-base font-medium">+15%</p>
      </div>
      <div className="py-4">
        <img src="/images/stock-trend.svg" alt="Stock Trends Chart" className="w-full h-40 object-contain"/>
        <div className="flex justify-around text-[#6f974e] text-xs font-bold mt-2">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map(month => (<p key={month}>{month}</p>))}
        </div>
      </div>
    </div>);
}
