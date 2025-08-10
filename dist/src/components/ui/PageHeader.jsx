"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageHeader = void 0;
const PageHeader = ({ title, subtitle }) => (<div className="px-4 py-4">
    <h1 className="text-[32px] font-bold text-[#141b0e]">{title}</h1>
    {subtitle && <p className="text-sm text-[#6f9550]">{subtitle}</p>}
  </div>);
exports.PageHeader = PageHeader;
