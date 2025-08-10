"use strict";
// ✅ Fixed src/app/(auth)/layout.tsx
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthLayout;
const react_1 = __importDefault(require("react"));
function AuthLayout({ children }) {
    return (<main>{children}</main>);
}
