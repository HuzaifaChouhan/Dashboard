import React, { useState, useMemo } from "react";
import { Search, Filter, X, Package, DollarSign, Star, TrendingUp, Grid, List } from "lucide-react";

const Products = () => {
  // Sample product data (expanded from Dashboard)
  const [products] = useState([
    {
      id: 1,
      name: "Wireless Headphones Pro",
      description: "Premium noise cancellation with 30-hour battery life",
      price: 199.99,
      category: "Electronics",
      rating: 5,
      reviews: 42,
      stock: 150,
      stockStatus: "In Stock",
      status: "active",
      sku: "WHP-001",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Smart Watch Series 5",
      description: "Fitness tracking & notifications",
      price: 249.99,
      category: "Electronics",
      rating: 5,
      reviews: 89,
      stock: 75,
      stockStatus: "In Stock",
      status: "active",
      sku: "SWS-005",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      name: "360° Bluetooth Speaker",
      description: "Portable with 20h battery life",
      price: 89.99,
      category: "Electronics",
      rating: 4,
      reviews: 156,
      stock: 5,
      stockStatus: "Low Stock",
      status: "active",
      sku: "BTS-360",
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      name: "Organic Green Tea",
      description: "Premium grade organic tea leaves",
      price: 24.99,
      category: "Food & Beverage",
      rating: 4,
      reviews: 23,
      stock: 200,
      stockStatus: "In Stock",
      status: "active",
      sku: "OGT-100",
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=400&fit=crop",
    },
    {
      id: 5,
      name: "Yoga Mat Premium",
      description: "Non-slip eco-friendly material",
      price: 45.99,
      category: "Sports",
      rating: 5,
      reviews: 67,
      stock: 0,
      stockStatus: "Out of Stock",
      status: "inactive",
      sku: "YMP-001",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
    },
    {
      id: 6,
      name: "Wireless Mouse",
      description: "Ergonomic design with precision tracking",
      price: 34.99,
      category: "Electronics",
      rating: 4,
      reviews: 128,
      stock: 90,
      stockStatus: "In Stock",
      status: "active",
      sku: "WMS-001",
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    },
    {
      id: 7,
      name: "Stainless Steel Water Bottle",
      description: "Insulated 24oz capacity",
      price: 29.99,
      category: "Sports",
      rating: 5,
      reviews: 94,
      stock: 120,
      stockStatus: "In Stock",
      status: "active",
      sku: "SSW-024",
      image: "https://images.unsplash.com/photo-1602143407151-7112152b48e7?w=400&h=400&fit=crop",
    },
    {
      id: 8,
      name: "Coffee Beans Deluxe",
      description: "Medium roast arabica beans",
      price: 18.99,
      category: "Food & Beverage",
      rating: 5,
      reviews: 201,
      stock: 15,
      stockStatus: "Low Stock",
      status: "active",
      sku: "CBD-001",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
    },
  ]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return ["all", ...cats];
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      
      const matchesStatus = selectedStatus === "all" || 
                           (selectedStatus === "in-stock" && product.stock > 10) ||
                           (selectedStatus === "low-stock" && product.stock > 0 && product.stock <= 10) ||
                           (selectedStatus === "out-of-stock" && product.stock === 0);
      
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus, priceRange]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === "active").length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= 10).length;
    
    return { totalProducts, activeProducts, totalValue, lowStockItems };
  }, [products]);

  const getStockColor = (stock) => {
    if (stock === 0) return "bg-red-500";
    if (stock <= 10) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 10) return "Low Stock";
    return "In Stock";
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#111827] rounded-lg p-4 border border-gray-700 min-w-0">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-sm truncate">Total Products</p>
                <p className="text-white text-2xl font-bold mt-1">{stats.totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                <Package className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-[#111827] rounded-lg p-4 border border-gray-700 min-w-0">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-sm truncate">Active Products</p>
                <p className="text-white text-2xl font-bold mt-1">{stats.activeProducts}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-[#111827] rounded-lg p-4 border border-gray-700 min-w-0">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-sm truncate">Total Value</p>
                <p className="text-white text-2xl font-bold mt-1 truncate">${stats.totalValue.toFixed(0)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                <DollarSign className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-[#111827] rounded-lg p-4 border border-gray-700 min-w-0">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-sm truncate">Low Stock Items</p>
                <p className="text-white text-2xl font-bold mt-1">{stats.lowStockItems}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-[#111827] rounded-lg p-4 border border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products by name, SKU, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1e2875]"
              />
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" 
                    ? "bg-[#1e2875] text-white" 
                    : "bg-[#1a2332] text-gray-400 hover:text-white"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list" 
                    ? "bg-[#1e2875] text-white" 
                    : "bg-[#1a2332] text-gray-400 hover:text-white"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-[#1a2332] border border-gray-600 text-white rounded-lg hover:bg-[#1e2875] transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0"
            >
              <Filter className="w-4 h-4" />
              Filters
              {showFilters && <X className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
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
              
              {/* Stock Status Filter */}
              <div className="min-w-0">
                <label className="block text-gray-400 text-sm mb-2">Stock Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#1e2875]"
                >
                  <option value="all">All Status</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
              
              {/* Price Range Filter */}
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
                    className="w-10 flex-1 px-3 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1e2875]"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-10 flex-1 px-3 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1e2875]"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Results Count */}
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
                className={`bg-[#111827] rounded-lg border border-gray-700 hover:border-[#1e2875] transition-all ${
                  viewMode === "grid" ? "overflow-hidden flex flex-col" : "flex gap-4 p-4"
                }`}
              >
                {viewMode === "grid" ? (
                  <>
                    <div className="aspect-square overflow-hidden bg-gray-800 flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-medium text-sm flex-1 mr-2 line-clamp-2">{product.name}</h4>
                        <span className={`${getStockColor(product.stock)} text-white text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0`}>
                          {getStockStatus(product.stock)}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs mb-2">{product.category}</p>
                      <p className="text-gray-500 text-xs mb-3 line-clamp-2 flex-1">{product.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white text-lg font-bold">${product.price}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                              }`}
                            />
                          ))}
                          <span className="text-gray-400 text-xs ml-1">({product.reviews})</span>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-gray-700 flex justify-between text-xs text-gray-400">
                        <span className="truncate">SKU: {product.sku}</span>
                        <span className="flex-shrink-0">Stock: {product.stock}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0 flex-1 mr-4">
                          <h4 className="text-white font-medium truncate">{product.name}</h4>
                          <p className="text-gray-400 text-sm mt-1 line-clamp-1">{product.description}</p>
                        </div>
                        <span className={`${getStockColor(product.stock)} text-white text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0`}>
                          {getStockStatus(product.stock)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-400">
                        <span className="truncate">Category: {product.category}</span>
                        <span className="truncate">SKU: {product.sku}</span>
                        <span>Stock: {product.stock}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between flex-shrink-0 ml-4">
                      <span className="text-white text-xl font-bold">${product.price}</span>
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                            }`}
                          />
                        ))}
                        <span className="text-gray-400 text-sm ml-1">({product.reviews})</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;