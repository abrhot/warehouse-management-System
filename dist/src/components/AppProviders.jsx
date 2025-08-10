// src/providers/AppProviders.tsx
"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const AppProviders = ({ children }) => {
    // You can wrap AuthProvider, ThemeProvider, etc. here
    return (<>
      {/* Example: <AuthProvider> */}
      {children}
      {/* </AuthProvider> */}
    </>);
};
exports.default = AppProviders;
