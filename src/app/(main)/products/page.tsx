'use client';
// Update the import path below to the correct location of ProductTable, for example:
// Update the import path below to the correct location of ProductTable, for example:
import { ProductHeader } from '@/components/products/ProductHeader';
// import { ProductTable } from '@/components/products/ProductTable';
import { ProductTable } from '@/components/products/ProductTable';
import Link from "next/link";

export default function ProductsPage() {
  return (
    <div className="px-40 flex flex-1 justify-center py-5 bg-[#fafbf8]">
      <div className="max-w-[960px] w-full flex flex-col">
        <ProductHeader />
        <ProductTable />
      </div>
    </div>
  );
}
