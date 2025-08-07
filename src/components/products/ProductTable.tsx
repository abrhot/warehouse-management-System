'use client';
import Link from 'next/link';

// Define the shape of the props this component expects
interface ProductTableProps {
  products: Array<{
    id: string;
    name: string;
    category: string;
    quantity: number;
    // Add other fields if they exist in your data
  }>;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  searchTerm,
  onSearchChange,
  isLoading,
  error,
}) => {

  const handleDelete = (id: string) => {
    // In a real app, you would call an API to delete the product
    // For now, we just show an alert.
    alert(`This would call an API to delete product with ID: ${id}`);
    // Example API call:
    // fetch(`/api/products/${id}`, { method: 'DELETE' })
    //   .then(() => {
    //     // Optionally, trigger a refetch of the product list
    //   });
  };

  const handleEdit = (id: string) => {
    alert(`Maps to edit page for product ID: ${id}`);
  };

  if (isLoading) return <p className="text-center p-5">Loading products...</p>;
  if (error) return <p className="text-center p-5 text-red-500">Error: {error}</p>;

  return (
    <div className="px-4 py-3 @container">
      {/* Search + Add Product */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or ID"
              className="rounded-xl h-10 pl-10 pr-4 text-sm text-[#141b0e] placeholder-[#6f9550] bg-[#edf3e8] focus:outline-none"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <div className="absolute top-2.5 left-3 text-[#6f9550]">🔍</div>
          </div>

          <Link href="/stock/in">
            <button className="rounded-xl bg-[#78e61e] text-[#141b0e] h-10 px-4 text-sm font-medium hover:opacity-90">
              ➕ Add Stock
            </button>
          </Link>
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-auto rounded-xl border border-[#dae6d1] bg-[#fafbf8]">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-[#fafbf8]">
              <th className="px-4 py-3 text-left text-sm font-medium text-[#141b0e]">Product ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#141b0e]">Product Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#141b0e]">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#141b0e]">Quantity</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#6f9550]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-[#6f9550]">
                  No products found matching your filters.
                </td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product.id} className="border-t border-t-[#dae6d1]">
                  <td className="px-4 py-2 text-sm text-[#6f9550]">{product.id}</td>
                  <td className="px-4 py-2 text-sm text-[#141b0e]">{product.name}</td>
                  <td className="px-4 py-2 text-sm text-[#6f9550]">{product.category}</td>
                  <td className="px-4 py-2 text-sm font-bold text-[#141b0e]">{product.quantity}</td>
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

      <p className="text-[#6f9550] text-sm font-normal pb-3 pt-4 px-4 text-center">
        Showing {products.length} products
      </p>
    </div>
  );
};