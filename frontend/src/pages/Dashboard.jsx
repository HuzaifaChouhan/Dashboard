/**
 * Dashboard.jsx — Main analytics dashboard
 * 
 * Fetches data from /api/dashboard-stats/?category= and renders:
 * 1. KPI cards (4 per category with icons, values, and trends)
 * 2. Chart (Area/Bar/Line/Pie/Radar — type saved in localStorage via Settings)
 * 3. Recent items table (Orders / Enrollments / Appointments)
 * 
 * Everything adapts dynamically to the selected category.
 */
import React, { useState, useEffect, useContext } from "react";
import {
  Star, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users,
  AlertCircle, Settings, GraduationCap, Award, BookOpen, Heart, Calendar,
  BedDouble, Activity, Download, Crown
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import AuthContext from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCategory } from '../context/CategoryContext';
import axios from 'axios';
import API_URL from '../config/api';
import { useNavigate } from 'react-router-dom';

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

// Maps icon NAME strings from the API response to actual Lucide icon components
const ICON_MAP = {
  DollarSign, ShoppingCart, Package, Users, GraduationCap, Award, BookOpen,
  Heart, Calendar, BedDouble: BedDouble, AlertTriangle: AlertCircle, Bed: BedDouble,
  Activity
};

const Dashboard = () => {
  const { authToken } = useContext(AuthContext);
  const { theme } = useTheme();
  const { category } = useCategory();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashData, setDashData] = useState(null);
  const [chartData, setChartData] = useState([]);

  // Chart preferences
  const chartType = localStorage.getItem('dashboard_chart_type') || 'pie';
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const axisColor = isDark ? '#9ca3af' : '#6b7280';
  const tooltipStyle = {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
    borderRadius: '8px',
    color: isDark ? '#fff' : '#111827'
  };

  // Category-specific colors
  const categoryColor = {
    ecommerce: '#3b82f6',
    education: '#8b5cf6',
    healthcare: '#ef4444'
  }[category] || '#3b82f6';

  // Fetch dashboard data  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/dashboard-stats/?category=${category}`, {
          headers: { 'Authorization': `Bearer ${authToken.access}` }
        });
        setDashData(response.data);
        setChartData(response.data.chart_data || []);
        setLoading(false);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data.");
        setLoading(false);
      }
    };
    if (authToken) fetchData();
  }, [authToken, category]);



  // Export CSV
  const handleExportCSV = () => {
    if (!dashData) return;
    const rows = [['Metric', 'Value']];
    dashData.kpi.forEach(k => rows.push([k.title, `${k.prefix || ''}${k.value}${k.suffix || ''}`]));
    rows.push([]);
    rows.push(['Month', dashData.chart_labels?.value || 'Value', dashData.chart_labels?.secondary || 'Secondary']);
    chartData.forEach(d => rows.push([d.name, d.value, d.secondary || '']));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard_${category}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderChart = () => {
    if (chartData.length === 0) {
      return <div className="flex items-center justify-center h-[350px]" style={{ color: 'var(--text-muted)' }}><p>No chart data available.</p></div>;
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
              <Legend formatter={v => <span style={{ color: isDark ? '#d1d5db' : '#374151' }}>{v}</span>} />
              <Bar dataKey="value" name={dashData?.chart_labels?.value || 'Primary'} fill={categoryColor} radius={[8, 8, 0, 0]} />
              <Bar dataKey="secondary" name={dashData?.chart_labels?.secondary || 'Secondary'} fill={`${categoryColor}88`} radius={[8, 8, 0, 0]} />
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
              <Legend formatter={v => <span style={{ color: isDark ? '#d1d5db' : '#374151' }}>{v}</span>} />
              <Line type="monotone" dataKey="value" name={dashData?.chart_labels?.value || 'Primary'} stroke={categoryColor} strokeWidth={3} dot={{ fill: categoryColor, r: 5 }} />
              <Line type="monotone" dataKey="secondary" name={dashData?.chart_labels?.secondary || 'Secondary'} stroke={`${categoryColor}88`} strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={130} innerRadius={60} paddingAngle={4}
                label={({ name, value }) => `${name}: ${value}`} labelLine={{ stroke: axisColor }}>
                {chartData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend formatter={v => <span style={{ color: isDark ? '#d1d5db' : '#374151' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart cx="50%" cy="50%" outerRadius={120} data={chartData}>
              <PolarGrid stroke={gridColor} />
              <PolarAngleAxis dataKey="name" stroke={axisColor} tick={{ fill: axisColor, fontSize: 12 }} />
              <PolarRadiusAxis stroke={gridColor} />
              <Radar dataKey="value" name={dashData?.chart_labels?.value || 'Primary'} stroke={categoryColor} fill={categoryColor} fillOpacity={0.25} strokeWidth={2} />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={categoryColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={categoryColor} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="chartGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={categoryColor} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={categoryColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend formatter={v => <span style={{ color: isDark ? '#d1d5db' : '#374151' }}>{v}</span>} />
              <Area type="monotone" dataKey="value" name={dashData?.chart_labels?.value || 'Primary'} stroke={categoryColor} fillOpacity={1} fill="url(#chartGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="secondary" name={dashData?.chart_labels?.secondary || 'Secondary'} stroke={`${categoryColor}88`} fillOpacity={1} fill="url(#chartGrad2)" strokeWidth={1} />
            </AreaChart>
          </ResponsiveContainer>
        );
    }
  };

  // Render recent items table based on category
  const renderRecentItems = () => {
    if (!dashData?.recent_items?.length) return null;

    if (category === 'ecommerce') {
      return (
        <table className="w-full">
          <thead>
            <tr style={{ borderColor: 'var(--border-color)' }} className="border-b">
              <th className="text-left text-xs font-medium pb-3 px-2" style={{ color: 'var(--text-muted)' }}>Order ID</th>
              <th className="text-left text-xs font-medium pb-3 px-2" style={{ color: 'var(--text-muted)' }}>Customer</th>
              <th className="text-left text-xs font-medium pb-3 px-2 hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>Date</th>
              <th className="text-left text-xs font-medium pb-3 px-2" style={{ color: 'var(--text-muted)' }}>Amount</th>
              <th className="text-left text-xs font-medium pb-3 px-2" style={{ color: 'var(--text-muted)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {dashData.recent_items.map(item => (
              <tr key={item.id} className="border-b" style={{ borderColor: isDark ? '#1f2937' : '#f3f4f6' }}>
                <td className="py-3 px-2 text-sm" style={{ color: 'var(--text-primary)' }}>{item.id}</td>
                <td className="py-3 px-2 text-sm" style={{ color: 'var(--text-primary)' }}>{item.customer_name}</td>
                <td className="py-3 px-2 text-sm hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>{new Date(item.order_date).toLocaleDateString()}</td>
                <td className="py-3 px-2 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>₹{item.total_amount}</td>
                <td className="py-3 px-2"><span className={`text-xs px-2 py-1 rounded-full ${item.status === 'delivered' ? 'bg-green-500/20 text-green-500' : item.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'}`}>{item.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (category === 'education') {
      return (
        <table className="w-full">
          <thead>
            <tr style={{ borderColor: 'var(--border-color)' }} className="border-b">
              <th className="text-left text-xs font-medium pb-3 px-2" style={{ color: 'var(--text-muted)' }}>Student</th>
              <th className="text-left text-xs font-medium pb-3 px-2" style={{ color: 'var(--text-muted)' }}>Course</th>
              <th className="text-left text-xs font-medium pb-3 px-2" style={{ color: 'var(--text-muted)' }}>Progress</th>
              <th className="text-left text-xs font-medium pb-3 px-2" style={{ color: 'var(--text-muted)' }}>Status</th>
              <th className="text-left text-xs font-medium pb-3 px-2 hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>Grade</th>
            </tr>
          </thead>
          <tbody>
            {dashData.recent_items.map(item => (
              <tr key={item.id} className="border-b" style={{ borderColor: isDark ? '#1f2937' : '#f3f4f6' }}>
                <td className="py-3 px-2 text-sm" style={{ color: 'var(--text-primary)' }}>{item.student_name}</td>
                <td className="py-3 px-2 text-sm" style={{ color: 'var(--text-primary)' }}>{item.course_name}</td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: isDark ? '#374151' : '#e5e7eb' }}>
                      <div className="h-2 rounded-full bg-purple-500" style={{ width: `${item.progress}%` }} />
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.progress}%</span>
                  </div>
                </td>
                <td className="py-3 px-2"><span className={`text-xs px-2 py-1 rounded-full ${item.status === 'completed' ? 'bg-green-500/20 text-green-500' : item.status === 'dropped' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>{item.status}</span></td>
                <td className="py-3 px-2 text-sm font-medium hidden md:table-cell" style={{ color: 'var(--text-primary)' }}>{item.grade || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // Healthcare
    return (
      <table className="w-full">
        <thead>
          <tr style={{ borderColor: 'var(--border-color)' }} className="border-b">
            <th className="text-left text-xs font-medium pb-3 px-2" style={{ color: 'var(--text-muted)' }}>Patient</th>
            <th className="text-left text-xs font-medium pb-3 px-2" style={{ color: 'var(--text-muted)' }}>Doctor</th>
            <th className="text-left text-xs font-medium pb-3 px-2 hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>Department</th>
            <th className="text-left text-xs font-medium pb-3 px-2" style={{ color: 'var(--text-muted)' }}>Date</th>
            <th className="text-left text-xs font-medium pb-3 px-2" style={{ color: 'var(--text-muted)' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {dashData.recent_items.map(item => (
            <tr key={item.id} className="border-b" style={{ borderColor: isDark ? '#1f2937' : '#f3f4f6' }}>
              <td className="py-3 px-2 text-sm" style={{ color: 'var(--text-primary)' }}>{item.patient_name}</td>
              <td className="py-3 px-2 text-sm" style={{ color: 'var(--text-primary)' }}>{item.doctor}</td>
              <td className="py-3 px-2 text-sm hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>{item.department_name}</td>
              <td className="py-3 px-2 text-sm" style={{ color: 'var(--text-muted)' }}>{new Date(item.appointment_date).toLocaleDateString()}</td>
              <td className="py-3 px-2"><span className={`text-xs px-2 py-1 rounded-full ${item.status === 'completed' ? 'bg-green-500/20 text-green-500' : item.status === 'cancelled' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>{item.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const recentItemsTitle = {
    ecommerce: 'Recent Orders',
    education: 'Recent Enrollments',
    healthcare: 'Recent Appointments'
  }[category];

  const chartTypeLabel = { area: 'Area Chart', bar: 'Bar Chart', line: 'Line Chart', pie: 'Pie Chart', radar: 'Radar Chart' }[chartType] || 'Area Chart';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: `${categoryColor}33`, borderTopColor: categoryColor }}></div>
        </div>
        <p className="text-lg font-medium animate-pulse" style={{ color: 'var(--text-muted)' }}>
          Loading dashboard data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>Something went wrong</p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {dashData?.kpi?.map((kpi, i) => {
          const Icon = ICON_MAP[kpi.icon] || Package;
          const TrendIcon = kpi.isPositive ? TrendingUp : TrendingDown;
          const displayValue = `${kpi.prefix || ''}${typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}${kpi.suffix || ''}`;
          return (
            <div key={i} className="rounded-xl p-5 sm:p-6 border hover:scale-105 transform duration-200"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
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
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{displayValue}</p>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="rounded-lg p-4 sm:p-6 border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              {dashData?.chart_labels?.value || 'Analytics'} Overview
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-dim)' }}>{chartTypeLabel} • Monthly Data</p>
          </div>
          <div className="flex items-center gap-2">

            <button onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)', backgroundColor: 'var(--bg-tertiary)' }}>
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
            <button onClick={() => navigate('/settings')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)', backgroundColor: 'var(--bg-tertiary)' }}>
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {renderChart()}
      </div>

      {/* Top Customers — E-commerce only */}
      {category === 'ecommerce' && dashData?.top_customers?.length > 0 && (
        <div className="rounded-lg p-4 sm:p-6 border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Top Customers</h3>
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Ranked by total spend</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {dashData.top_customers.map((customer, index) => {
              const tierColors = {
                Gold: 'from-yellow-500 to-amber-500',
                Silver: 'from-gray-400 to-gray-500',
                Bronze: 'from-orange-700 to-orange-800',
              };
              const tierBg = {
                Gold: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30',
                Silver: 'bg-gray-400/15 text-gray-400 border-gray-400/30',
                Bronze: 'bg-orange-700/15 text-orange-600 border-orange-600/30',
              };
              const rankBadge = index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white'
                : index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800'
                  : index === 2 ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white'
                    : 'bg-gray-500/20 text-gray-400';

              return (
                <div key={customer.id} className="rounded-xl p-4 border transition-all hover:scale-[1.02] hover:shadow-lg"
                  style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${rankBadge}`}>
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{customer.name}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-dim)' }}>{customer.email}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tierBg[customer.loyalty_tier] || tierBg.Bronze}`}>
                      {customer.loyalty_tier}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Spent</span>
                      <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>₹{customer.total_spent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Orders</span>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{customer.order_count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Items Table */}
      <div className="rounded-lg p-4 sm:p-6 border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <h3 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          {recentItemsTitle}
        </h3>
        <div className="overflow-x-auto">
          {renderRecentItems()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
