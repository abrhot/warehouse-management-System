'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Header = () => {
    return (<header className="flex items-center justify-between border-b border-[#edf1ea] px-10 py-3">
      <div className="flex items-center gap-4 text-[#141810]">
        <div className="size-4 text-[#141810]">
          <svg viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.578 8.578C5.528 11.628 3.451 15.514 2.609 19.745C1.768 23.976 2.2 28.361 3.85 32.346C5.501 36.331 8.297 39.738 11.883 42.134C15.47 44.531 19.686 45.81 24 45.81C28.314 45.81 32.53 44.531 36.117 42.134C39.703 39.738 42.499 36.331 44.149 32.346C45.8 28.361 46.232 23.976 45.391 19.745C44.549 15.514 42.472 11.628 39.422 8.578L24 24L8.578 8.578Z"/>
          </svg>
        </div>
        <h2 className="text-lg font-bold tracking-tight">EthioTele WMS</h2>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <nav className="flex gap-9 text-sm font-medium text-[#141810]">
          {['Dashboard', 'Stock In/Out', 'Product Management', 'Reports', 'User Management'].map((label) => (<a key={label} href="#" className="hover:underline">
              {label}
            </a>))}
        </nav>
        <button className="flex items-center gap-2 rounded-lg h-10 bg-[#edf1ea] px-2.5 font-bold text-sm text-[#141810]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
            <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"/>
          </svg>
        </button>
        <div className="size-10 rounded-full bg-cover bg-center" style={{
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBeDP-GcinWxS3joZLpm7jqXyHCNYZ_Go2ghL2gRvWl2NQ0xMJBwdigq5xhRMOadgGbNVLIpUXTQcSTXOPO5uXg2AGacRYWvJnxwoXjx71asx0upmwp3VvZJ1-rOe7D2ikhJMAgKGoaSXzS8UWAtbl8e2QC3hzxSOnUQJhyRHFGGo85BG3rQy9Xyypjrraf1pme6FymolmLE7gDwgKdPKCVdGmdsIy1hm9Md7KJzALiFZRRKDIMJNSMNYKN0QSF8nWLF_q_rPyKokLp')",
        }}></div>
      </div>
    </header>);
};
exports.default = Header;
