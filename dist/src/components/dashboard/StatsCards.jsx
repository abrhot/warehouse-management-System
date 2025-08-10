'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const stats = [
    { label: 'Total Stock Value', value: '$2,345,678', change: '+12%', color: '#07881d' },
    { label: 'Stock Movement Today', value: '+$12,345', change: '-5%', color: '#e71f08' },
    { label: 'Alerts', value: '5', change: '+2%', color: '#07881d' },
];
const StatsCards = () => {
    return (<div className="flex flex-wrap gap-4 p-4">
      {stats.map(({ label, value, change, color }) => (<div key={label} className="flex flex-col gap-2 flex-1 min-w-[158px] p-6 rounded-lg bg-[#edf1ea]">
          <p className="text-base font-medium text-[#141810]">{label}</p>
          <p className="text-2xl font-bold text-[#141810] tracking-tight">{value}</p>
          <p className="text-base font-medium" style={{ color }}>{change}</p>
        </div>))}
    </div>);
};
exports.default = StatsCards;
