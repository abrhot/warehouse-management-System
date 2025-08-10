'use client';
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StockOutForm;
const react_1 = __importStar(require("react"));
function StockOutForm() {
    const [products, setProducts] = (0, react_1.useState)([]);
    const [selectedProductId, setSelectedProductId] = (0, react_1.useState)('');
    const [quantity, setQuantity] = (0, react_1.useState)('');
    const [notes, setNotes] = (0, react_1.useState)('');
    // All of the logic functions (useEffect, handleSubmit) are unchanged.
    (0, react_1.useEffect)(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                if (!res.ok)
                    throw new Error('Failed to fetch');
                const data = await res.json();
                setProducts(data);
            }
            catch (error) {
                console.error("Could not fetch products:", error);
                alert("❌ Could not load product list.");
            }
        };
        fetchProducts();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProductId || !quantity) {
            alert("Please select a product and enter a quantity.");
            return;
        }
        if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
            alert("Quantity must be a positive number.");
            return;
        }
        try {
            const res = await fetch("/api/stock/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: selectedProductId,
                    quantity: Number(quantity),
                    type: "OUT",
                    notes: notes,
                }),
            });
            if (res.ok) {
                alert("✅ Stock-out request sent for approval!");
                setSelectedProductId('');
                setQuantity('');
                setNotes('');
            }
            else {
                const { error } = await res.json();
                alert("❌ Error: " + error);
            }
        }
        catch (err) {
            console.error("Stock out error", err);
            alert("❌ Failed to send stock-out request");
        }
    };
    const selectedProduct = products.find(p => p.id === selectedProductId);
    return (<div className="mx-auto w-full max-w-2xl rounded-xl bg-white p-8 shadow-lg">
      {/* The header section has been removed as requested */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Product Selection */}
        <div>
          <label htmlFor="productSelect" className="mb-2 block text-sm font-medium text-gray-700">Product</label>
          <select id="productSelect" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className="w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-800 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200" required>
            <option value="" disabled>Select a product...</option>
            {products.map((product) => (<option key={product.id} value={product.id}>
                {product.name} (In Stock: {product.quantity})
              </option>))}
          </select>
        </div>

        {/* Conditional Product Info */}
        {selectedProduct && (<div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="text-sm font-medium text-blue-800">
              <span className="font-semibold">Category:</span> {selectedProduct.category}
            </p>
            <p className="mt-1 text-xs text-blue-600">
              There are currently {selectedProduct.quantity} units available in stock.
            </p>
          </div>)}

        {/* Quantity Input */}
        <div>
          <label htmlFor="quantityOut" className="mb-2 block text-sm font-medium text-gray-700">Quantity to Issue</label>
          <input id="quantityOut" type="number" placeholder="Enter Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-800 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200" min="1" max={selectedProduct === null || selectedProduct === void 0 ? void 0 : selectedProduct.quantity} required/>
        </div>
        
        {/* Remarks/Notes */}
        <div>
          <label htmlFor="notesOut" className="mb-2 block text-sm font-medium text-gray-700">Remarks / Notes</label>
          <textarea id="notesOut" rows={4} placeholder="e.g., Issued to Project 'Alpha Site'" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-800 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200"/>
        </div>

        {/* --- Submit Button (Updated Size) --- */}
        <div className="flex justify-end pt-4">
          <button type="submit" className="flex items-center justify-center rounded-lg bg-red-600 px-5 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            📤 Record Stock Out
          </button>
        </div>
      </form>
    </div>);
}
