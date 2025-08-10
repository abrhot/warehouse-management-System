'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const rows = [
    { product: 'Modem X', category: 'Networking', in: 100, out: 50, current: 50, status: 'In Stock' },
    { product: 'Router Y', category: 'Networking', in: 200, out: 150, current: 50, status: 'In Stock' },
    { product: 'Cable Z', category: 'Accessories', in: 500, out: 400, current: 100, status: 'In Stock' },
    { product: 'Server A', category: 'Servers', in: 10, out: 5, current: 5, status: 'In Stock' },
    { product: 'Switch B', category: 'Networking', in: 50, out: 45, current: 5, status: 'Low Stock' },
];
const ActivityTable = () => {
    return (<div className="px-4 py-3">
      <div className="overflow-hidden rounded-lg border border-[#dbe2d4] bg-[#fafbf9]">
        <table className="w-full text-left text-sm text-[#141810]">
          <thead className="bg-[#fafbf9]">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Stock In</th>
              <th className="px-4 py-3">Stock Out</th>
              <th className="px-4 py-3">Current Stock</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (<tr key={index} className="border-t border-[#dbe2d4]">
                <td className="px-4 py-2">{row.product}</td>
                <td className="px-4 py-2 text-[#708a5c]">{row.category}</td>
                <td className="px-4 py-2 text-[#708a5c]">{row.in}</td>
                <td className="px-4 py-2 text-[#708a5c]">{row.out}</td>
                <td className="px-4 py-2 text-[#708a5c]">{row.current}</td>
                <td className="px-4 py-2">
                  <button className="px-4 py-1 bg-[#edf1ea] rounded-lg">
                    {row.status}
                  </button>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>);
};
exports.default = ActivityTable;
