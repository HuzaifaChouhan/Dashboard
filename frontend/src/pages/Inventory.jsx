import React, { useState, useMemo } from 'react';
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

const Inventory = () => {
  // Sample data
  const [products] = useState([
    {
      id: "PRD-001",
      sku: "SKU-001",
      barcode: "1234567890123",
      name: "Wireless Bluetooth Headphones",
      description: "Premium noise-cancelling wireless headphones with 30-hour battery life",
      category: "Electronics",
      supplier: "TechSupply Co.",
      currentStock: 45,
      minStock: 10,
      maxStock: 100,
      unitPrice: 79.99,
      unitCost: 45.50,
      status: "in-stock",
      location: "Warehouse A - Shelf 12",
      lastRestocked: "2024-01-15T10:30:00Z",
      image: "https://picsum.photos/seed/headphones/100/100.jpg"
    },
    {
      id: "PRD-002",
      sku: "SKU-002",
      barcode: "2345678901234",
      name: "Ergonomic Office Chair",
      description: "Comfortable ergonomic chair with lumbar support and adjustable height",
      category: "Furniture",
      supplier: "OfficeFurniture Plus",
      currentStock: 8,
      minStock: 15,
      maxStock: 50,
      unitPrice: 299.99,
      unitCost: 180.00,
      status: "low-stock",
      location: "Warehouse B - Section 5",
      lastRestocked: "2024-01-10T14:20:00Z",
      image: "https://picsum.photos/seed/chair/100/100.jpg"
    },
    {
      id: "PRD-003",
      sku: "SKU-003",
      barcode: "3456789012345",
      name: "USB-C Hub Adapter",
      description: "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader",
      category: "Electronics",
      supplier: "TechSupply Co.",
      currentStock: 0,
      minStock: 20,
      maxStock: 100,
      unitPrice: 39.99,
      unitCost: 22.50,
      status: "out-of-stock",
      location: "Warehouse A - Shelf 8",
      lastRestocked: "2023-12-20T09:15:00Z",
      image: "https://picsum.photos/seed/usbhub/100/100.jpg"
    },
    {
      id: "PRD-004",
      sku: "SKU-004",
      barcode: "4567890123456",
      name: "Stainless Steel Water Bottle",
      description: "Insulated 32oz water bottle, keeps drinks cold for 24 hours",
      category: "Sports & Outdoors",
      supplier: "FitGear Supplies",
      currentStock: 120,
      minStock: 30,
      maxStock: 200,
      unitPrice: 24.99,
      unitCost: 12.75,
      status: "in-stock",
      location: "Warehouse C - Rack 3",
      lastRestocked: "2024-01-18T11:45:00Z",
      image: "https://picsum.photos/seed/bottle/100/100.jpg"
    },
    {
      id: "PRD-005",
      sku: "SKU-005",
      barcode: "5678901234567",
      name: "Wireless Mouse",
      description: "Ergonomic wireless mouse with precision tracking",
      category: "Electronics",
      supplier: "TechSupply Co.",
      currentStock: 25,
      minStock: 20,
      maxStock: 80,
      unitPrice: 29.99,
      unitCost: 15.25,
      status: "in-stock",
      location: "Warehouse A - Shelf 15",
      lastRestocked: "2024-01-12T16:30:00Z",
      image: "https://picsum.photos/seed/mouse/100/100.jpg"
    }
  ]);

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
    currentStock: 0,
    minStock: 0,
    maxStock: 100,
    unitPrice: 0,
    unitCost: 0,
    location: "",
    image: ""
  });

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = 
        product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm) ||
        product.location.toLowerCase().includes(searchTerm.toLowerCase());
      
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
    const totalValue = products.reduce((sum, p) => sum + (p.currentStock * p.unitCost), 0);
    const lowStockItems = products.filter(p => p.currentStock <= p.minStock);
    
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
    return Math.min((product.currentStock / product.maxStock) * 100, 100);
  };

  const formatDate = (dateString) => {
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

  // Generate new product ID
  const generateProductId = () => {
    const maxId = products.reduce((max, p) => {
      const num = parseInt(p.id.split('-')[1]);
      return num > max ? num : max;
    }, 0);
    return `PRD-${String(maxId + 1).padStart(3, '0')}`;
  };

  // Generate new SKU
  const generateSKU = () => {
    const maxSku = products.reduce((max, p) => {
      const num = parseInt(p.sku.split('-')[1]);
      return num > max ? num : max;
    }, 0);
    return `SKU-${String(maxSku + 1).padStart(3, '0')}`;
  };

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

    // Generate ID and SKU if not provided
    const productToAdd = {
      ...newProduct,
      id: newProduct.id || generateProductId(),
      sku: newProduct.sku || generateSKU(),
      barcode: newProduct.barcode || Math.random().toString().slice(2, 13),
      currentStock: parseInt(newProduct.currentStock) || 0,
      minStock: parseInt(newProduct.minStock) || 0,
      maxStock: parseInt(newProduct.maxStock) || 100,
      unitPrice: parseFloat(newProduct.unitPrice) || 0,
      unitCost: parseFloat(newProduct.unitCost) || 0,
      lastRestocked: new Date().toISOString(),
      image: newProduct.image || `https://picsum.photos/seed/${Date.now()}/100/100.jpg`
    };

    // Determine stock status
    if (productToAdd.currentStock === 0) {
      productToAdd.status = "out-of-stock";
    } else if (productToAdd.currentStock <= productToAdd.minStock) {
      productToAdd.status = "low-stock";
    } else {
      productToAdd.status = "in-stock";
    }

    console.log('Adding product:', productToAdd);
    // Here you would typically add the product to your state or send to API
    
    // Reset form and close modal
    setNewProduct({
      id: "",
      sku: "",
      barcode: "",
      name: "",
      description: "",
      category: "",
      supplier: "",
      currentStock: 0,
      minStock: 0,
      maxStock: 100,
      unitPrice: 0,
      unitCost: 0,
      location: "",
      image: ""
    });
    setShowAddProductModal(false);
  };

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
                          <span className="text-sm text-white font-medium">{product.currentStock}</span>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(product.status)}`}>
                            {getStatusIcon(product.status)}
                            <span className="capitalize">{product.status.replace('-', ' ')}</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              product.status === 'in-stock' ? 'bg-green-500' :
                              product.status === 'low-stock' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${getStockPercentage(product)}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-400">
                          Min: {product.minStock} | Max: {product.maxStock}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-white font-medium">${product.unitPrice.toFixed(2)}</div>
                      <div className="text-xs text-gray-400">Cost: ${product.unitCost.toFixed(2)}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-white font-medium">
                        ${(product.currentStock * product.unitCost).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-300">{product.supplier}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-300">{getRelativeTime(product.lastRestocked)}</div>
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
                          <span className="text-white font-medium">{selectedProduct.currentStock} units</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Minimum Stock</span>
                          <span className="text-white">{selectedProduct.minStock} units</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Maximum Stock</span>
                          <span className="text-white">{selectedProduct.maxStock} units</span>
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
                          <span className="text-white font-medium">${selectedProduct.unitPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Unit Cost</span>
                          <span className="text-white">${selectedProduct.unitCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Profit Margin</span>
                          <span className="text-green-500">
                            {(((selectedProduct.unitPrice - selectedProduct.unitCost) / selectedProduct.unitPrice) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Total Inventory Value</span>
                          <span className="text-white font-medium">
                            ${(selectedProduct.currentStock * selectedProduct.unitCost).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Potential Revenue</span>
                          <span className="text-white">
                            ${(selectedProduct.currentStock * selectedProduct.unitPrice).toFixed(2)}
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
                          <span className="text-white">{formatDate(selectedProduct.lastRestocked)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Days Since Restock</span>
                          <span className="text-white">
                            {Math.floor((new Date() - new Date(selectedProduct.lastRestocked)) / (1000 * 60 * 60 * 24))} days
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
                          className={`h-3 rounded-full transition-all ${
                            selectedProduct.status === 'in-stock' ? 'bg-green-500' :
                            selectedProduct.status === 'low-stock' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${getStockPercentage(selectedProduct)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>0</span>
                        <span>Min: {selectedProduct.minStock}</span>
                        <span>Current: {selectedProduct.currentStock}</span>
                        <span>Max: {selectedProduct.maxStock}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-700">
                    <button className="flex-1 px-4 py-2 bg-[#1e2875] text-white rounded-lg hover:bg-[#2a3599] transition-colors flex items-center justify-center gap-2">
                      <Edit className="w-4 h-4" />
                      Edit Product
                    </button>
                    <button 
                      onClick={() => {
                        setShowStockModal(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="flex-1 px-4 py-2 bg-[#1a2332] border border-gray-600 text-white rounded-lg hover:bg-[#252f41] transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Adjust Stock
                    </button>
                    <button className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stock Adjustment Modal */}
        {showStockModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="bg-[#111827] rounded-lg border border-gray-700 max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Adjust Stock</h3>
                  <button
                    onClick={() => setShowStockModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-[#1a2332] rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={showStockModal.image} 
                        alt={showStockModal.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-white font-medium">{showStockModal.name}</p>
                        <p className="text-gray-400 text-sm">Current Stock: {showStockModal.currentStock} units</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Adjustment Type</label>
                    <select className="w-full px-3 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#1e2875]">
                      <option value="in">Stock In (Purchase)</option>
                      <option value="out">Stock Out (Sale)</option>
                      <option value="adjustment">Manual Adjustment</option>
                      <option value="return">Customer Return</option>
                      <option value="damage">Damaged/Lost</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Quantity</label>
                    <input
                      type="number"
                      placeholder="Enter quantity"
                      className="w-full px-3 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1e2875]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Reason/Notes</label>
                    <textarea
                      placeholder="Enter reason for adjustment..."
                      rows={3}
                      className="w-full px-3 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1e2875]"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button className="flex-1 px-4 py-2 bg-[#1e2875] text-white rounded-lg hover:bg-[#2a3599] transition-colors">
                      Confirm Adjustment
                    </button>
                    <button 
                      onClick={() => setShowStockModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddProductModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="bg-[#111827] rounded-lg border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Add New Product</h3>
                  <button
                    onClick={() => setShowAddProductModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Basic Information */}
                  <div className="bg-[#1a2332] rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Product Name *</label>
                        <input
                          type="text"
                          value={newProduct.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter product name"
                          className="w-full px-3 py-2 bg-[#111827] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1e2875]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">SKU</label>
                        <input
                          type="text"
                          value={newProduct.sku}
                          onChange={(e) => handleInputChange('sku', e.target.value)}
                          placeholder="Auto-generated if empty"
                          className="w-full px-3 py-2 bg-[#111827] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1e2875]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Barcode</label>
                        <input
                          type="text"
                          value={newProduct.barcode}
                          onChange={(e) => handleInputChange('barcode', e.target.value)}
                          placeholder="Auto-generated if empty"
                          className="w-full px-3 py-2 bg-[#111827] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1e2875]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Category *</label>
                        <select
                          value={newProduct.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          className="w-full px-3 py-2 bg-[#111827] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#1e2875]"
                        >
                          <option value="">Select category</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Furniture">Furniture</option>
                          <option value="Sports & Outdoors">Sports & Outdoors</option>
                          <option value="Clothing">Clothing</option>
                          <option value="Food & Beverages">Food & Beverages</option>
                          <option value="Books">Books</option>
                          <option value="Toys & Games">Toys & Games</option>
                          <option value="Health & Beauty">Health & Beauty</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-gray-400 text-sm mb-2">Description</label>
                      <textarea
                        value={newProduct.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Enter product description"
                        rows={3}
                        className="w-full px-3 py-2 bg-[#111827] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1e2875]"
                      />
                    </div>
                  </div>

                  {/* Stock Information */}
                  <div className="bg-[#1a2332] rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">Stock Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Initial Stock *</label>
                        <input
                          type="number"
                          value={newProduct.currentStock}
                          onChange={(e) => handleInputChange('currentStock', e.target.value)}
                          placeholder="0"
                          min="0"
                          className="w-full px-3 py-2 bg-[#111827] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1e2875]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Minimum Stock *</label>
                        <input
                          type="number"
                          value={newProduct.minStock}
                          onChange={(e) => handleInputChange('minStock', e.target.value)}
                          placeholder="0"
                          min="0"
                          className="w-full px-3 py-2 bg-[#111827] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1e2875]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Maximum Stock *</label>
                        <input
                          type="number"
                          value={newProduct.maxStock}
                          onChange={(e) => handleInputChange('maxStock', e.target.value)}
                          placeholder="100"
                          min="0"
                          className="w-full px-3 py-2 bg-[#111827] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1e2875]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Location</label>
                        <input
                          type="text"
                          value={newProduct.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="e.g., Warehouse A - Shelf 12"
                          className="w-full px-3 py-2 bg-[#111827] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1e2875]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div className="bg-[#1a2332] rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">Financial Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Unit Price ($) *</label>
                        <input
                          type="number"
                          value={newProduct.unitPrice}
                          onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 bg-[#111827] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1e2875]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Unit Cost ($) *</label>
                        <input
                          type="number"
                          value={newProduct.unitCost}
                          onChange={(e) => handleInputChange('unitCost', e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 bg-[#111827] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1e2875]"
                        />
                      </div>
                    </div>
                    {newProduct.unitPrice > 0 && newProduct.unitCost > 0 && (
                      <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Estimated Profit Margin:</span>
                          <span className="text-green-500 font-medium">
                            {(((newProduct.unitPrice - newProduct.unitCost) / newProduct.unitPrice) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Supplier Information */}
                  <div className="bg-[#1a2332] rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">Supplier Information</h4>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Supplier *</label>
                      <input
                        type="text"
                        value={newProduct.supplier}
                        onChange={(e) => handleInputChange('supplier', e.target.value)}
                        placeholder="Enter supplier name"
                        className="w-full px-3 py-2 bg-[#111827] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1e2875]"
                      />
                    </div>
                  </div>

                  {/* Product Image */}
                  <div className="bg-[#1a2332] rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">Product Image</h4>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Image URL</label>
                      <input
                        type="text"
                        value={newProduct.image}
                        onChange={(e) => handleInputChange('image', e.target.value)}
                        placeholder="Leave empty for random image"
                        className="w-full px-3 py-2 bg-[#111827] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1e2875]"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleAddProduct}
                      className="flex-1 px-4 py-2 bg-[#1e2875] text-white rounded-lg hover:bg-[#2a3599] transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Product
                    </button>
                    <button 
                      onClick={() => setShowAddProductModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
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