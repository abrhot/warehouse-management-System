'use client';

import { useState } from 'react';

const initialProducts = [
  { id: '12345', name: 'Modem X100', category: 'Modem', quantity: 150, reorderLevel: 50, location: 'Warehouse A' },
  { id: '67890', name: 'Cable Type A', category: 'Cable', quantity: 200, reorderLevel: 100, location: 'Warehouse B' },
  // ... other products
];

export const ProductTable = () => {
  const [products, setProducts] = useState(initialProducts);

  const handleDelete = (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (confirmed) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const handleEdit = (id: string) => {
    // Replace this with navigation or a modal logic
    alert(`Edit product with ID: ${id}`);
  };

  return (
    <div className="px-4 py-3 @container">
      <div className="flex overflow-hidden rounded-xl border border-[#dae6d1] bg-[#fafbf8]">
        <table className="flex-1">
          <thead>
            <tr className="bg-[#fafbf8]">
              <th className="px-4 py-3 text-left text-sm font-medium text-[#141b0e]">Product ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#141b0e]">Product Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#141b0e]">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#141b0e]">Quantity</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#141b0e]">Reorder Level</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#141b0e]">Location</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#6f9550]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-t border-t-[#dae6d1]">
                <td className="px-4 py-2 text-sm text-[#6f9550]">{product.id}</td>
                <td className="px-4 py-2 text-sm text-[#141b0e]">{product.name}</td>
                <td className="px-4 py-2 text-sm text-[#6f9550]">{product.category}</td>
                <td className="px-4 py-2 text-sm text-[#6f9550]">{product.quantity}</td>
                <td className="px-4 py-2 text-sm text-[#6f9550]">{product.reorderLevel}</td>
                <td className="px-4 py-2 text-sm text-[#6f9550]">{product.location}</td>
                <td className="px-4 py-2 text-sm text-[#6f9550] font-bold">
                  <button onClick={() => handleEdit(product.id)} className="text-blue-600 hover:underline mr-2">Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination (you can ignore or keep it) */}
      <div className="flex items-center justify-center p-4">
        <a href="#" className="flex size-10 items-center justify-center">◀</a>
        <a className="text-sm font-bold flex size-10 items-center justify-center text-[#141b0e] rounded-full bg-[#edf3e8]" href="#">1</a>
        <a className="text-sm font-normal flex size-10 items-center justify-center text-[#141b0e] rounded-full" href="#">2</a>
        <a className="text-sm font-normal flex size-10 items-center justify-center text-[#141b0e] rounded-full" href="#">3</a>
        <span className="text-sm font-normal flex size-10 items-center justify-center text-[#141b0e] rounded-full">...</span>
        <a className="text-sm font-normal flex size-10 items-center justify-center text-[#141b0e] rounded-full" href="#">13</a>
        <a href="#" className="flex size-10 items-center justify-center">▶</a>
      </div>

      <p className="text-[#6f9550] text-sm font-normal pb-3 pt-1 px-4 text-center">
        Showing 1–10 of {products.length} products
      </p>
    </div>
  );
};
