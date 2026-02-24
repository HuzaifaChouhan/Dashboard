/**
 * Sidebar.jsx — Dynamic navigation sidebar
 * 
 * Changes menu items based on the selected category:
 * - E-Commerce: Dashboard, Products, Orders, Customers, Inventory, Settings
 * - Education:  Dashboard, Courses, Students, Enrollments, Settings
 * - Healthcare: Dashboard, Patients, Appointments, Departments, Settings
 * 
 * The accent color (blue/purple/red) also changes per category.
 */
import React from "react";
import {
  Home, Package, ShoppingCart, Users, Archive, Settings, X,
  GraduationCap, BookOpen, ClipboardList,
  Heart, Calendar, Building2,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCategory } from "../context/CategoryContext";

// Menu items for each category — 'id' is the route path
const CATEGORY_MENUS = {
  ecommerce: {
    label: 'E-Commerce', color: '#3b82f6',
    items: [
      { id: "/", label: "Dashboard", icon: Home },
      { id: "/products", label: "Products", icon: Package },
      { id: "/orders", label: "Orders", icon: ShoppingCart },
      { id: "/customers", label: "Customers", icon: Users },
      { id: "/inventory", label: "Inventory", icon: Archive },
      { id: "/settings", label: "Settings", icon: Settings },
    ]
  },
  education: {
    label: 'Education', color: '#8b5cf6',
    items: [
      { id: "/", label: "Dashboard", icon: Home },
      { id: "/products", label: "Courses", icon: BookOpen },
      { id: "/customers", label: "Students", icon: GraduationCap },
      { id: "/orders", label: "Enrollments", icon: ClipboardList },
      { id: "/settings", label: "Settings", icon: Settings },
    ]
  },
  healthcare: {
    label: 'Healthcare', color: '#ef4444',
    items: [
      { id: "/", label: "Dashboard", icon: Home },
      { id: "/customers", label: "Patients", icon: Heart },
      { id: "/orders", label: "Appointments", icon: Calendar },
      { id: "/products", label: "Departments", icon: Building2 },
      { id: "/settings", label: "Settings", icon: Settings },
    ]
  }
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { category } = useCategory();

  const currentMenu = CATEGORY_MENUS[category] || CATEGORY_MENUS.ecommerce;
  const accent = currentMenu.color; // Accent color for active states

  // Check if a nav item is the current route
  const isActive = (path) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <div
      className={`fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      style={{ background: 'linear-gradient(180deg, #0f1629 0%, #1a1f3a 50%, #0f1629 100%)', color: '#fff' }}
    >
      {/* Logo / Brand */}
      <div className="p-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, boxShadow: `0 4px 15px ${accent}40` }}>
              <Home className="w-5 h-5" style={{ color: '#fff' }} />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight" style={{ color: '#fff' }}>ProductVision</h1>
              <p className="text-[10px] font-semibold tracking-widest" style={{ color: `${accent}cc` }}>
                {currentMenu.label.toUpperCase()} PANEL
              </p>
            </div>
          </div>
          {/* Close button (mobile only) */}
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg" style={{ color: '#94a3b8' }}>
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
        <p className="text-[10px] font-bold tracking-widest px-3 mb-2" style={{ color: '#475569' }}>NAVIGATION</p>
        {currentMenu.items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.id);
          return (
            <button key={item.id + item.label}
              onClick={() => { navigate(item.id); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative"
              style={{ backgroundColor: active ? `${accent}18` : 'transparent', color: active ? '#fff' : '#94a3b8' }}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#fff'; } }}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}
            >
              {/* Glowing active indicator bar */}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                  style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}80` }} />
              )}
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: active ? `${accent}25` : 'rgba(255,255,255,0.03)' }}>
                <Icon className="w-[18px] h-[18px]" style={{ color: active ? accent : 'inherit' }} />
              </div>
              <span className="text-sm font-medium">{item.label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accent}` }} />}
            </button>
          );
        })}
      </nav>

      {/* User Info (bottom) */}
      <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">AD</div>
          <div>
            <p className="text-sm font-medium" style={{ color: '#e2e8f0' }}>Admin</p>
            <p className="text-[11px]" style={{ color: '#64748b' }}>admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
