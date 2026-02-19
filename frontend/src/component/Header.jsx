import React, { useContext } from 'react';
import { Menu, Bell, Search, LogOut } from "lucide-react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const Header = ({ setSidebarOpen }) => {
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <header style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }} className="border-b px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg"
            style={{ color: 'var(--text-primary)' }}
            data-testid="mobile-menu-btn"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-lg sm:text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Dashboard Overview <span className="text-xs sm:text-sm hidden sm:inline" style={{ color: 'var(--text-muted)' }}>(Admin)</span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden sm:flex p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}>
            <Search className="w-5 h-5" />
          </button>
          <button className="relative p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}>
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button
            onClick={handleLogout}
            className="hover:text-red-400 p-2 rounded-lg transition-colors flex items-center gap-2"
            style={{ color: 'var(--text-muted)' }}
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Logout</span>
          </button>

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
            <span className="text-white text-sm font-semibold">AD</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;