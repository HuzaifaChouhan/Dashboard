import React, { useState, useMemo, useEffect, useContext } from "react";
import { Search, Filter, Eye, Download, Calendar } from "lucide-react";
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import API_URL from '../config/api';

const Orders = () => {
  const { authToken } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState("All");
  const [dateRange, setDateRange] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, [authToken]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/orders/`, {
        headers: { Authorization: `Bearer ${authToken.access}` }
      });
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customerName = order.customer_name || '';
      const orderId = order.id || '';

      const matchesSearch =
        orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "All" || order.status === selectedStatus;

      const matchesPayment =
        selectedPayment === "All" || order.payment_status === selectedPayment;

      // Date range filtering (simplified for now)
      // In a real app, this would compare specific dates
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchTerm, selectedStatus, selectedPayment]);

  if (loading) return <div className="text-white text-center mt-20">Loading orders...</div>;
  if (error) return <div className="text-red-400 text-center mt-20">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Download className="w-5 h-5" />
          Export Orders
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-[#111827] p-4 rounded-lg border border-gray-700 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1f2937] text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-40 bg-[#1f2937] text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <select
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
            className="w-full sm:w-40 bg-[#1f2937] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
          >
            <option value="All">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#111827] rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1f2937] border-b border-gray-700">
                <th className="text-left text-gray-400 text-xs sm:text-sm font-medium py-4 px-6">Order ID</th>
                <th className="text-left text-gray-400 text-xs sm:text-sm font-medium py-4 px-6">Customer</th>
                <th className="text-left text-gray-400 text-xs sm:text-sm font-medium py-4 px-6">Date</th>
                <th className="text-left text-gray-400 text-xs sm:text-sm font-medium py-4 px-6">Items</th>
                <th className="text-left text-gray-400 text-xs sm:text-sm font-medium py-4 px-6">Total</th>
                <th className="text-left text-gray-400 text-xs sm:text-sm font-medium py-4 px-6">Status</th>
                <th className="text-left text-gray-400 text-xs sm:text-sm font-medium py-4 px-6">Payment</th>
                <th className="text-left text-gray-400 text-xs sm:text-sm font-medium py-4 px-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-700 hover:bg-[#1a2332] transition-colors"
                >
                  <td className="py-4 px-6 text-white font-medium">{order.id}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white">
                        {order.customer_name ? order.customer_name.charAt(0) : 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-medium">{order.customer_name}</span>
                        <span className="text-gray-400 text-xs">{order.customer_email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-400 text-sm">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-gray-400 text-sm">{order.items ? order.items.length : 0} items</td>
                  <td className="py-4 px-6 text-white font-medium">${order.total_amount}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-xs px-3 py-1 rounded-full whitespace-nowrap capitalize
                        ${order.status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                          order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                            order.status === 'cancelled' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {/* Simplified payment badge */}
                      <span className={`w-2 h-2 rounded-full ${order.payment_status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                      <span className="text-gray-300 text-sm capitalize">{order.payment_status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center text-gray-400 py-10">
              No orders found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;