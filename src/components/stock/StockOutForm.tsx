'use client';

import React, { useState, useEffect } from 'react';

// Updated interface to work with stock items
interface StockItem {
  id: string;
  serialNumber: string;
  status: string;
  product: {
    id: string;
    name: string;
    category: {
      name: string;
    };
  };
}

export default function StockOutForm() {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [selectedStockItemId, setSelectedStockItemId] = useState('');
  const [notes, setNotes] = useState('');

  // Fetch available stock items (IN_STOCK only)
  useEffect(() => {
    const fetchStockItems = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        // Extract stock items from products
        const allStockItems: StockItem[] = [];
        data.forEach((product: any) => {
          if (product.stockItems) {
            product.stockItems.forEach((item: any) => {
              if (item.status === 'IN_STOCK') {
                allStockItems.push({
                  id: item.id,
                  serialNumber: item.serialNumber,
                  status: item.status,
                  product: {
                    id: product.id,
                    name: product.name,
                    category: product.category
                  }
                });
              }
            });
          }
        });
        
        setStockItems(allStockItems);
      } catch (error) {
        console.error("Could not fetch stock items:", error);
        alert("❌ Could not load stock items.");
      }
    };
    fetchStockItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStockItemId) {
      alert("Please select a stock item.");
      return;
    }
    
    try {
      const res = await fetch("/api/stock/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          stockItemId: selectedStockItemId,
          type: "OUT",
          notes: notes,
        }),
      });

      if (res.ok) {
        alert("✅ Stock-out request sent for approval!");
        setSelectedStockItemId('');
        setNotes('');
      } else {
        const { error } = await res.json();
        alert("❌ Error: " + error);
      }
    } catch (err) {
      console.error("Stock out error", err);
      alert("❌ Failed to send stock-out request");
    }
  };

  const selectedStockItem = stockItems.find(item => item.id === selectedStockItemId);

  return (
    <div className="mx-auto w-full max-w-2xl rounded-xl bg-white p-8 shadow-lg">
      {/* The header section has been removed as requested */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Stock Item Selection */}
        <div>
          <label htmlFor="stockItemSelect" className="mb-2 block text-sm font-medium text-gray-700">Stock Item</label>
          <select id="stockItemSelect" value={selectedStockItemId} onChange={(e) => setSelectedStockItemId(e.target.value)} className="w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-800 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200" required>
            <option value="" disabled>Select a stock item...</option>
            {stockItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.product.name} - {item.serialNumber} ({item.status})
              </option>
            ))}
          </select>
        </div>

        {/* Conditional Stock Item Info */}
        {selectedStockItem && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="text-sm font-medium text-blue-800">
              <span className="font-semibold">Product:</span> {selectedStockItem.product.name}
            </p>
            <p className="text-sm font-medium text-blue-800">
              <span className="font-semibold">Serial Number:</span> {selectedStockItem.serialNumber}
            </p>
            <p className="text-sm font-medium text-blue-800">
              <span className="font-semibold">Category:</span> {selectedStockItem.product.category.name}
            </p>
            <p className="mt-1 text-xs text-blue-600">
              This item is currently {selectedStockItem.status.toLowerCase().replace('_', ' ')}.
            </p>
          </div>
        )}
        
        {/* Remarks/Notes */}
        <div>
          <label htmlFor="notesOut" className="mb-2 block text-sm font-medium text-gray-700">Remarks / Notes</label>
          <textarea id="notesOut" rows={4} placeholder="e.g., Issued to Project 'Alpha Site'" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-800 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200"/>
        </div>

        {/* --- Submit Button (Updated Size) --- */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="flex items-center justify-center rounded-lg bg-red-600 px-5 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            📤 Record Stock Out
          </button>
        </div>
      </form>
    </div>
  );
}