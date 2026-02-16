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
    <header className="bg-[#111827] border-b border-gray-700 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-white hover:bg-gray-700 p-2 rounded-lg"
            data-testid="mobile-menu-btn"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Dashboard Overview <span className="text-gray-400 text-xs sm:text-sm hidden sm:inline">(Admin)</span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden sm:flex text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-lg transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="relative text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-400 hover:bg-gray-700 p-2 rounded-lg transition-colors flex items-center gap-2"
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