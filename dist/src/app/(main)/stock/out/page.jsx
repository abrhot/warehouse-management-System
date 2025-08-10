"use strict";
// C:\Users\USER\Desktop\warehouse-management\src\app\(main)\stock\out\page.tsx
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StockOutPage;
const StockOutForm_1 = __importDefault(require("@/components/stock/StockOutForm"));
const PageHeader_1 = require("@/components/ui/PageHeader");
function StockOutPage() {
    return (<main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <PageHeader_1.PageHeader title="📤 Stock Out" subtitle="Record items issued or removed from the inventory."/>
        
        {/* The form is now the only component on this page */}
        <StockOutForm_1.default />

        {/* The hero image and StockOutTable have been removed */}
      </div>
    </main>);
}
