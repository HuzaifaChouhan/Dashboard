import React from "react";
import { Home, Package, ShoppingCart, Users, Archive, Settings, X, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "/", label: "Dashboard", icon: Home },
    { id: "/products", label: "Products", icon: Package },
    { id: "/orders", label: "Orders", icon: ShoppingCart },
    { id: "/customers", label: "Customers", icon: Users },
    { id: "/inventory", label: "Inventory", icon: Archive },
    { id: "/settings", label: "Settings", icon: Settings },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div
      className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      style={{ backgroundColor: '#1e2875', color: '#ffffff' }}
    >
      <div className="p-4" style={{ borderBottom: '1px solid #2a3690' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#0a0e1a' }}>
              <Home className="w-5 h-5" style={{ color: '#ffffff' }} />
            </div>
            <div className="overflow-hidden">
              <h1 className="text-lg font-semibold truncate" style={{ color: '#ffffff' }}>ProductVision</h1>
              <p className="text-xs" style={{ color: '#d1d5db' }}>ADMIN DASHBOARD</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded"
            style={{ color: '#ffffff' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.id);
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="w-full flex items-center gap-3 px-6 py-3 transition-colors"
              style={{
                backgroundColor: active ? '#2a3690' : 'transparent',
                borderLeft: active ? '4px solid #ffffff' : '4px solid transparent',
                color: '#ffffff',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'rgba(42,54,144,0.5)'; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <Icon className="w-5 h-5" style={{ color: '#ffffff' }} />
              <span className="text-sm font-medium" style={{ color: '#ffffff' }}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4" style={{ borderTop: '1px solid #2a3690' }}>
        {/* Footer content if needed */}
      </div>
    </div>
  );
};

export default Sidebar;
