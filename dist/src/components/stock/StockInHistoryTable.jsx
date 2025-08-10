'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockInHistoryTable = void 0;
const react_1 = require("react");
const StockInHistoryTable = () => {
    const [stockInData, setStockInData] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        const data = JSON.parse(localStorage.getItem("stockInData") || "[]");
        setStockInData(data);
    }, []);
    return (<div className="overflow-x-auto px-4 py-3">
      <table className="min-w-full bg-white border border-gray-300 rounded-xl text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Time</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Quantity</th>
            <th className="px-4 py-2 text-left">Handler</th>
            <th className="px-4 py-2 text-left">Notes</th>
          </tr>
        </thead>
        <tbody>
          {stockInData.map((entry, i) => (<tr key={i} className="border-t">
              <td className="px-4 py-2">{entry.time}</td>
              <td className="px-4 py-2">{entry.category}</td>
              <td className="px-4 py-2">{entry.quantity}</td>
              <td className="px-4 py-2">{entry.handler}</td>
              <td className="px-4 py-2">{entry.notes}</td>
            </tr>))}
        </tbody>
      </table>
    </div>);
};
exports.StockInHistoryTable = StockInHistoryTable;
