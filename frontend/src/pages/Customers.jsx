import React, { useState, useMemo, useContext, useEffect } from "react";
import { Search, Users, GraduationCap, Heart, Mail, Phone, Plus, Trash2, X } from "lucide-react";
import AuthContext from '../context/AuthContext';
import { useCategory } from '../context/CategoryContext';
import axios from 'axios';
import API_URL from '../config/api';

const CATEGORY_CONFIG = {
  ecommerce: {
    title: 'Customers', endpoint: '/api/customers/', searchPlaceholder: 'Search customers...', icon: Users,
    filterField: 'status', filterOptions: ['All', 'active', 'inactive', 'banned'],
    cardDetail1: { key: 'email', icon: Mail }, cardDetail2: { key: 'phone', icon: Phone },
    cardBadge: { key: 'loyalty_tier' },
    addFields: [
      { key: 'id', label: 'Customer ID', placeholder: 'CUST-005', required: true },
      { key: 'name', label: 'Full Name', placeholder: 'John Doe', required: true },
      { key: 'email', label: 'Email', placeholder: 'john@email.com', type: 'email', required: true },
      { key: 'phone', label: 'Phone', placeholder: '+1 555-1234' },
      { key: 'address', label: 'Address', placeholder: '123 Main St', isTextarea: true },
      { key: 'loyalty_tier', label: 'Loyalty Tier', placeholder: 'Bronze', options: ['Bronze', 'Silver', 'Gold'] },
    ],
  },
  education: {
    title: 'Students', endpoint: '/api/students/', searchPlaceholder: 'Search students...', icon: GraduationCap,
    filterField: 'status', filterOptions: ['All', 'active', 'inactive', 'graduated'],
    cardDetail1: { key: 'email', icon: Mail }, cardDetail2: { key: 'phone', icon: Phone },
    cardBadge: null,
    addFields: [
      { key: 'id', label: 'Student ID', placeholder: 'STU-009', required: true },
      { key: 'name', label: 'Full Name', placeholder: 'Alice Brown', required: true },
      { key: 'email', label: 'Email', placeholder: 'alice@university.edu', type: 'email', required: true },
      { key: 'phone', label: 'Phone', placeholder: '+1 555-1234' },
    ],
  },
  healthcare: {
    title: 'Patients', endpoint: '/api/patients/', searchPlaceholder: 'Search patients...', icon: Heart,
    filterField: 'status', filterOptions: ['All', 'active', 'discharged', 'critical'],
    cardDetail1: { key: 'condition', icon: Heart }, cardDetail2: { key: 'blood_group', icon: null },
    cardBadge: { key: 'status' },
    addFields: [
      { key: 'id', label: 'Patient ID', placeholder: 'PAT-008', required: true },
      { key: 'name', label: 'Full Name', placeholder: 'Maria Garcia', required: true },
      { key: 'email', label: 'Email', placeholder: 'maria@email.com', type: 'email' },
      { key: 'phone', label: 'Phone', placeholder: '+1 555-1001' },
      { key: 'age', label: 'Age', placeholder: '45', type: 'number' },
      { key: 'gender', label: 'Gender', options: ['male', 'female', 'other'] },
      { key: 'blood_group', label: 'Blood Group', placeholder: 'A+' },
      { key: 'condition', label: 'Condition', placeholder: 'Diagnosis / Condition' },
    ],
  }
};

const statusColor = (s) => {
  const map = {
    'active': 'bg-green-500/20 text-green-400', 'graduated': 'bg-blue-500/20 text-blue-400',
    'inactive': 'bg-gray-500/20 text-gray-400', 'banned': 'bg-red-500/20 text-red-400',
    'discharged': 'bg-blue-500/20 text-blue-400', 'critical': 'bg-red-500/20 text-red-400',
    'Gold': 'bg-yellow-500/20 text-yellow-400', 'Silver': 'bg-gray-400/20 text-gray-300', 'Bronze': 'bg-orange-500/20 text-orange-400',
  };
  return map[s] || 'bg-purple-500/20 text-purple-400';
};

const Customers = () => {
  const { authToken } = useContext(AuthContext);
  const { category } = useCategory();
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.ecommerce;
  const Icon = config.icon;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => { fetchData(); }, [authToken, category]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}${config.endpoint}`, {
        headers: { Authorization: `Bearer ${authToken.access}` }
      });
      setItems(response.data);
    } catch (err) { console.error("Error:", err); }
    finally { setLoading(false); }
  };

  const handleAdd = async () => {
    try {
      await axios.post(`${API_URL}${config.endpoint}`, formData, {
        headers: { Authorization: `Bearer ${authToken.access}`, 'Content-Type': 'application/json' }
      });
      setShowAddModal(false);
      setFormData({});
      fetchData();
    } catch (err) { console.error("Add error:", err); alert("Failed to add. Check all required fields."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete ${id}?`)) return;
    try {
      await axios.delete(`${API_URL}${config.endpoint}${id}/`, {
        headers: { Authorization: `Bearer ${authToken.access}` }
      });
      fetchData();
    } catch (err) { console.error("Delete error:", err); }
  };

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
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{filtered.length} total {config.title.toLowerCase()}</p>
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
          <button onClick={() => { setFormData({}); setShowAddModal(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => {
          const initials = item.name ? item.name.split(' ').map(n => n[0]).join('').slice(0, 2) : '?';
          return (
            <div key={item.id} className="rounded-xl border p-5 hover:scale-[1.02] transition-transform duration-200 group relative"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
              <button onClick={() => handleDelete(item.id)}
                className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/20 hover:bg-red-500/30 text-red-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</h3>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{item.id}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize shrink-0 ${statusColor(config.cardBadge ? item[config.cardBadge.key] : item.status)}`}>
                  {config.cardBadge ? item[config.cardBadge.key] : item.status}
                </span>
              </div>
              <div className="space-y-2">
                {config.cardDetail1 && item[config.cardDetail1.key] && (
                  <div className="flex items-center gap-2">
                    {config.cardDetail1.icon && <config.cardDetail1.icon className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-dim)' }} />}
                    <span className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{item[config.cardDetail1.key]}</span>
                  </div>
                )}
                {config.cardDetail2 && item[config.cardDetail2.key] && (
                  <div className="flex items-center gap-2">
                    {config.cardDetail2.icon && <config.cardDetail2.icon className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-dim)' }} />}
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item[config.cardDetail2.key]}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Icon className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-dim)' }} />
          <p style={{ color: 'var(--text-muted)' }}>No {config.title.toLowerCase()} found</p>
        </div>
      )}

      {/* Add Modal */}
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
                    {field.options ? (
                      <select value={formData[field.key] || ''} onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border text-sm"
                        style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                        <option value="">Select...</option>
                        {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : field.isTextarea ? (
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
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg border text-sm"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>Cancel</button>
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

export default Customers;