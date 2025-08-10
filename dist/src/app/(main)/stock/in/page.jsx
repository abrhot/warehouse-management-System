"use strict";
// C:\Users\USER\Desktop\warehouse-management\src\app\(main)\stock\in\page.tsx
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StockInPage;
const StockInForm_1 = require("@/components/stock/StockInForm");
const PageHeader_1 = require("@/components/ui/PageHeader");
function StockInPage() {
    return (<main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <PageHeader_1.PageHeader title="📥 Stock In" subtitle="Manage incoming stock efficiently"/>
        
        {/* The form is now the only component on this page */}
        <StockInForm_1.StockInForm />
        
        {/* The StockInHistoryTable and its title have been removed */}
      </div>
    </main>);
}
