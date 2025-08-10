// src/components/reports/ReportsActions.tsx
'use client'; // <-- Add this to make it a Client Component
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReportsActions;
function ReportsActions() {
    // Function to handle printing the page
    const handlePrint = () => {
        window.print();
    };
    // A simple function to handle exporting data (example: low stock items)
    // In a real app, you might fetch data and use a library like 'papaparse'.
    const handleExport = async () => {
        alert("Export functionality would be implemented here!");
        // Example logic:
        // const response = await fetch('/api/reports/low-stock-for-export');
        // const data = await response.json();
        // const csv = convertJsonToCsv(data); // You'd need a helper function for this
        // downloadCsv(csv, 'low-stock-report.csv');
    };
    return (<div className="flex justify-end gap-3 px-4 py-3">
      <button onClick={handleExport} className="h-10 px-4 bg-[#edf3e7] rounded-full font-bold text-sm text-[#141b0e]">
        Export
      </button>
      <button onClick={handlePrint} className="h-10 px-4 bg-[#78e61e] rounded-full font-bold text-sm text-[#141b0e]">
        Print
      </button>
    </div>);
}
