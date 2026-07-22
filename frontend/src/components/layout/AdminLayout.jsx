import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { LayoutDashboard, FileText, MessageSquare, LogOut, Shield, Home, Menu, X, BookOpen, Sparkles, Video, Hash } from 'lucide-react';
import AdminNotificationBell from './AdminNotificationBell.jsx';

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
      name: 'Bài học AI',
      path: '/admin/lessons',
      icon: BookOpen
    },
    {
      name: 'Bảng chữ cái',
      path: '/admin/alphabet',
      icon: Sparkles
    },
    {
      name: 'Video bài giảng',
      path: '/admin/videos',
      icon: Video
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
    <div className="h-screen bg-[#F4F6F8] font-sans flex text-left relative overflow-hidden">
      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-brand-dark text-white flex flex-col z-50 transform transition-transform duration-300 lg:hidden shadow-2xl ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${isActive
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${isActive
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


      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
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

          <div className="flex items-center gap-2 lg:gap-3">
            {/* Admin information */}
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-amber-800">
              <Shield className="h-3.5 w-3.5" />
              Super Admin
            </span>

            <AdminNotificationBell />

            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-green text-xs font-black text-white shadow-sm ring-2 ring-brand-green/10">
              AD
            </div>

            {/* Divider */}
            <div className="mx-1 hidden h-7 w-px bg-gray-200 sm:block" />

            {/* Main actions */}
            <div className="flex items-center gap-2">
              {/* Home */}
              <Link
                to="/"
                title="Về trang chủ"
                className="
        group inline-flex h-9 items-center justify-center gap-2
        rounded-xl bg-brand-green px-3.5
        text-xs font-black text-white
        shadow-[0_6px_16px_rgba(34,130,76,0.22)]
        transition-all duration-200
        hover:-translate-y-0.5 hover:bg-brand-dark
        hover:shadow-[0_9px_22px_rgba(34,130,76,0.3)]
        focus:outline-none focus:ring-2 focus:ring-brand-green/30
        active:translate-y-0
        sm:px-4
      "
              >
                <Home className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />

                <span className="hidden sm:inline">
                  Trang chủ
                </span>
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                title="Đăng xuất"
                className="
        group inline-flex h-9 items-center justify-center gap-2
        rounded-xl border border-red-200 bg-red-50 px-3.5
        text-xs font-black text-red-600
        shadow-sm transition-all duration-200
        hover:-translate-y-0.5 hover:border-red-500
        hover:bg-red-600 hover:text-white
        hover:shadow-[0_9px_22px_rgba(220,38,38,0.22)]
        focus:outline-none focus:ring-2 focus:ring-red-200
        active:translate-y-0
        sm:px-4
      "
              >
                <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />

                <span className="hidden sm:inline">
                  Đăng xuất
                </span>
              </button>
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
