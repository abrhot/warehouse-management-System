"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MainLayout;
// src/app/(main)/layout.tsx
const react_1 = __importDefault(require("react"));
const MainNav_1 = __importDefault(require("@/components/layout/MainNav"));
function MainLayout({ children }) {
    return (<div className="min-h-screen bg-[#fafbf9] text-[#141810] flex flex-col">
      <MainNav_1.default />
      <main className="flex-1 px-6 py-4">{children}</main>
    </div>);
}
