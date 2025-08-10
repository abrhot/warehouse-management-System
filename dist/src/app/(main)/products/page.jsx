'use client';
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProductsPage;
const react_1 = __importStar(require("react"));
const ProductHeader_1 = require("@/components/products/ProductHeader");
const ProductTable_1 = require("@/components/products/ProductTable");
function ProductsPage() {
    // State for the complete, unfiltered list of products
    const [allProducts, setAllProducts] = (0, react_1.useState)([]);
    // State for each filter criteria
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)("All");
    const [selectedAvailability, setSelectedAvailability] = (0, react_1.useState)("All");
    // State for loading and error handling during API fetch
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    // 1. Fetch all products from the API when the page loads
    (0, react_1.useEffect)(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                if (!res.ok) {
                    throw new Error('Failed to fetch product data from server');
                }
                const data = await res.json();
                setAllProducts(data);
            }
            catch (err) {
                setError(err.message);
            }
            finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);
    // 2. Filter the products whenever a filter changes
    const filteredProducts = (0, react_1.useMemo)(() => {
        return allProducts.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
            const matchesAvailability = selectedAvailability === "All" ||
                (selectedAvailability === "In Stock" && product.quantity > 0) ||
                (selectedAvailability === "Out of Stock" && product.quantity === 0);
            return matchesSearch && matchesCategory && matchesAvailability;
        });
    }, [allProducts, searchTerm, selectedCategory, selectedAvailability]);
    // 3. Get a unique list of categories for the filter dropdown
    const uniqueCategories = (0, react_1.useMemo)(() => {
        const categories = new Set(allProducts.map(p => p.category));
        return ["All", ...Array.from(categories)];
    }, [allProducts]);
    return (<div className="px-40 flex flex-1 justify-center py-5 bg-[#fafbf8]">
      <div className="max-w-[960px] w-full flex flex-col">
        <ProductHeader_1.ProductHeader categories={uniqueCategories} onCategoryChange={setSelectedCategory} onAvailabilityChange={setSelectedAvailability}/>
        <ProductTable_1.ProductTable products={filteredProducts} searchTerm={searchTerm} onSearchChange={setSearchTerm} isLoading={loading} error={error}/>
      </div>
    </div>);
}
