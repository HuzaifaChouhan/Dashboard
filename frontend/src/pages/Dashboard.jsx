import React from "react";
import { Star, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const kpiData = [
    {
      id: 1,
      title: "Total Revenue",
      value: "$45,231",
      change: "+12.5%",
      isPositive: true,
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
    },
    {
      id: 2,
      title: "Total Orders",
      value: "1,429",
      change: "+8.2%",
      isPositive: true,
      icon: ShoppingCart,
      color: "from-blue-500 to-cyan-600",
    },
    {
      id: 3,
      title: "Products Sold",
      value: "3,891",
      change: "-3.1%",
      isPositive: false,
      icon: Package,
      color: "from-purple-500 to-pink-600",
    },
    {
      id: 4,
      title: "Active Users",
      value: "892",
      change: "+15.3%",
      isPositive: true,
      icon: Users,
      color: "from-orange-500 to-red-600",
    },
  ];

  const salesData = [
    { name: 'Jan', sales: 4000, orders: 240 },
    { name: 'Feb', sales: 3000, orders: 198 },
    { name: 'Mar', sales: 5000, orders: 300 },
    { name: 'Apr', sales: 4500, orders: 278 },
    { name: 'May', sales: 6000, orders: 389 },
    { name: 'Jun', sales: 5500, orders: 349 },
  ];

  const products = [
    {
      id: 1,
      name: "Wireless Headphones Pro",
      description: "Premium noise cancellation",
      price: 199.99,
      rating: 5,
      reviews: 42,
      stock: "In Stock",
      stockColor: "bg-green-500",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Smart Watch Series 5",
      description: "Fitness tracking & notifications",
      price: 249.99,
      rating: 5,
      reviews: 89,
      stock: "In Stock",
      stockColor: "bg-green-500",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      name: "360° Bluetooth Speaker",
      description: "Portable with 20h battery",
      price: 89.99,
      rating: 4,
      reviews: 156,
      stock: "Low Stock",
      stockColor: "bg-red-500",
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    },
  ];

  const orders = [
    {
      id: "#ORD-8472",
      customer: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      date: "Jun 12, 2023",
      amount: "$199.99",
      status: "Completed",
      statusColor: "bg-green-500",
    },
    {
      id: "#ORD-8471",
      customer: "Jane Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      date: "Jun 11, 2023",
      amount: "$249.99",
      status: "Shipped",
      statusColor: "bg-blue-500",
    },
    {
      id: "#ORD-8470",
      customer: "Mike Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      date: "Jun 10, 2023",
      amount: "$89.99",
      status: "Pending",
      statusColor: "bg-yellow-500",
    },
    {
      id: "#ORD-8469",
      customer: "Sarah Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      date: "Jun 9, 2023",
      amount: "$349.99",
      status: "Completed",
      statusColor: "bg-green-500",
    },
    {
      id: "#ORD-8468",
      customer: "Tom Brown",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
      date: "Jun 8, 2023",
      amount: "$129.99",
      status: "Shipped",
      statusColor: "bg-blue-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.isPositive ? TrendingUp : TrendingDown;
          return (
            <div
              key={kpi.id}
              data-testid={`kpi-card-${kpi.id}`}
              className="bg-[#111827] rounded-xl p-5 sm:p-6 border border-gray-700 hover:border-gray-600 transition-all hover:scale-105 transform duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${kpi.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  <TrendIcon className="w-4 h-4" />
                  <span>{kpi.change}</span>
                </div>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{kpi.title}</h3>
              <p className="text-white text-2xl sm:text-3xl font-bold">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-[#111827] rounded-lg p-4 sm:p-6 border border-gray-700">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Sales Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Area type="monotone" dataKey="sales" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="bg-[#111827] rounded-lg p-4 sm:p-6 border border-gray-700">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Orders by Month</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="orders" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Products Section */}
      <div className="bg-[#111827] rounded-lg p-4 sm:p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-white">Recent Products</h3>
          <button
            data-testid="view-all-products-btn"
            className="px-4 py-2 bg-[#1e2875] hover:bg-[#2a3690] text-white text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
          >
            View All Products
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              data-testid={`product-card-${product.id}`}
              className="bg-[#1a2332] rounded-lg overflow-hidden border border-gray-700 hover:border-[#1e2875] transition-all hover:shadow-lg hover:shadow-[#1e2875]/20"
            >
              <div className="aspect-square overflow-hidden bg-gray-800">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-white font-medium text-sm sm:text-base">{product.name}</h4>
                  <span
                    className={`${product.stockColor} text-white text-xs px-2 py-1 rounded-full whitespace-nowrap`}
                  >
                    {product.stock}
                  </span>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm mb-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white text-lg font-bold">${product.price}</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${
                          i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                        }`}
                      />
                    ))}
                    <span className="text-gray-400 text-xs ml-1">({product.reviews})</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-[#111827] rounded-lg p-4 sm:p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-white">Recent Orders</h3>
          <button
            data-testid="view-all-orders-btn"
            className="px-4 py-2 bg-[#1e2875] hover:bg-[#2a3690] text-white text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
          >
            View All Orders
          </button>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3 px-4 sm:px-0">Order ID</th>
                  <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3 px-2 sm:px-0">Customer</th>
                  <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3 px-2 sm:px-0 hidden md:table-cell">Date</th>
                  <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3 px-2 sm:px-0">Amount</th>
                  <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3 px-2 sm:px-0">Status</th>
                  <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3 px-4 sm:px-0 hidden lg:table-cell">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    data-testid={`order-row-${order.id}`}
                    className="border-b border-gray-800 hover:bg-[#1a2332] transition-colors"
                  >
                    <td className="py-3 sm:py-4 text-white text-xs sm:text-sm px-4 sm:px-0">{order.id}</td>
                    <td className="py-3 sm:py-4 px-2 sm:px-0">
                      <div className="flex items-center gap-2">
                        <img
                          src={order.avatar}
                          alt={order.customer}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
                        />
                        <span className="text-white text-xs sm:text-sm hidden sm:inline">{order.customer}</span>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 text-gray-400 text-xs sm:text-sm px-2 sm:px-0 hidden md:table-cell">{order.date}</td>
                    <td className="py-3 sm:py-4 text-white text-xs sm:text-sm font-medium px-2 sm:px-0">{order.amount}</td>
                    <td className="py-3 sm:py-4 px-2 sm:px-0">
                      <span
                        className={`${order.statusColor} text-white text-xs px-2 sm:px-3 py-1 rounded-full whitespace-nowrap`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-0 hidden lg:table-cell">
                      <button
                        data-testid={`view-details-${order.id}`}
                        className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;