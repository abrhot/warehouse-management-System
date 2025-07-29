export const ProductHeader = () => (
  <>
    <div className="flex flex-wrap justify-between gap-3 p-4">
      <p className="text-[#141b0e] tracking-light text-[32px] font-bold leading-tight min-w-72">
        Product Management
      </p>
      <button className="rounded-xl bg-[#edf3e8] h-8 px-4 text-sm font-medium text-[#141b0e]">
        ➕ Add Product
      </button>
    </div>

    <div className="px-4 py-3">
      <label className="flex flex-col min-w-40 h-12 w-full">
        <div className="flex w-full rounded-xl h-full bg-[#edf3e8]">
          <div className="pl-4 flex items-center text-[#6f9550]">
            🔍
          </div>
          <input
            placeholder="Search by name or ID"
            className="flex-1 border-none bg-transparent px-4 text-[#141b0e] placeholder-[#6f9550] focus:outline-none"
          />
        </div>
      </label>
    </div>

    <div className="flex gap-3 p-3 flex-wrap pr-4">
      <button className="flex h-8 items-center gap-2 rounded-xl bg-[#edf3e8] pl-4 pr-2 text-sm text-[#141b0e] font-medium">
        Category ⌄
      </button>
      <button className="flex h-8 items-center gap-2 rounded-xl bg-[#edf3e8] pl-4 pr-2 text-sm text-[#141b0e] font-medium">
        Availability ⌄
      </button>
    </div>
  </>
);
