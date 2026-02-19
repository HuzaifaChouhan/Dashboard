import React, { useState, useEffect, useContext } from "react";
import { Star, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users, AlertCircle, Settings } from "lucide-react";
import {
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import AuthContext from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

const Dashboard = () => {
  const { authToken } = useContext(AuthContext);
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kpiData, setKpiData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const navigate = useNavigate();

  // Read chart preferences from localStorage
  const chartDataSource = localStorage.getItem('dashboard_chart_data') || 'sales';
  const chartType = localStorage.getItem('dashboard_chart_type') || 'area';

  // Determine chart data/key/color based on source
  const isInventory = chartDataSource === 'inventory';
  const chartData = isInventory ? inventoryData : salesData;
  const chartDataKey = isInventory ? 'stock' : (chartDataSource === 'sales' ? 'sales' : 'orders');
  const chartTitle = chartDataSource === 'sales' ? 'Sales Overview' : chartDataSource === 'orders' ? 'Orders Overview' : 'Inventory Overview';
  const chartColor = chartDataSource === 'sales' ? '#3b82f6' : chartDataSource === 'orders' ? '#8b5cf6' : '#10b981';

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const axisColor = isDark ? '#9ca3af' : '#6b7280';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb';
  const tooltipColor = isDark ? '#fff' : '#111827';

  const tooltipStyle = {
    backgroundColor: tooltipBg,
    border: `1px solid ${tooltipBorder}`,
    borderRadius: '8px',
    color: tooltipColor
  };

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-[350px]" style={{ color: 'var(--text-muted)' }}>
          <p>No data available for this chart.</p>
        </div>
      );
    }

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey={chartDataKey} fill={chartColor} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey={chartDataKey} stroke={chartColor} strokeWidth={3} dot={{ fill: chartColor, r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey={chartDataKey}
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={130}
                innerRadius={60}
                paddingAngle={4}
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={{ stroke: axisColor }}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                formatter={(value) => <span style={{ color: isDark ? '#d1d5db' : '#374151' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart cx="50%" cy="50%" outerRadius={120} data={chartData}>
              <PolarGrid stroke={gridColor} />
              <PolarAngleAxis dataKey="name" stroke={axisColor} tick={{ fill: axisColor, fontSize: 12 }} />
              <PolarRadiusAxis stroke={gridColor} tick={{ fill: isDark ? '#6b7280' : '#9ca3af' }} />
              <Radar dataKey={chartDataKey} stroke={chartColor} fill={chartColor} fillOpacity={0.25} strokeWidth={2} />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        );
      case 'area':
      default:
        return (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey={chartDataKey} stroke={chartColor} fillOpacity={1} fill="url(#chartGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/dashboard-stats/', {
          headers: {
            'Authorization': `Bearer ${authToken.access}`
          }
        });

        const data = response.data;

        setKpiData([
          {
            id: 1,
            title: "Total Revenue",
            value: `$${data.kpi.total_revenue.toLocaleString()}`,
            change: "+12.5%",
            isPositive: true,
            icon: DollarSign,
            color: "from-green-500 to-emerald-600",
          },
          {
            id: 2,
            title: "Total Orders",
            value: data.kpi.total_orders.toLocaleString(),
            change: "+8.2%",
            isPositive: true,
            icon: ShoppingCart,
            color: "from-blue-500 to-cyan-600",
          },
          {
            id: 3,
            title: "Products Sold",
            value: data.kpi.products_sold.toLocaleString(),
            change: "-3.1%",
            isPositive: false,
            icon: Package,
            color: "from-purple-500 to-pink-600",
          },
          {
            id: 4,
            title: "Active Users",
            value: data.kpi.active_users.toLocaleString(),
            change: "+15.3%",
            isPositive: true,
            icon: Users,
            color: "from-orange-500 to-red-600",
          },
        ]);

        setSalesData(data.sales_data);
        setInventoryData(data.inventory_data || []);
        setRecentProducts(data.recent_products);
        setRecentOrders(data.recent_orders);
        setLoading(false);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data. Please try again.");
        setLoading(false);
      }
    };

    if (authToken) {
      fetchData();
    }
  }, [authToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: 'var(--text-primary)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--text-primary)' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-400 gap-4">
        <AlertCircle className="w-12 h-12" />
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#1e2875] text-white rounded-lg hover:bg-[#2a3690]"
        >
          Retry
        </button>
      </div>
    );
  }

  const chartTypeLabel = {
    area: 'Area Chart', bar: 'Bar Chart', line: 'Line Chart', pie: 'Pie Chart', radar: 'Radar Chart',
  }[chartType] || 'Area Chart';

  const getImageUrl = (img) => {
    if (!img) return 'https://placehold.co/400x400/1a2332/666?text=No+Image';
    if (typeof img === 'string' && img.startsWith('http')) return img;
    if (typeof img === 'string' && img.startsWith('/')) return `http://localhost:8000${img}`;
    return img;
  };

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
              className="rounded-xl p-5 sm:p-6 border hover:scale-105 transform duration-200"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
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
              <h3 className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{kpi.title}</h3>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{kpi.value}</p>
            </div>
          );
        })}
      </div>

      {/* Single Configurable Chart */}
      <div className="rounded-lg p-4 sm:p-6 border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>{chartTitle}</h3>
            <p className="text-sm" style={{ color: 'var(--text-dim)' }}>{chartTypeLabel}</p>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2 px-3 py-1.5 border rounded-lg transition-colors text-sm"
            style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
          >
            <Settings className="w-4 h-4" />
            Customize
          </button>
        </div>
        {renderChart()}
      </div>

      {/* Recent Products Section */}
      <div className="rounded-lg p-4 sm:p-6 border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg sm:text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Products</h3>
          <button
            onClick={() => navigate('/products')}
            className="px-4 py-2 bg-[#1e2875] hover:bg-[#2a3690] text-white text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
          >
            View All Products
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {recentProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-lg overflow-hidden border hover:border-[#1e2875] transition-all hover:shadow-lg hover:shadow-[#1e2875]/20"
              style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}
            >
              <div className="aspect-square overflow-hidden" style={{ backgroundColor: isDark ? '#1f2937' : '#e5e7eb' }}>
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm sm:text-base line-clamp-1" style={{ color: 'var(--text-primary)' }}>{product.name}</h4>
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                    {product.status}
                  </span>
                </div>
                <p className="text-xs sm:text-sm mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>${product.unit_price}</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                          }`}
                      />
                    ))}
                    <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>({product.reviews})</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-lg p-4 sm:p-6 border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg sm:text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Orders</h3>
          <button
            onClick={() => navigate('/orders')}
            className="px-4 py-2 bg-[#1e2875] hover:bg-[#2a3690] text-white text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
          >
            View All Orders
          </button>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="w-full">
              <thead>
                <tr style={{ borderColor: 'var(--border-color)' }} className="border-b">
                  <th className="text-left text-xs sm:text-sm font-medium pb-3 px-4 sm:px-0" style={{ color: 'var(--text-muted)' }}>Order ID</th>
                  <th className="text-left text-xs sm:text-sm font-medium pb-3 px-2 sm:px-0" style={{ color: 'var(--text-muted)' }}>Customer</th>
                  <th className="text-left text-xs sm:text-sm font-medium pb-3 px-2 sm:px-0 hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>Date</th>
                  <th className="text-left text-xs sm:text-sm font-medium pb-3 px-2 sm:px-0" style={{ color: 'var(--text-muted)' }}>Amount</th>
                  <th className="text-left text-xs sm:text-sm font-medium pb-3 px-2 sm:px-0" style={{ color: 'var(--text-muted)' }}>Status</th>
                  <th className="text-left text-xs sm:text-sm font-medium pb-3 px-4 sm:px-0 hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b transition-colors"
                    style={{ borderColor: isDark ? '#1f2937' : '#f3f4f6' }}
                  >
                    <td className="py-3 sm:py-4 text-xs sm:text-sm px-4 sm:px-0" style={{ color: 'var(--text-primary)' }}>{order.id}</td>
                    <td className="py-3 sm:py-4 px-2 sm:px-0">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white">
                          {order.customer_name ? order.customer_name.charAt(0) : 'U'}
                        </div>
                        <span className="text-xs sm:text-sm hidden sm:inline" style={{ color: 'var(--text-primary)' }}>{order.customer_name}</span>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 text-xs sm:text-sm px-2 sm:px-0 hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>
                      {new Date(order.order_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 sm:py-4 text-xs sm:text-sm font-medium px-2 sm:px-0" style={{ color: 'var(--text-primary)' }}>${order.total_amount}</td>
                    <td className="py-3 sm:py-4 px-2 sm:px-0">
                      <span
                        className={`text-white text-xs px-2 sm:px-3 py-1 rounded-full whitespace-nowrap 
                            ${order.status === 'delivered' ? 'bg-green-500' :
                            order.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-0 hidden lg:table-cell">
                      <button
                        className="text-xs sm:text-sm transition-colors"
                        style={{ color: 'var(--text-muted)' }}
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
