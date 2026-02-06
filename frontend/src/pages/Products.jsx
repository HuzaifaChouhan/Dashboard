import React from "react";
import { Plus } from "lucide-react";

const Products = () => {
  return (
    <div className="bg-[#111827] rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-white">Products Management</h3>
        <button
          data-testid="add-product-btn"
          className="px-4 py-2 bg-[#1e2875] hover:bg-[#2a3690] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>
      <p className="text-gray-400">Products management interface coming soon...</p>
    </div>
  );
};

export default Products;