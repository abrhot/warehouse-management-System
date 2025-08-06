'use client';

import React, { useState } from 'react';

export default function StockOutForm() {
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    quantity: '',
    issuedTo: '',
    reason: '',
    location: '',
    dateTime: '',
    handler: '',
    notes: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.productName || !formData.quantity) {
    alert("Product and quantity required");
    return;
  }

  try {
    const res = await fetch("/api/stock/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: formData.productName,
        quantity: Number(formData.quantity),
        type: "OUT", // 👈 important!
      }),
    });

    if (res.ok) {
      alert("✅ Stock-out request sent for approval!");

      setFormData({
        productName: '',
        category: '',
        quantity: '',
        issuedTo: '',
        reason: '',
        location: '',
        dateTime: '',
        handler: '',
        notes: '',
      });
    } else {
      const { error } = await res.json();
      alert("❌ Error: " + error);
    }
  } catch (err) {
    console.error("Stock out error", err);
    alert("❌ Failed to send stock-out request");
  }
};


  const handleReset = () => {
    setFormData({
      productName: '',
      category: '',
      quantity: '',
      issuedTo: '',
      reason: '',
      location: '',
      dateTime: '',
      handler: '',
      notes: '',
    });
  };

  return (
    <form className="max-w-[480px] px-4" onSubmit={handleSubmit}>
      {[
        { label: 'Product Name / ID', key: 'productName', type: 'select', placeholder: 'Select Product' },
        { label: 'Category', key: 'category', type: 'text' },
        { label: 'Quantity Issued', key: 'quantity', type: 'text', placeholder: 'Enter Quantity' },
        { label: 'Issued To', key: 'issuedTo', type: 'text', placeholder: 'Recipient (e.g., technician, department)' },
        { label: 'Purpose / Reason', key: 'reason', type: 'select', placeholder: 'Select Reason' },
        { label: 'Warehouse Location', key: 'location', type: 'select', placeholder: 'Select Location' },
        { label: 'Date & Time', key: 'dateTime', type: 'text' },
        { label: 'Handled By', key: 'handler', type: 'text' },
        { label: 'Remarks / Notes', key: 'notes', type: 'textarea', placeholder: 'Additional Information' },
      ].map((field, i) => (
        <div className="mb-4" key={i}>
          <label className="block text-base font-medium text-[#141b0e] mb-2">{field.label}</label>
          {field.type === 'select' ? (
            <select
              value={formData[field.key as keyof typeof formData]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-full h-14 rounded-xl border border-[#dae7d0] bg-[#fafcf8] px-4"
            >
              <option>{field.placeholder}</option>
              <option value="Option 1">Option 1</option>
              <option value="Option 2">Option 2</option>
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              rows={4}
              placeholder={field.placeholder}
              value={formData[field.key as keyof typeof formData]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-full min-h-36 rounded-xl border border-[#dae7d0] bg-[#fafcf8] p-4"
            />
          ) : (
            <input
              type="text"
              placeholder={field.placeholder}
              value={formData[field.key as keyof typeof formData]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-full h-14 rounded-xl border border-[#dae7d0] bg-[#fafcf8] px-4"
            />
          )}
        </div>
      ))}

      <div className="flex justify-end gap-4 pt-3">
        <button
          type="button"
          onClick={handleReset}
          className="bg-[#edf3e7] h-10 px-4 rounded-full font-bold text-sm text-[#141b0e]"
        >
          Reset Form
        </button>
        <button
          type="submit"
          className="bg-[#78e61e] h-10 px-4 rounded-full font-bold text-sm text-[#141b0e]"
        >
          📥 Record Stock Out
        </button>
      </div>
    </form>
  );
}
