import React, { useState, useMemo, useContext, useEffect } from "react";
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Grid, List, Star, Package, X } from "lucide-react";
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Products = () => {
  const { authToken } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1000]); // Changed to array for range
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetchProducts();
  }, [authToken]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/products/', {
        headers: { Authorization: `Bearer ${authToken.access}` }
      });
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
      setLoading(false);
    }
  };

  const categories = useMemo(() => ["All", ...new Set(products.map((p) => p.category))], [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "All" || product.status === selectedStatus;

      const price = parseFloat(product.unit_price);
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus, priceRange]);

  const getStockColor = (stock) => {
    if (stock > 50) return "bg-green-500/20 text-green-500";
    if (stock > 10) return "bg-yellow-500/20 text-yellow-500";
    return "bg-red-500/20 text-red-500";
  };

  const getStockStatus = (stock) => {
    if (stock > 50) return "In Stock";
    if (stock > 10) return "Low Stock";
    return "Out of Stock";
  };

  if (loading) return <div className="text-white text-center mt-20">Loading products...</div>;
  if (error) return <div className="text-red-400 text-center mt-20">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Stats Section - simplified for now or fetched from elsewhere */}

      {/* Search and Filters */}
      <div className="bg-[#111827] rounded-lg p-4 border border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1e2875]"
            />
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "grid"
                ? "bg-[#1e2875] text-white"
                : "bg-[#1a2332] text-gray-400 hover:text-white"
                }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "list"
                ? "bg-[#1e2875] text-white"
                : "bg-[#1a2332] text-gray-400 hover:text-white"
                }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-[#1a2332] border border-gray-600 text-white rounded-lg hover:bg-[#1e2875] transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0"
          >
            <Filter className="w-4 h-4" />
            Filters
            {showFilters && <X className="w-4 h-4" />}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="min-w-0">
              <label className="block text-gray-400 text-sm mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#1e2875]"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-0">
              <label className="block text-gray-400 text-sm mb-2">Stock Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#1e2875]"
              >
                <option value="All">All Status</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>

            <div className="min-w-0">
              <label className="block text-gray-400 text-sm mb-2">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full px-3 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1e2875]"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full px-3 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1e2875]"
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 text-gray-400 text-sm">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#111827] rounded-lg p-12 text-center border border-gray-700">
          <p className="text-gray-400">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className={viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          : "space-y-4"
        }>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`bg-[#111827] rounded-lg border border-gray-700 hover:border-[#1e2875] transition-all ${viewMode === "grid" ? "overflow-hidden flex flex-col" : "flex gap-4 p-4"
                }`}
            >
              {viewMode === "grid" ? (
                <>
                  <div className="aspect-square overflow-hidden bg-gray-800 flex-shrink-0 relative">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <Package className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium text-sm flex-1 mr-2 line-clamp-2">{product.name}</h4>
                      <span className={`${getStockColor(product.current_stock)} text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0`}>
                        {getStockStatus(product.current_stock)}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mb-2">{product.category}</p>
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2 flex-1">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white text-lg font-bold">${product.unit_price}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-700 flex justify-between text-xs text-gray-400">
                      <span className="truncate">SKU: {product.sku}</span>
                      <span className="flex-shrink-0">Stock: {product.current_stock}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <Package className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0 flex-1 mr-4">
                        <h4 className="text-white font-medium truncate">{product.name}</h4>
                        <p className="text-gray-400 text-sm mt-1 line-clamp-1">{product.description}</p>
                      </div>
                      <span className={`${getStockColor(product.current_stock)} text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0`}>
                        {getStockStatus(product.current_stock)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-400">
                      <span className="truncate">Category: {product.category}</span>
                      <span className="truncate">SKU: {product.sku}</span>
                      <span>Stock: {product.current_stock}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between flex-shrink-0 ml-4">
                    <span className="text-white text-xl font-bold">${product.unit_price}</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;