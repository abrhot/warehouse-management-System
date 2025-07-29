// src/components/reports/ReportsActions.tsx
export default function ReportsActions() {
  return (
    <div className="flex justify-end gap-3 px-4 py-3">
      <button className="h-10 px-4 bg-[#edf3e7] rounded-full font-bold text-sm text-[#141b0e]">
        Export
      </button>
      <button className="h-10 px-4 bg-[#78e61e] rounded-full font-bold text-sm text-[#141b0e]">
        Print
      </button>
    </div>
  )
}
