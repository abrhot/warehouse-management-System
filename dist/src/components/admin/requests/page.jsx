"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminRequestsPage;
const PendingRequests_1 = __importDefault(require("@/components/admin/PendingRequests"));
function AdminRequestsPage() {
    return (<main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* This is the component that fetches and displays pending requests */}
      <PendingRequests_1.default />
      
    </main>);
}
