/**
 * Products.jsx — Universal page for Products / Courses / Departments
 * 
 * This page is CONFIG-DRIVEN — it reads the current category from CategoryContext
 * and dynamically changes:
 *   - API endpoint to fetch from
 *   - Table columns / card fields
 *   - Add modal form fields
 *   - Search/filter logic
 * 
 * E-Commerce → Products | Education → Courses | Healthcare → Departments
 * 
 * CRUD: Add (modal) and Delete (trash icon) are supported for all categories.
 */
import React, { useState, useMemo, useContext, useEffect } from "react";
import { Search, Grid, List, Package, BookOpen, Building2, Plus, Trash2, X } from "lucide-react";
import AuthContext from '../context/AuthContext';
import { useCategory } from '../context/CategoryContext';
import axios from 'axios';
import API_URL from '../config/api';

// ============================================================
// CONFIG — All category-specific settings in one place
// Each category has: title, API endpoint, columns, card fields, and form fields
// ============================================================
const CATEGORY_CONFIG = {
  ecommerce: {
    title: 'Products', endpoint: '/api/products/', searchPlaceholder: 'Search products...', filterField: 'category', icon: Package,
    columns: [
      { key: 'name', label: 'Product' }, { key: 'category', label: 'Category' },
      { key: 'unit_price', label: 'Price', format: v => `₹${parseFloat(v).toFixed(2)}` },
      { key: 'current_stock', label: 'Stock' }, { key: 'status', label: 'Status' },
    ],
    cardFields: { title: 'name', subtitle: 'category', badge: 'status', metric: 'unit_price', metricPrefix: '₹', sub1: 'sku', sub1Label: 'SKU' },
    addFields: [
      { key: 'id', label: 'Product ID', placeholder: 'PRD-008', required: true },
      { key: 'name', label: 'Name', placeholder: 'Product name', required: true },
      { key: 'category', label: 'Category', placeholder: 'Electronics' },
      { key: 'unit_price', label: 'Price', placeholder: '99.99', type: 'number' },
      { key: 'current_stock', label: 'Stock', placeholder: '100', type: 'number' },
      { key: 'sku', label: 'SKU', placeholder: 'SKU-001' },
      { key: 'description', label: 'Description', placeholder: 'Product description', isTextarea: true },
    ],
  },
  education: {
    title: 'Courses', endpoint: '/api/courses/', searchPlaceholder: 'Search courses...', filterField: 'category', icon: BookOpen,
    columns: [
      { key: 'name', label: 'Course Name' }, { key: 'instructor', label: 'Instructor' },
      { key: 'category', label: 'Category' }, { key: 'duration_hours', label: 'Duration', format: v => `${v}h` },
      { key: 'price', label: 'Price', format: v => `₹${parseFloat(v).toFixed(2)}` }, { key: 'status', label: 'Status' },
    ],
    cardFields: { title: 'name', subtitle: 'instructor', badge: 'status', metric: 'price', metricPrefix: '₹', sub1: 'category', sub1Label: 'Category' },
    addFields: [
      { key: 'id', label: 'Course ID', placeholder: 'CRS-006', required: true },
      { key: 'name', label: 'Course Name', placeholder: 'React Advanced', required: true },
      { key: 'instructor', label: 'Instructor', placeholder: 'Dr. Jane Doe' },
      { key: 'category', label: 'Category', placeholder: 'Programming' },
      { key: 'duration_hours', label: 'Duration (hours)', placeholder: '80', type: 'number' },
      { key: 'price', label: 'Price', placeholder: '299.99', type: 'number' },
      { key: 'description', label: 'Description', placeholder: 'Course description', isTextarea: true },
    ],
  },
  healthcare: {
    title: 'Departments', endpoint: '/api/departments/', searchPlaceholder: 'Search departments...', filterField: 'name', icon: Building2,
    columns: [
      { key: 'name', label: 'Department' }, { key: 'head_doctor', label: 'Head Doctor' },
      { key: 'beds_total', label: 'Total Beds' }, { key: 'beds_occupied', label: 'Occupied' },
      { key: '_occupancy', label: 'Occupancy', format: (_, row) => `${row.beds_total > 0 ? Math.round(row.beds_occupied / row.beds_total * 100) : 0}%` },
    ],
    cardFields: { title: 'name', subtitle: 'head_doctor', badge: null, metric: 'beds_total', metricPrefix: '', sub1: 'beds_occupied', sub1Label: 'Beds Used' },
    addFields: [
      { key: 'id', label: 'Department ID', placeholder: 'DEPT-006', required: true },
      { key: 'name', label: 'Department Name', placeholder: 'Dermatology', required: true },
      { key: 'head_doctor', label: 'Head Doctor', placeholder: 'Dr. Smith' },
      { key: 'beds_total', label: 'Total Beds', placeholder: '20', type: 'number' },
      { key: 'beds_occupied', label: 'Beds Occupied', placeholder: '0', type: 'number' },
    ],
  }
};

// Maps status strings to Tailwind color classes
const statusColor = (s) => ({
  'in-stock': 'bg-green-500/20 text-green-400', 'active': 'bg-green-500/20 text-green-400',
  'low-stock': 'bg-yellow-500/20 text-yellow-400', 'out-of-stock': 'bg-red-500/20 text-red-400',
  'draft': 'bg-gray-500/20 text-gray-400', 'archived': 'bg-red-500/20 text-red-400',
}[s] || 'bg-blue-500/20 text-blue-400');


const Products = () => {
  const { authToken } = useContext(AuthContext);
  const { category } = useCategory();
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.ecommerce;
  const Icon = config.icon;

  // State
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filterValue, setFilterValue] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({});

  // Fetch data when auth token or category changes
  useEffect(() => { fetchData(); }, [authToken, category]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}${config.endpoint}`, {
        headers: { Authorization: `Bearer ${authToken.access}` }
      });
      setItems(res.data);
    } catch (err) { console.error("Error:", err); }
    finally { setLoading(false); }
  };

  // CREATE — POST to API
  const handleAdd = async () => {
    try {
      await axios.post(`${API_URL}${config.endpoint}`, formData, {
        headers: { Authorization: `Bearer ${authToken.access}`, 'Content-Type': 'application/json' }
      });
      setShowAddModal(false);
      setFormData({});
      fetchData(); // Refresh the list
    } catch (err) { console.error("Add error:", err); alert("Failed to add. Check all required fields."); }
  };

  // DELETE — DELETE from API
  const handleDelete = async (id) => {
    if (!window.confirm(`Delete ${id}?`)) return;
    try {
      await axios.delete(`${API_URL}${config.endpoint}${id}/`, {
        headers: { Authorization: `Bearer ${authToken.access}` }
      });
      fetchData();
    } catch (err) { console.error("Delete error:", err); }
  };

  // Build filter dropdown options from unique values
  const filterOptions = useMemo(() => ["All", ...new Set(items.map(i => i[config.filterField]).filter(Boolean))], [items, config.filterField]);

  // Apply search + filter
  const filtered = useMemo(() => {
    return items.filter(item => {
      const matchSearch = Object.values(item).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase()));
      const matchFilter = filterValue === "All" || item[config.filterField] === filterValue;
      return matchSearch && matchFilter;
    });
  }, [items, searchTerm, filterValue, config.filterField]);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: 'var(--border-color)', borderTopColor: '#3b82f6' }}></div>
        <p className="text-lg animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading {config.title.toLowerCase()}...</p>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="space-y-6">
      {/* Page Header + Search + Filters + Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{config.title}</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{filtered.length} total</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-dim)' }} />
            <input type="text" placeholder={config.searchPlaceholder} value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border text-sm w-56"
              style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
          </div>
          {/* Filter Dropdown */}
          <select value={filterValue} onChange={e => setFilterValue(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm"
            style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
            {filterOptions.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          {/* Grid/List Toggle */}
          <div className="flex items-center border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
            <button onClick={() => setViewMode('grid')} className="p-2" style={{ backgroundColor: viewMode === 'grid' ? 'var(--bg-tertiary)' : 'transparent', color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-dim)' }}><Grid className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('list')} className="p-2" style={{ backgroundColor: viewMode === 'list' ? 'var(--bg-tertiary)' : 'transparent', color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-dim)' }}><List className="w-4 h-4" /></button>
          </div>
          {/* Add Button — hidden for e-commerce (handled in Inventory page) */}
          {category !== 'ecommerce' && (
            <button onClick={() => { setFormData({}); setShowAddModal(true); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:opacity-90">
              <Plus className="w-4 h-4" /> Add
            </button>
          )}
        </div>
      </div>

      {/* GRID VIEW — Card layout */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(item => {
            const cf = config.cardFields;
            return (
              <div key={item.id} className="rounded-xl border p-4 hover:scale-[1.02] transition-transform duration-200 group relative"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                {/* Delete (shows on hover) */}
                <button onClick={() => handleDelete(item.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/20 hover:bg-red-500/30 text-red-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <Icon className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  </div>
                  {cf.badge && item[cf.badge] && <span className={`text-xs px-2 py-1 rounded-full ${statusColor(item[cf.badge])}`}>{item[cf.badge]}</span>}
                </div>
                <h3 className="font-semibold text-sm mb-1 truncate" style={{ color: 'var(--text-primary)' }}>{item[cf.title]}</h3>
                <p className="text-xs mb-3 truncate" style={{ color: 'var(--text-muted)' }}>{item[cf.subtitle]}</p>
                <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    {cf.metricPrefix}{typeof item[cf.metric] === 'number' ? item[cf.metric].toLocaleString() : item[cf.metric]}
                  </span>
                  {cf.sub1 && <span className="text-xs" style={{ color: 'var(--text-dim)' }}>{cf.sub1Label}: {item[cf.sub1]}</span>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                  {config.columns.map(col => (
                    <th key={col.key} className="text-left text-xs font-semibold px-4 py-3" style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-tertiary)' }}>{col.label}</th>
                  ))}
                  <th className="text-right text-xs font-semibold px-4 py-3" style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-tertiary)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.id} className="border-b transition-colors" style={{ borderColor: 'var(--border-color)' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    {config.columns.map(col => (
                      <td key={col.key} className="px-4 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>
                        {col.key === 'status' ? <span className={`text-xs px-2 py-1 rounded-full ${statusColor(item[col.key])}`}>{item[col.key]}</span>
                          : col.format ? col.format(item[col.key], item) : item[col.key]}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Icon className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-dim)' }} />
          <p style={{ color: 'var(--text-muted)' }}>No {config.title.toLowerCase()} found</p>
        </div>
      )}

      {/* ADD MODAL — Form fields come from config.addFields */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-xl border shadow-2xl" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
              <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Add {config.title.replace(/s$/, '')}</h3>
                <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} /></button>
              </div>
              <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {config.addFields.map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{field.label} {field.required && <span className="text-red-400">*</span>}</label>
                    {field.isTextarea ? (
                      <textarea rows={3} placeholder={field.placeholder}
                        value={formData[field.key] || ''} onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
                        style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                    ) : (
                      <input type={field.type || 'text'} placeholder={field.placeholder}
                        value={formData[field.key] || ''} onChange={e => setFormData({ ...formData, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border text-sm"
                        style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                    )}
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ borderColor: 'var(--border-color)' }}>
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>Cancel</button>
                <button onClick={handleAdd} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:opacity-90">
                  Add {config.title.replace(/s$/, '')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;