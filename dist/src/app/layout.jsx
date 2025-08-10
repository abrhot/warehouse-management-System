"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const google_1 = require("next/font/google"); // Using Inter as an example font
const providers_1 = __importDefault(require("./providers")); // 👈 1. Import the Providers component
require("./globals.css");
const inter = (0, google_1.Inter)({ subsets: ['latin'] });
// The metadata object handles your <head> content like title and description
exports.metadata = {
    title: "WMS",
    description: "Warehouse Management System",
};
function RootLayout({ children }) {
    return (<html lang="en">
      <body className={inter.className}>
        <providers_1.default> {/* 👈 2. Wrap your {children} with the Providers component */}
          {children}
        </providers_1.default>
      </body>
    </html>);
}
