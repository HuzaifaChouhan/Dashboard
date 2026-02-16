import React from "react";
import { Home, Package, ShoppingCart, Users, Archive, Settings, X, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../context/AuthContext"; // Assuming default export is AuthContext, but let's check import.
// Actually AuthContext default export is context, not hook. 
// I should import useContext and AuthContext.

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
        w-64 bg-[#1e2875] text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      <div className="p-4 border-b border-[#2a3690]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#0a0e1a] rounded-lg flex items-center justify-center shrink-0">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div className="overflow-hidden">
              <h1 className="text-lg font-semibold truncate">ProductVision</h1>
              <p className="text-xs text-gray-300">ADMIN DASHBOARD</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-[#2a3690] p-1 rounded shrink-0"
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
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${active
                  ? "bg-[#2a3690] border-l-4 border-white"
                  : "hover:bg-[#2a3690]/50 border-l-4 border-transparent"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#2a3690]">
        {/* Footer content if needed */}
      </div>
    </div>
  );
};

export default Sidebar;
