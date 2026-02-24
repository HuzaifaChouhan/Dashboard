/**
 * Header.jsx — Top navigation bar
 * 
 * Features:
 * 1. Category selector dropdown (E-Commerce / Education / Healthcare)
 * 2. Role badge (Super Admin / Manager / Viewer) — fetched from API
 * 3. Notification bell with panel — notifications come from dashboard-stats API
 * 4. Logout button
 */
import React, { useContext, useState, useEffect } from 'react';
import { Menu, Bell, LogOut, ShoppingCart, GraduationCap, Heart, ChevronDown, X, Check, AlertTriangle, Info, AlertCircle } from "lucide-react";
import AuthContext from "../context/AuthContext";
import { useCategory } from "../context/CategoryContext";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';

// Category definitions with icon and color
const CATEGORIES = [
  { id: 'ecommerce', label: 'E-Commerce', icon: ShoppingCart, color: '#3b82f6' },
  { id: 'education', label: 'Education', icon: GraduationCap, color: '#8b5cf6' },
  { id: 'healthcare', label: 'Healthcare', icon: Heart, color: '#ef4444' },
];

const Header = ({ setSidebarOpen }) => {
  const { authToken, logoutUser } = useContext(AuthContext);
  const { category, setCategory } = useCategory();
  const navigate = useNavigate();

  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userRole, setUserRole] = useState('');

  // Find current category config
  const currentCat = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];
  const CatIcon = currentCat.icon;

  // Fetch user role on mount
  useEffect(() => {
    if (!authToken) return;
    axios.get(`${API_URL}/api/user-profile/`, {
      headers: { Authorization: `Bearer ${authToken.access}` }
    }).then(res => setUserRole(res.data.role)).catch(() => { });
  }, [authToken]);

  // Fetch notifications whenever category changes
  useEffect(() => {
    if (!authToken) return;
    axios.get(`${API_URL}/api/dashboard-stats/?category=${category}`, {
      headers: { Authorization: `Bearer ${authToken.access}` }
    }).then(res => setNotifications(res.data.notifications || [])).catch(() => { });
  }, [authToken, category]);

  const handleLogout = () => { logoutUser(); navigate('/login'); };

  // Role display config
  const roleLabel = { super_admin: 'Super Admin', manager: 'Manager', viewer: 'Viewer' }[userRole] || '';
  const roleBadgeColor = { super_admin: 'bg-red-500/20 text-red-400', manager: 'bg-blue-500/20 text-blue-400', viewer: 'bg-gray-500/20 text-gray-400' }[userRole] || '';

  // Notification icon based on type
  const notifIcon = (type) => ({
    success: <Check className="w-4 h-4 text-green-400" />,
    warning: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
    error: <AlertCircle className="w-4 h-4 text-red-400" />,
  }[type] || <Info className="w-4 h-4 text-blue-400" />);

  return (
    <header style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }} className="border-b px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg" style={{ color: 'var(--text-primary)' }}>
            <Menu className="w-6 h-6" />
          </button>

          {/* Category Selector Dropdown */}
          <div className="relative">
            <button onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all"
              style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
              <CatIcon className="w-5 h-5" style={{ color: currentCat.color }} />
              <span className="font-semibold text-sm hidden sm:inline">{currentCat.label}</span>
              <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </button>

            {showCategoryMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowCategoryMenu(false)} />
                <div className="absolute top-full left-0 mt-2 w-52 rounded-xl border shadow-xl z-50 overflow-hidden"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                  {CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    const isActive = category === cat.id;
                    return (
                      <button key={cat.id}
                        onClick={() => { setCategory(cat.id); setShowCategoryMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 transition-colors"
                        style={{ backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent', color: 'var(--text-primary)' }}>
                        <Icon className="w-5 h-5" style={{ color: cat.color }} />
                        <span className="text-sm font-medium">{cat.label}</span>
                        {isActive && <Check className="w-4 h-4 ml-auto text-blue-400" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Role Badge */}
          {roleLabel && (
            <span className={`hidden md:inline-flex text-xs px-2.5 py-1 rounded-full font-medium ${roleBadgeColor}`}>
              {roleLabel}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-lg" style={{ color: 'var(--text-muted)' }}>
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notification Panel */}
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute top-full right-0 mt-2 w-80 rounded-xl border shadow-xl z-50 overflow-hidden"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                  <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Notifications</h3>
                    <button onClick={() => setShowNotifications(false)}><X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /></button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((n, i) => (
                      <div key={i} className="px-4 py-3 border-b flex items-start gap-3" style={{ borderColor: 'var(--border-color)' }}>
                        <div className="mt-0.5">{notifIcon(n.type)}</div>
                        <div>
                          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{n.message}</p>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{n.time}</p>
                        </div>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <p className="px-4 py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No notifications</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Logout */}
          <button onClick={handleLogout} className="p-2 rounded-lg flex items-center gap-2" style={{ color: 'var(--text-muted)' }} title="Logout">
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Logout</span>
          </button>

          {/* User Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">AD</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;