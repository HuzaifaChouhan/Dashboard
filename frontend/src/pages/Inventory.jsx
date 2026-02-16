import React, { useState, useMemo, useContext, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Package,
  Check,
  AlertTriangle,
  X,
  Tag,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Box,
  BarChart3,
  Calendar
} from 'lucide-react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Inventory = () => {
  const { authToken } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: "",
    sku: "",
    barcode: "",
    name: "",
    description: "",
    category: "",
    supplier: "",
    current_stock: 0,
    min_stock: 0,
    max_stock: 100,
    unit_price: 0,
    unit_cost: 0,
    location: "",
    image: ""
  });

  useEffect(() => {
    fetchInventory();
  }, [authToken]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/products/', {
        headers: { Authorization: `Bearer ${authToken.access}` }
      });
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError("Failed to load inventory");
      setLoading(false);
    }
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch =
        product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.barcode && product.barcode.includes(searchTerm)) ||
        (product.location && product.location.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesStatus = selectedStatus === "all" || product.status === selectedStatus;
      const matchesSupplier = selectedSupplier === "all" || product.supplier === selectedSupplier;

      return matchesSearch && matchesCategory && matchesStatus && matchesSupplier;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus, selectedSupplier]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const inStock = products.filter(p => p.status === "in-stock").length;
    const lowStock = products.filter(p => p.status === "low-stock").length;
    const outOfStock = products.filter(p => p.status === "out-of-stock").length;
    const totalValue = products.reduce((sum, p) => sum + (p.current_stock * p.unit_cost), 0);
    const lowStockItems = products.filter(p => p.current_stock <= p.min_stock);

    return { totalProducts, inStock, lowStock, outOfStock, totalValue, lowStockItems };
  }, [products]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "in-stock": return <Check className="w-4 h-4" />;
      case "low-stock": return <AlertTriangle className="w-4 h-4" />;
      case "out-of-stock": return <X className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "in-stock": return "text-green-500 bg-green-500/10";
      case "low-stock": return "text-yellow-500 bg-yellow-500/10";
      case "out-of-stock": return "text-red-500 bg-red-500/10";
      default: return "text-gray-500 bg-gray-500/10";
    }
  };

  const getStockPercentage = (product) => {
    return Math.min((product.current_stock / product.max_stock) * 100, 100);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDate(dateString);
  };

  // Get unique categories and suppliers
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return cats.sort();
  }, [products]);

  const suppliers = useMemo(() => {
    const sups = [...new Set(products.map(p => p.supplier))];
    return sups.sort();
  }, [products]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleAddProduct = () => {
    // Validate required fields
    if (!newProduct.name || !newProduct.category || !newProduct.supplier) {
      alert('Please fill in all required fields');
      return;
    }

    // This would ideally make a POST request to the backend
    console.log('Adding product:', newProduct);

    // Reset form and close modal
    setNewProduct({
      id: "",
      sku: "",
      barcode: "",
      name: "",
      description: "",
      category: "",
      supplier: "",
      current_stock: 0,
      min_stock: 0,
      max_stock: 100,
      unit_price: 0,
      unit_cost: 0,
      location: "",
      image: ""
    });
    setShowAddProductModal(false);
  };

  if (loading) return <div className="text-white text-center mt-20">Loading inventory...</div>;
  if (error) return <div className="text-red-400 text-center mt-20">{error}</div>;

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-[#111827] rounded-lg p-4 border border-gray-700">
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

          <div className="bg-[#111827] rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-sm truncate">In Stock</p>
                <p className="text-white text-2xl font-bold mt-1">{stats.inStock}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                <Check className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-sm truncate">Low Stock</p>
                <p className="text-white text-2xl font-bold mt-1 text-yellow-500">{stats.lowStock}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-sm truncate">Out of Stock</p>
                <p className="text-white text-2xl font-bold mt-1 text-red-500">{stats.outOfStock}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                <X className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-sm truncate">Total Value</p>
                <p className="text-white text-2xl font-bold mt-1 truncate">${stats.totalValue.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                <DollarSign className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        {stats.lowStockItems.length > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-yellow-500 font-medium">Low Stock Alert</p>
                <p className="text-yellow-400 text-sm">
                  {stats.lowStockItems.length} products need to be restocked soon
                </p>
              </div>
              <button
                onClick={() => setSelectedStatus("low-stock")}
                className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm"
              >
                View Items
              </button>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-[#111827] rounded-lg p-4 border border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, SKU, barcode, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1e2875]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-[#1a2332] border border-gray-600 text-white rounded-lg hover:bg-[#1e2875] transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <Filter className="w-4 h-4" />
                Filters
                {showFilters && <X className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2 bg-[#1e2875] text-white rounded-lg hover:bg-[#2a3599] transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>

              <button className="px-4 py-2 bg-[#1a2332] border border-gray-600 text-white rounded-lg hover:bg-[#252f41] transition-colors flex items-center gap-2 whitespace-nowrap">
                <Download className="w-4 h-4" />
                Export
              </button>

              <button className="px-4 py-2 bg-[#1a2332] border border-gray-600 text-white rounded-lg hover:bg-[#252f41] transition-colors flex items-center gap-2 whitespace-nowrap">
                <Upload className="w-4 h-4" />
                Import
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div className="min-w-0">
                <label className="block text-gray-400 text-sm mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#1e2875]"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
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

              {/* Supplier Filter */}
              <div className="min-w-0">
                <label className="block text-gray-400 text-sm mb-2">Supplier</label>
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#1e2875]"
                >
                  <option value="all">All Suppliers</option>
                  {suppliers.map(sup => (
                    <option key={sup} value={sup}>{sup}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div className="min-w-0 flex items-end">
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedStatus("all");
                    setSelectedSupplier("all");
                  }}
                  className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 text-gray-400 text-sm">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-[#111827] rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1a2332] border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock Level</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Unit Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Supplier</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Restocked</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#1a2332] transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="text-sm font-medium text-white">{product.name}</div>
                          <div className="text-xs text-gray-400">SKU: {product.sku}</div>
                          <div className="text-xs text-gray-400">ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3 text-gray-500" />
                        <span className="text-sm text-gray-300">{product.category}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white font-medium">{product.current_stock}</span>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(product.status)}`}>
                            {getStatusIcon(product.status)}
                            <span className="capitalize">{product.status.replace('-', ' ')}</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${product.status === 'in-stock' ? 'bg-green-500' :
                                product.status === 'low-stock' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                            style={{ width: `${getStockPercentage(product)}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-400">
                          Min: {product.min_stock} | Max: {product.max_stock}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-white font-medium">${parseFloat(product.unit_price).toFixed(2)}</div>
                      <div className="text-xs text-gray-400">Cost: ${parseFloat(product.unit_cost).toFixed(2)}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-white font-medium">
                        ${(product.current_stock * product.unit_cost).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-300">{product.supplier}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-300">{getRelativeTime(product.last_restocked)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowStockModal(product)}
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                          title="Adjust Stock"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No products found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Product Details Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="bg-[#111827] rounded-lg border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Product Details</h3>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Product Header */}
                  <div className="flex items-start gap-4 pb-6 border-b border-gray-700">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-2">{selectedProduct.name}</h4>
                      <p className="text-gray-400 text-sm mb-3">{selectedProduct.description}</p>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <div>
                          <span className="text-gray-400">Product ID:</span>
                          <span className="text-white ml-1">{selectedProduct.id}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">SKU:</span>
                          <span className="text-white ml-1">{selectedProduct.sku}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Barcode:</span>
                          <span className="text-white ml-1">{selectedProduct.barcode}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Stock Information */}
                    <div>
                      <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                        <Box className="w-4 h-4" />
                        Stock Information
                      </h5>
                      <div className="bg-[#1a2332] rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Current Stock</span>
                          <span className="text-white font-medium">{selectedProduct.current_stock} units</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Minimum Stock</span>
                          <span className="text-white">{selectedProduct.min_stock} units</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Maximum Stock</span>
                          <span className="text-white">{selectedProduct.max_stock} units</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Stock Status</span>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedProduct.status)}`}>
                            {getStatusIcon(selectedProduct.status)}
                            <span className="capitalize">{selectedProduct.status.replace('-', ' ')}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Location</span>
                          <span className="text-white">{selectedProduct.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Financial Information */}
                    <div>
                      <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Financial Information
                      </h5>
                      <div className="bg-[#1a2332] rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Unit Price</span>
                          <span className="text-white font-medium">${parseFloat(selectedProduct.unit_price).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Unit Cost</span>
                          <span className="text-white">${parseFloat(selectedProduct.unit_cost).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Profit Margin</span>
                          <span className="text-green-500">
                            {(((selectedProduct.unit_price - selectedProduct.unit_cost) / selectedProduct.unit_price) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Total Inventory Value</span>
                          <span className="text-white font-medium">
                            ${(selectedProduct.current_stock * selectedProduct.unit_cost).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Potential Revenue</span>
                          <span className="text-white">
                            ${(selectedProduct.current_stock * selectedProduct.unit_price).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Category & Supplier
                      </h5>
                      <div className="bg-[#1a2332] rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Category</span>
                          <span className="text-white">{selectedProduct.category}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Supplier</span>
                          <span className="text-white">{selectedProduct.supplier}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Timeline
                      </h5>
                      <div className="bg-[#1a2332] rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Last Restocked</span>
                          <span className="text-white">{formatDate(selectedProduct.last_restocked)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Days Since Restock</span>
                          <span className="text-white">
                            {Math.floor((new Date() - new Date(selectedProduct.last_restocked)) / (1000 * 60 * 60 * 24))} days
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stock Level Progress */}
                  <div>
                    <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Stock Level Analysis
                    </h5>
                    <div className="bg-[#1a2332] rounded-lg p-4">
                      <div className="mb-3 flex justify-between text-sm">
                        <span className="text-gray-400">Current Stock Level</span>
                        <span className="text-white font-medium">{getStockPercentage(selectedProduct).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
                        <div
                          className={`h-3 rounded-full transition-all ${selectedProduct.status === 'in-stock' ? 'bg-green-500' :
                              selectedProduct.status === 'low-stock' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          style={{ width: `${getStockPercentage(selectedProduct)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;