/**
 * Orders.jsx — Universal page for Orders / Enrollments / Appointments
 * 
 * CONFIG-DRIVEN — changes API endpoint, columns, and filters based on category.
 * E-Commerce → Orders | Education → Enrollments | Healthcare → Appointments
 * 
 * Features: search, status filter, sortable table with status badges and progress bars.
 */
import React, { useState, useMemo, useContext, useEffect } from "react";
import { Search, ShoppingCart, ClipboardList, Calendar } from "lucide-react";
import AuthContext from '../context/AuthContext';
import { useCategory } from '../context/CategoryContext';
import axios from 'axios';
import API_URL from '../config/api';

// Config for each category's order-like page
const CATEGORY_CONFIG = {
  ecommerce: {
    title: 'Orders', endpoint: '/api/orders/', searchPlaceholder: 'Search orders...', icon: ShoppingCart,
    filterField: 'status', filterOptions: ['All', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    columns: [
      { key: 'id', label: 'Order ID' },
      { key: 'customer_name', label: 'Customer' },
      { key: 'order_date', label: 'Date', format: v => new Date(v).toLocaleDateString() },
      { key: 'total_amount', label: 'Amount', format: v => `$${parseFloat(v).toFixed(2)}` },
      { key: 'payment_status', label: 'Payment' },
      { key: 'status', label: 'Status' },
    ]
  },
  education: {
    title: 'Enrollments', endpoint: '/api/enrollments/', searchPlaceholder: 'Search enrollments...', icon: ClipboardList,
    filterField: 'status', filterOptions: ['All', 'active', 'completed', 'dropped'],
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'student_name', label: 'Student' },
      { key: 'course_name', label: 'Course' },
      { key: 'progress', label: 'Progress', isProgress: true },  // Rendered as progress bar
      { key: 'grade', label: 'Grade', format: v => v || '—' },
      { key: 'status', label: 'Status' },
    ]
  },
  healthcare: {
    title: 'Appointments', endpoint: '/api/appointments/', searchPlaceholder: 'Search appointments...', icon: Calendar,
    filterField: 'status', filterOptions: ['All', 'scheduled', 'completed', 'cancelled', 'no-show'],
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'patient_name', label: 'Patient' },
      { key: 'doctor', label: 'Doctor' },
      { key: 'department_name', label: 'Department' },
      { key: 'appointment_date', label: 'Date', format: v => new Date(v).toLocaleString() },
      { key: 'status', label: 'Status' },
    ]
  }
};

// Map status values to Tailwind color classes
const statusColor = (s) => ({
  'delivered': 'bg-green-500/20 text-green-400', 'completed': 'bg-green-500/20 text-green-400',
  'shipped': 'bg-blue-500/20 text-blue-400', 'active': 'bg-blue-500/20 text-blue-400', 'scheduled': 'bg-blue-500/20 text-blue-400',
  'processing': 'bg-cyan-500/20 text-cyan-400', 'pending': 'bg-yellow-500/20 text-yellow-400',
  'cancelled': 'bg-red-500/20 text-red-400', 'dropped': 'bg-red-500/20 text-red-400', 'no-show': 'bg-red-500/20 text-red-400',
  'paid': 'bg-green-500/20 text-green-400', 'refunded': 'bg-orange-500/20 text-orange-400',
}[s] || 'bg-gray-500/20 text-gray-400');


const Orders = () => {
  const { authToken } = useContext(AuthContext);
  const { category } = useCategory();
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.ecommerce;
  const Icon = config.icon;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("All");

  // Fetch data when category changes
  useEffect(() => {
    if (!authToken) return;
    setLoading(true);
    axios.get(`${API_URL}${config.endpoint}`, {
      headers: { Authorization: `Bearer ${authToken.access}` }
    }).then(res => setItems(res.data))
      .catch(err => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, [authToken, category]);

  // Apply search + filter
  const filtered = useMemo(() => {
    return items.filter(item => {
      const matchSearch = Object.values(item).some(v => typeof v === 'string' && v.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchFilter = filterValue === "All" || item[config.filterField] === filterValue;
      return matchSearch && matchFilter;
    });
  }, [items, searchTerm, filterValue, config.filterField]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: 'var(--border-color)', borderTopColor: '#3b82f6' }}></div>
        <p className="text-lg animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading {config.title.toLowerCase()}...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{config.title}</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{filtered.length} total</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-dim)' }} />
            <input type="text" placeholder={config.searchPlaceholder} value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border text-sm w-56"
              style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
          </div>
          <select value={filterValue} onChange={e => setFilterValue(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm capitalize"
            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
            {config.filterOptions.map(f => <option key={f} value={f} className="capitalize">{f}</option>)}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                {config.columns.map(col => (
                  <th key={col.key} className="text-left text-xs font-semibold px-4 py-3" style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-tertiary)' }}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} className="border-b transition-colors" style={{ borderColor: 'var(--border-color)' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  {config.columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>
                      {/* Status badge */}
                      {(col.key === 'status' || col.key === 'payment_status') ? (
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColor(item[col.key])}`}>{item[col.key]}</span>
                      ) : col.isProgress ? (
                        /* Progress bar (for enrollment progress) */
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <div className="h-2 rounded-full bg-purple-500 transition-all" style={{ width: `${item[col.key]}%` }} />
                          </div>
                          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{item[col.key]}%</span>
                        </div>
                      ) : col.format ? col.format(item[col.key]) : (item[col.key] || '—')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Icon className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-dim)' }} />
          <p style={{ color: 'var(--text-muted)' }}>No {config.title.toLowerCase()} found</p>
        </div>
      )}
    </div>
  );
};

export default Orders;