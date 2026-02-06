import React from "react";
import { Home, Package, ShoppingCart, Users, Archive, Settings, X } from "lucide-react";

const Sidebar = ({ currentPage, setCurrentPage, sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "customers", label: "Customers", icon: Users },
    { id: "inventory", label: "Inventory", icon: Archive },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleNavClick = (id) => {
    setCurrentPage(id);
    setSidebarOpen(false);
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
      {/* Changed p-6 to p-4 to give the text more room */}
      <div className="p-4 border-b border-[#2a3690]">
        <div className="flex items-center justify-between">
          {/* Changed gap-3 to gap-2 to fit tighter */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#0a0e1a] rounded-lg flex items-center justify-center shrink-0">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div className="overflow-hidden">
              {/* Added truncate so text doesn't overflow */}
              <h1 className="text-lg font-semibold truncate">ProductVision</h1>
              <p className="text-xs text-gray-300">DEMO</p>
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

      <nav className="flex-1 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              data-testid={`nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive
                  ? "bg-[#2a3690] border-l-4 border-white"
                  : "hover:bg-[#2a3690]/50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;