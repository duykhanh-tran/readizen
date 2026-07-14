import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/axios.js';
import { User, FileText, Clock, MessageSquare, ChevronRight, BookOpen, Sparkles, Bookmark } from 'lucide-react';

import ProfileTab from '../components/profile/ProfileTab.jsx';
import ConsultTab from '../components/profile/ConsultTab.jsx';
import HistoryTab from '../components/profile/HistoryTab.jsx';
import ReadingTab from '../components/profile/ReadingTab.jsx';
import SmartAbcTab from '../components/profile/SmartAbcTab.jsx';
import BookmarksTab from '../components/profile/BookmarksTab.jsx';

export default function Profile() {
  const { user, updatePassword, updateAvatar } = useAuth();
  
  // Tab State: 'profile', 'reading', 'smartabc', 'bookmarks', 'consult', 'history'
  const [activeTab, setActiveTab] = useState('profile');

  // Form History State
  const [myForms, setMyForms] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Fetch Form History
  const fetchHistory = async () => {
    try {
      const response = await api.get('/forms/my');
      setMyForms(response.data);
    } catch (err) {
      console.error('Lỗi lấy lịch sử form:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const menuItems = [
    { id: 'profile', label: 'Thông tin cá nhân', icon: User },
    { id: 'reading', label: 'Luyện đọc AI', icon: BookOpen },
    { id: 'smartabc', label: 'Lịch sử SmartABC', icon: Sparkles },
    { id: 'bookmarks', label: 'Bài học đã lưu', icon: Bookmark },
    { id: 'consult', label: 'Đăng ký tư vấn', icon: FileText },
    { id: 'history', label: 'Lịch sử yêu cầu', icon: Clock },
    { id: 'chat', label: 'Hỗ trợ trực tuyến', icon: MessageSquare, isAction: true },
  ];

  const handleMenuClick = (item) => {
    if (item.isAction) {
      if (item.id === 'chat') {
        window.dispatchEvent(new CustomEvent('toggle-floating-chat'));
      }
    } else {
      setActiveTab(item.id);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(68,166,92,0.06),transparent_35%),linear-gradient(180deg,#FFFDF3_0%,#FBFBFA_100%)] flex flex-col font-sans pt-16 lg:pt-[72px]">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full text-left">
        {/* Profile Title Banner */}
        <div className="mb-10 bg-gradient-to-r from-emerald-500/10 via-brand-green/5 to-transparent p-6 sm:p-8 rounded-[2rem] border border-brand-green/10 flex flex-col sm:flex-row items-center gap-6 justify-between shadow-sm relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1 bg-brand-green/10 text-brand-green font-extrabold text-[10px] px-3 py-1 rounded-full border border-brand-green/20 uppercase tracking-widest">
              Trang cá nhân của bé & ba mẹ
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">Chào, {user?.fullName || 'ba mẹ'}!</h1>
            <p className="text-gray-500 text-xs sm:text-sm font-semibold max-w-xl">
              Cùng bé quản lý quá trình luyện phát âm AI, theo dõi bài học SmartABC và lưu giữ những học liệu bổ ích nhất.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm relative z-10">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-brand-cream border-2 border-brand-green/20 flex items-center justify-center shadow-md">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-black text-brand-green">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="font-extrabold text-gray-800 text-xs">{user?.fullName}</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">{user?.email}</p>
            </div>
          </div>

          {/* Background Decorative Circles */}
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-brand-green/5 rounded-full blur-xl"></div>
        </div>

        {/* Tabbed Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar (3 cols) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[2rem] border border-gray-150 shadow-sm overflow-hidden p-3.5 space-y-1.5 sticky top-24">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-3 mb-2 block">Menu Quản lý</p>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id && !item.isAction;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition duration-200 text-xs font-extrabold cursor-pointer group ${
                      isActive 
                        ? 'bg-brand-green text-white shadow-md'
                        : 'text-gray-600 hover:text-brand-green hover:bg-brand-light/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-brand-green'}`} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 opacity-40 group-hover:opacity-100 ${isActive ? 'translate-x-0.5 transition text-white opacity-85' : 'transition group-hover:translate-x-0.5'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tab Panel Content (9 cols) */}
          <div className="lg:col-span-9 bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-150 shadow-sm min-h-[480px]">
            
            {/* Panel 1: Profile Settings (Avatar & Password) */}
            {activeTab === 'profile' && (
              <ProfileTab 
                user={user} 
                updateAvatar={updateAvatar} 
                updatePassword={updatePassword} 
              />
            )}

            {/* Panel: Reading lessons and scores */}
            {activeTab === 'reading' && (
              <ReadingTab />
            )}

            {/* Panel: SmartABC attempt history timeline */}
            {activeTab === 'smartabc' && (
              <SmartAbcTab />
            )}

            {/* Panel: Bookmarked items */}
            {activeTab === 'bookmarks' && (
              <BookmarksTab />
            )}

            {/* Panel: Submit consultation request form */}
            {activeTab === 'consult' && (
              <ConsultTab onSuccess={fetchHistory} />
            )}

            {/* Panel: Request History log */}
            {activeTab === 'history' && (
              <HistoryTab 
                myForms={myForms} 
                isLoadingHistory={isLoadingHistory} 
              />
            )}

          </div>

        </div>
      </main>
    </div>
  );
}
