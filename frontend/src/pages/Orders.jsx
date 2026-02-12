import React, { useState, useMemo } from "react";
import { Search, Filter, Calendar, Package, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Truck, Eye, Download, RefreshCw, X } from "lucide-react";

const Orders = () => {
  // Sample order data
  const [orders] = useState([
    {
      id: "ORD-2024-001",
      customerId: "CUST-001",
      customerName: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      orderDate: "2024-01-15T10:30:00",
      status: "delivered",
      paymentMethod: "Credit Card",
      paymentStatus: "paid",
      totalAmount: 259.98,
      items: 3,
      shippingAddress: "123 Main St, New York, NY 10001",
      trackingNumber: "TRK123456789",
      estimatedDelivery: "2024-01-18",
    },
    {
      id: "ORD-2024-002",
      customerId: "CUST-002",
      customerName: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "+1 (555) 234-5678",
      orderDate: "2024-01-15T14:22:00",
      status: "shipped",
      paymentMethod: "PayPal",
      paymentStatus: "paid",
      totalAmount: 189.99,
      items: 2,
      shippingAddress: "456 Oak Ave, Los Angeles, CA 90001",
      trackingNumber: "TRK987654321",
      estimatedDelivery: "2024-01-17",
    },
    {
      id: "ORD-2024-003",
      customerId: "CUST-003",
      customerName: "Robert Johnson",
      email: "robert.j@email.com",
      phone: "+1 (555) 345-6789",
      orderDate: "2024-01-16T09:15:00",
      status: "processing",
      paymentMethod: "Debit Card",
      paymentStatus: "paid",
      totalAmount: 425.50,
      items: 5,
      shippingAddress: "789 Pine Rd, Chicago, IL 60601",
      trackingNumber: null,
      estimatedDelivery: "2024-01-20",
    },
    {
      id: "ORD-2024-004",
      customerId: "CUST-004",
      customerName: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "+1 (555) 456-7890",
      orderDate: "2024-01-16T16:45:00",
      status: "pending",
      paymentMethod: "Credit Card",
      paymentStatus: "pending",
      totalAmount: 89.99,
      items: 1,
      shippingAddress: "321 Elm St, Houston, TX 77001",
      trackingNumber: null,
      estimatedDelivery: "2024-01-22",
    },
    {
      id: "ORD-2024-005",
      customerId: "CUST-005",
      customerName: "Michael Wilson",
      email: "m.wilson@email.com",
      phone: "+1 (555) 567-8901",
      orderDate: "2024-01-17T11:20:00",
      status: "cancelled",
      paymentMethod: "Bank Transfer",
      paymentStatus: "refunded",
      totalAmount: 156.75,
      items: 2,
      shippingAddress: "654 Maple Dr, Phoenix, AZ 85001",
      trackingNumber: null,
      estimatedDelivery: null,
    },
    {
      id: "ORD-2024-006",
      customerId: "CUST-006",
      customerName: "Sarah Brown",
      email: "sarah.b@email.com",
      phone: "+1 (555) 678-9012",
      orderDate: "2024-01-17T13:55:00",
      status: "shipped",
      paymentMethod: "Apple Pay",
      paymentStatus: "paid",
      totalAmount: 312.00,
      items: 4,
      shippingAddress: "987 Cedar Ln, Philadelphia, PA 19101",
      trackingNumber: "TRK456789123",
      estimatedDelivery: "2024-01-19",
    },
  ]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.includes(searchTerm) ||
        order.customerId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
      const matchesPayment = selectedPayment === "all" || order.paymentMethod === selectedPayment;
      
      const matchesDate = 
        (!dateRange.start || new Date(order.orderDate) >= new Date(dateRange.start)) &&
        (!dateRange.end || new Date(order.orderDate) <= new Date(dateRange.end));
      
      return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    });
  }, [orders, searchTerm, selectedStatus, selectedPayment, dateRange]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === "pending").length;
    const processingOrders = orders.filter(o => o.status === "processing").length;
    const totalRevenue = orders
      .filter(o => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.totalAmount, 0);
    
    return { totalOrders, pendingOrders, processingOrders, totalRevenue };
  }, [orders]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "processing": return <RefreshCw className="w-4 h-4" />;
      case "shipped": return <Truck className="w-4 h-4" />;
      case "delivered": return <CheckCircle className="w-4 h-4" />;
      case "cancelled": return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "text-yellow-500 bg-yellow-500/10";
      case "processing": return "text-blue-500 bg-blue-500/10";
      case "shipped": return "text-purple-500 bg-purple-500/10";
      case "delivered": return "text-green-500 bg-green-500/10";
      case "cancelled": return "text-red-500 bg-red-500/10";
      default: return "text-gray-500 bg-gray-500/10";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid": return "text-green-500";
      case "pending": return "text-yellow-500";
      case "refunded": return "text-red-500";
      default: return "text-gray-500";
    }
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

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#111827] rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-sm truncate">Total Orders</p>
                <p className="text-white text-2xl font-bold mt-1">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                <Package className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-[#111827] rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-sm truncate">Pending Orders</p>
                <p className="text-white text-2xl font-bold mt-1">{stats.pendingOrders}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-[#111827] rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-sm truncate">Processing</p>
                <p className="text-white text-2xl font-bold mt-1">{stats.processingOrders}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                <RefreshCw className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-[#111827] rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-sm truncate">Total Revenue</p>
                <p className="text-white text-2xl font-bold mt-1 truncate">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                <DollarSign className="w-6 h-6 text-green-500" />
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
                placeholder="Search by order ID, customer name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1e2875]"
              />
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
            <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Order Status Filter */}
              <div className="min-w-0">
                <label className="block text-gray-400 text-sm mb-2">Order Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#1e2875]"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              {/* Payment Method Filter */}
              <div className="min-w-0">
                <label className="block text-gray-400 text-sm mb-2">Payment Method</label>
                <select
                  value={selectedPayment}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#1e2875]"
                >
                  <option value="all">All Methods</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Apple Pay">Apple Pay</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              
              {/* Date Range Start */}
              <div className="min-w-0">
                <label className="block text-gray-400 text-sm mb-2">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#1e2875]"
                />
              </div>
              
              {/* Date Range End */}
              <div className="min-w-0">
                <label className="block text-gray-400 text-sm mb-2">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#1e2875]"
                />
              </div>
            </div>
          )}
          
          {/* Results Count */}
          <div className="mt-4 text-gray-400 text-sm">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#111827] rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1a2332] border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#1a2332] transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{order.id}</div>
                      <div className="text-xs text-gray-400">{order.customerId}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-white">{order.customerName}</div>
                      <div className="text-xs text-gray-400 line-clamp-1">{order.shippingAddress}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-300">{order.email}</div>
                      <div className="text-xs text-gray-400">{order.phone}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{formatDate(order.orderDate)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{order.paymentMethod}</div>
                      <div className={`text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-white font-medium">${order.totalAmount.toFixed(2)}</div>
                      <div className="text-xs text-gray-400">{order.items} items</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                          title="Download Invoice"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No orders found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="bg-[#111827] rounded-lg border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Order Details</h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Order Header */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Order ID</p>
                      <p className="text-white font-medium">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Order Date</p>
                      <p className="text-white font-medium">{formatDate(selectedOrder.orderDate)}</p>
                    </div>
                  </div>
                  
                  {/* Customer Information */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Customer Information</h4>
                    <div className="bg-[#1a2332] rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white">{selectedOrder.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Customer ID:</span>
                        <span className="text-white">{selectedOrder.customerId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white">{selectedOrder.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Phone:</span>
                        <span className="text-white">{selectedOrder.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Shipping Address:</span>
                        <span className="text-white text-right">{selectedOrder.shippingAddress}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Status */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Order Status</h4>
                    <div className="bg-[#1a2332] rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
                          {getStatusIcon(selectedOrder.status)}
                          <span className="capitalize">{selectedOrder.status}</span>
                        </div>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tracking Number:</span>
                          <span className="text-white">{selectedOrder.trackingNumber}</span>
                        </div>
                      )}
                      {selectedOrder.estimatedDelivery && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Estimated Delivery:</span>
                          <span className="text-white">{selectedOrder.estimatedDelivery}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Payment Information */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Payment Information</h4>
                    <div className="bg-[#1a2332] rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Payment Method:</span>
                        <span className="text-white">{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Payment Status:</span>
                        <span className={`font-medium ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                          {selectedOrder.paymentStatus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Amount:</span>
                        <span className="text-white font-medium">${selectedOrder.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Number of Items:</span>
                        <span className="text-white">{selectedOrder.items}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button className="flex-1 px-4 py-2 bg-[#1e2875] text-white rounded-lg hover:bg-[#2a3599] transition-colors">
                      Update Status
                    </button>
                    <button className="flex-1 px-4 py-2 bg-[#1a2332] border border-gray-600 text-white rounded-lg hover:bg-[#252f41] transition-colors">
                      Send Invoice
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

export default Orders;