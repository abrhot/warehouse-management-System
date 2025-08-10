'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Providers;
const react_1 = __importDefault(require("react"));
const react_2 = require("next-auth/react");
function Providers({ children }) {
    return (<react_2.SessionProvider>
      {children}
    </react_2.SessionProvider>);
}
