// src/app/(main)/reports/page.tsx
'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReportsPage;
const react_1 = require("react");
const ReportsHeader_1 = __importDefault(require("@/components/reports/ReportsHeader"));
const ReportsFilters_1 = __importDefault(require("@/components/reports/ReportsFilters"));
const ReportsStatsCards_1 = __importDefault(require("@/components/reports/ReportsStatsCards"));
const InventorySummaryChart_1 = __importDefault(require("@/components/reports/InventorySummaryChart"));
const CategoryChart_1 = __importDefault(require("@/components/reports/CategoryChart"));
const LowStockTable_1 = __importDefault(require("@/components/reports/LowStockTable"));
const RequestHistoryTable_1 = __importDefault(require("@/components/reports/RequestHistoryTable")); // <-- Import the new component
const ReportsActions_1 = __importDefault(require("@/components/reports/ReportsActions"));
function ReportsPage() {
    const [filters, setFilters] = (0, react_1.useState)({
        dateRange: 'all',
        category: 'all',
        warehouse: 'all',
    });
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => (Object.assign(Object.assign({}, prev), { [filterName]: value })));
    };
    return (<div className="px-40 py-5 bg-[#fafcf8] min-h-screen flex justify-center">
      <div className="w-full max-w-[960px] flex flex-col">
        <ReportsHeader_1.default />
        <ReportsFilters_1.default onChange={handleFilterChange}/>
        <ReportsStatsCards_1.default />

        <h2 className="text-[22px] font-bold px-4 pt-5 pb-3 text-[#141b0e]">Inventory Summary</h2>
        <div className="flex flex-wrap gap-4 px-4 py-6">
          <InventorySummaryChart_1.default />
          <CategoryChart_1.default />
        </div>

        <h2 className="text-[22px] font-bold px-4 pt-5 pb-3 text-[#141b0e]">Low Stock Alerts</h2>
        <LowStockTable_1.default />

        {/* 👇 Add the new section and component here */}
        <h2 className="text-[22px] font-bold px-4 pt-5 pb-3 text-[#141b0e]">Request History</h2>
        <RequestHistoryTable_1.default />

        <ReportsActions_1.default />
      </div>
    </div>);
}
