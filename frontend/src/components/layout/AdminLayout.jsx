import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { LayoutDashboard, FileText, MessageSquare, LogOut, Shield, Home, Menu, X } from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    {
      name: 'Tổng quan',
      path: '/admin',
      icon: LayoutDashboard
    },
    {
      name: 'Form tư vấn',
      path: '/admin/forms',
      icon: FileText
    },
    {
      name: 'Hỗ trợ Chat',
      path: '/admin/chat',
      icon: MessageSquare
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F8] font-sans flex text-left relative overflow-x-hidden">
      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity" 
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-brand-dark text-white flex flex-col z-50 transform transition-transform duration-300 lg:hidden shadow-2xl ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Branding */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white/15 w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="text-lg">🦉</span>
            </div>
            <div>
              <span className="font-black text-[18px] tracking-tight block">Readizen</span>
              <span className="text-[10px] text-brand-yellow font-bold uppercase tracking-wider block">Admin Panel</span>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="text-white hover:text-brand-yellow transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-grow p-4 space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  isActive
                    ? 'bg-brand-green text-white shadow-md'
                    : 'text-brand-light/75 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-brand-light/75 hover:bg-white/5 hover:text-white transition"
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            <span>Trang chủ chính</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition text-left cursor-pointer"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Desktop Sidebar (lg Screen and Up) */}
      <aside className="hidden lg:flex w-64 bg-brand-dark text-white flex-col flex-shrink-0 shadow-lg">
        {/* Branding */}
        <div className="p-6 border-b border-white/10 flex items-center gap-2">
          <div className="bg-white/15 w-8 h-8 rounded-lg flex items-center justify-center">
            <span className="text-lg">🦉</span>
          </div>
          <div>
            <span className="font-black text-[18px] tracking-tight block">Readizen</span>
            <span className="text-[10px] text-brand-yellow font-bold uppercase tracking-wider block">Admin Panel</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-grow p-4 space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  isActive
                    ? 'bg-brand-green text-white shadow-md'
                    : 'text-brand-light/75 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-brand-light/75 hover:bg-white/5 hover:text-white transition"
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            <span>Trang chủ chính</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition text-left cursor-pointer"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 lg:px-8 flex items-center justify-between shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>

            <h1 className="text-sm lg:text-lg font-bold text-gray-800 truncate max-w-[180px] sm:max-w-none">
              Chào mừng quay trở lại, {user?.fullName || user?.username || 'Admin'}!
            </h1>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            {/* Admin Badge */}
            <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-800 text-[10px] lg:text-[11px] font-bold px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-md border border-yellow-200">
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SUPER ADMIN</span>
            </span>

            {/* Avatar & Profile */}
            <div className="w-8 h-8 rounded-full bg-brand-green text-white font-bold flex items-center justify-center text-xs shadow-sm flex-shrink-0">
              AD
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-grow p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
