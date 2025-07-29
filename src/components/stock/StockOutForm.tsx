// src/components/stock/StockOutForm.tsx
'use client'

export default function StockOutForm() {
  return (
    <form className="max-w-[480px] px-4">
      {[
        { label: 'Product Name / ID', type: 'select', placeholder: 'Select Product' },
        { label: 'Category', type: 'text' },
        { label: 'Quantity Issued', type: 'text', placeholder: 'Enter Quantity' },
        { label: 'Issued To', type: 'text', placeholder: 'Recipient (e.g., technician, department)' },
        { label: 'Purpose / Reason', type: 'select', placeholder: 'Select Reason' },
        { label: 'Warehouse Location', type: 'select', placeholder: 'Select Location' },
        { label: 'Date & Time', type: 'text' },
        { label: 'Handled By', type: 'text' },
        { label: 'Remarks / Notes', type: 'textarea', placeholder: 'Additional Information' },
      ].map((field, i) => (
        <div className="mb-4" key={i}>
          <label className="block text-base font-medium text-[#141b0e] mb-2">{field.label}</label>
          {field.type === 'select' ? (
            <select className="w-full h-14 rounded-xl border border-[#dae7d0] bg-[#fafcf8] px-4">
              <option>{field.placeholder}</option>
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              rows={4}
              placeholder={field.placeholder}
              className="w-full min-h-36 rounded-xl border border-[#dae7d0] bg-[#fafcf8] p-4"
            />
          ) : (
            <input
              type="text"
              placeholder={field.placeholder}
              className="w-full h-14 rounded-xl border border-[#dae7d0] bg-[#fafcf8] px-4"
            />
          )}
        </div>
      ))}

      <div className="flex justify-end gap-4 pt-3">
        <button type="reset" className="bg-[#edf3e7] h-10 px-4 rounded-full font-bold text-sm text-[#141b0e]">
          Reset Form
        </button>
        <button type="submit" className="bg-[#78e61e] h-10 px-4 rounded-full font-bold text-sm text-[#141b0e]">
          📥 Record Stock Out
        </button>
      </div>
    </form>
  )
}
