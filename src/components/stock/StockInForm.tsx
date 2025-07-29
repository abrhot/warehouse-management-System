export const StockInForm = () => (
  <>
    <div className="space-y-4 px-4">
      {[
        { label: "Category", type: "input" },
        { label: "Quantity Received", type: "input", placeholder: "Quantity Received" },
        { label: "Supplier / Source", type: "input", placeholder: "Supplier / Source" },
        { label: "Warehouse Location", type: "select", options: ["Warehouse A", "Warehouse B"] },
        { label: "Date & Time", type: "input" },
        { label: "Handled By", type: "input" },
        { label: "Remarks / Notes", type: "textarea", placeholder: "Enter remarks or notes" },
      ].map((field, idx) => (
        <label key={idx} className="block">
          <p className="pb-2 text-[#141b0e] text-base font-medium">{field.label}</p>
          {field.type === "input" && (
            <input
              placeholder={field.placeholder}
              className="w-full h-14 rounded-xl border border-[#dae6d1] bg-[#fafbf8] p-4 text-[#141b0e] placeholder:text-[#6f9550]"
            />
          )}
          {field.type === "select" && (
            <select className="w-full h-14 rounded-xl border border-[#dae6d1] bg-[#fafbf8] p-4 text-[#141b0e]">
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}
          {field.type === "textarea" && (
            <textarea
              placeholder={field.placeholder}
              className="w-full min-h-36 rounded-xl border border-[#dae6d1] bg-[#fafbf8] p-4 text-[#141b0e] placeholder:text-[#6f9550]"
            ></textarea>
          )}
        </label>
      ))}
    </div>
    <div className="flex justify-end gap-3 px-4 py-4">
      <button className="h-10 px-4 rounded-full bg-[#edf3e8] text-sm font-bold">Reset Form</button>
      <button className="h-10 px-4 rounded-full bg-[#75df1f] text-sm font-bold">➕ Add Stock</button>
    </div>
  </>
);
