'use client';
import Link from "next/link";
import { useState } from 'react';

const initialProducts = [
  { id: '12345', name: 'Modem X100', category: 'Modem', quantity: 150, reorderLevel: 50, location: 'Warehouse A' },
  { id: '67890', name: 'Cable Type A', category: 'Cable', quantity: 200, reorderLevel: 100, location: 'Warehouse B' },
  { id: '11223', name: 'Router Z200', category: 'Router', quantity: 50, reorderLevel: 20, location: 'Warehouse C' },
  { id: '33445', name: 'Connector B50', category: 'Connector', quantity: 300, reorderLevel: 150, location: 'Warehouse A' },
  { id: '55667', name: 'Antenna G300', category: 'Antenna', quantity: 75, reorderLevel: 30, location: 'Warehouse B' },
  { id: '77889', name: 'Splitter S100', category: 'Splitter', quantity: 100, reorderLevel: 50, location: 'Warehouse C' },
  { id: '99001', name: 'Amplifier A200', category: 'Amplifier', quantity: 25, reorderLevel: 10, location: 'Warehouse A' },
  { id: '22334', name: 'Converter C400', category: 'Converter', quantity: 125, reorderLevel: 60, location: 'Warehouse B' },
  { id: '44556', name: 'Filter F100', category: 'Filter', quantity: 175, reorderLevel: 80, location: 'Warehouse C' },
  { id: '66778', name: 'Isolator I50', category: 'Isolator', quantity: 60, reorderLevel: 25, location: 'Warehouse A' },
  { id: '88990', name: 'Repeater R20', category: 'Repeater', quantity: 40, reorderLevel: 15, location: 'Warehouse C' },
  { id: '34567', name: 'Cable Type B', category: 'Cable', quantity: 180, reorderLevel: 90, location: 'Warehouse B' },
  { id: '56789', name: 'Modem X200', category: 'Modem', quantity: 130, reorderLevel: 70, location: 'Warehouse A' },
  { id: '78901', name: 'Connector C100', category: 'Connector', quantity: 210, reorderLevel: 110, location: 'Warehouse B' },
  { id: '90123', name: 'Antenna G500', category: 'Antenna', quantity: 90, reorderLevel: 40, location: 'Warehouse C' },
  { id: '13579', name: 'Splitter S200', category: 'Splitter', quantity: 85, reorderLevel: 35, location: 'Warehouse A' },
  { id: '24680', name: 'Amplifier A300', category: 'Amplifier', quantity: 30, reorderLevel: 15, location: 'Warehouse B' },
  { id: '36912', name: 'Router Z300', category: 'Router', quantity: 60, reorderLevel: 25, location: 'Warehouse C' },
  { id: '48126', name: 'Converter C500', category: 'Converter', quantity: 140, reorderLevel: 70, location: 'Warehouse A' },
  { id: '59247', name: 'Filter F200', category: 'Filter', quantity: 160, reorderLevel: 90, location: 'Warehouse B' },
  { id: '61358', name: 'Isolator I100', category: 'Isolator', quantity: 70, reorderLevel: 30, location: 'Warehouse C' },
  { id: '72469', name: 'Repeater R40', category: 'Repeater', quantity: 45, reorderLevel: 20, location: 'Warehouse A' },
  { id: '83570', name: 'Modem X300', category: 'Modem', quantity: 110, reorderLevel: 60, location: 'Warehouse B' },
  { id: '94681', name: 'Connector D200', category: 'Connector', quantity: 250, reorderLevel: 130, location: 'Warehouse C' },
  { id: '05792', name: 'Amplifier A500', category: 'Amplifier', quantity: 20, reorderLevel: 10, location: 'Warehouse A' },
];

export const ProductTable = () => {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');

  const handleDelete = (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (confirmed) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const handleEdit = (id: string) => {
    alert(`Edit product with ID: ${id}`);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.id.includes(search)
  );

  return (
    <div className="px-4 py-3 @container">
      {/* Search + Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
      
        <div className="flex items-center gap-3text-[#6f9550]">🔍
          <input
            type="text"
            placeholder="Search by name or ID"         

            className="rounded-xl h-10 px-4 text-sm text-[#141b0e] placeholder-[#6f9550] bg-[#edf3e8] focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

  <Link href="/stock/in">
      <button className="rounded-xl bg-[#edf3e8] h-8 px-4 text-sm font-medium text-[#141b0e]">
        ➕ Add Product
      </button>
    </Link>
        </div>
      </div>

      {/* Product Table */}
      <div className="flex overflow-hidden rounded-xl border border-[#dae6d1] bg-[#fafbf8]">
        <table className="flex-1 w-full">
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
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-[#6f9550]">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product.id} className="border-t border-t-[#dae6d1]">
                  <td className="px-4 py-2 text-sm text-[#6f9550]">{product.id}</td>
                  <td className="px-4 py-2 text-sm text-[#141b0e]">{product.name}</td>
                  <td className="px-4 py-2 text-sm text-[#6f9550]">{product.category}</td>
                  <td className="px-4 py-2 text-sm text-[#6f9550]">{product.quantity}</td>
                  <td className="px-4 py-2 text-sm text-[#6f9550]">{product.reorderLevel}</td>
                  <td className="px-4 py-2 text-sm text-[#6f9550]">{product.location}</td>
                  <td className="px-4 py-2 text-sm text-[#6f9550] font-bold">
                    <button
                      onClick={() => handleEdit(product.id)}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Info */}
      <p className="text-[#6f9550] text-sm font-normal pb-3 pt-4 px-4 text-center">
        Showing {filteredProducts.length} of {products.length} products
      </p>
    </div>
  );
};

interface ProductTableProps {
  searchValue: string;
  category: string;
  availability: string;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  searchValue,
  category,
  availability,
}) => {
  // Example: you could fetch or filter product data here
  // based on the search/category/availability props

  return (
    <div className="mt-6">
      {/* Render filtered products */}
      <p className="text-sm text-gray-600">
        Showing results for: "{searchValue}", category: {category}, availability: {availability}
      </p>
      {/* TODO: Add real product table here */}
    </div>
  );
};
