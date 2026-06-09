import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/axios.js';
import { useSocket } from '../context/SocketContext.jsx';
import { User, FileText, Clock, MessageSquare, ChevronRight } from 'lucide-react';

import ProfileTab from '../components/profile/ProfileTab.jsx';
import ConsultTab from '../components/profile/ConsultTab.jsx';
import HistoryTab from '../components/profile/HistoryTab.jsx';
import ChatConsole from '../components/profile/ChatConsole.jsx';

export default function Profile() {
  const { user, updatePassword, updateAvatar } = useAuth();
  const { socket } = useSocket();
  
  // Tab State: 'profile', 'consult', 'history', 'chat'
  const [activeTab, setActiveTab] = useState('profile');

  // Form History State
  const [myForms, setMyForms] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Chat State
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [unreadChat, setUnreadChat] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll for chat
  const scrollToChatBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToChatBottom();
      // Đánh dấu đã đọc khi chuyển sang tab Chat
      api.put('/chat/read').then(() => setUnreadChat(false)).catch(console.error);
    }
  }, [chatMessages, activeTab]);

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

  // Fetch Chat History
  const fetchChatHistory = async () => {
    try {
      const response = await api.get('/chat');
      setChatMessages(response.data);
    } catch (err) {
      console.error('Lỗi lấy lịch sử chat:', err);
    }
  };

  // Đăng ký bộ lắng nghe sự kiện Message từ Global Socket
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (newMessage) => {
      setChatMessages(prev => [...prev, newMessage]);
      if (activeTab !== 'chat') {
        setUnreadChat(true);
      } else {
        api.put('/chat/read').catch(console.error);
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    fetchChatHistory();

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, activeTab]);

  // Send Chat Message Handler
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !socket || !user) return;

    socket.emit('send_message', {
      userId: user.id || user._id,
      sender: 'user',
      text: chatInput
    });

    setChatInput('');
  };

  const menuItems = [
    { id: 'profile', label: 'Thông tin cá nhân', icon: User },
    { id: 'consult', label: 'Đăng ký tư vấn', icon: FileText },
    { id: 'history', label: 'Lịch sử yêu cầu', icon: Clock },
    { id: 'chat', label: 'Hỗ trợ trực tuyến', icon: MessageSquare, badge: unreadChat },
  ];

  return (
    <div className="min-h-screen bg-brand-cream/30 flex flex-col font-sans">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-10 w-full text-left">
        {/* Profile Title Banner */}
        <div className="mb-8">
          <span className="text-xs font-bold bg-brand-light text-brand-green px-3 py-1 rounded-full border border-brand-green/20 uppercase tracking-wider">
            Trang cá nhân
          </span>
          <h1 className="text-3xl font-black text-brand-dark mt-3">Chào, {user?.fullName}!</h1>
          <p className="text-gray-500 text-sm mt-1">Cập nhật hồ sơ tài khoản và quản lý thông tin tư vấn học tập.</p>
        </div>

        {/* Tabbed Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* User Mini Profile */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-brand-cream border-2 border-brand-green/20 flex items-center justify-center shadow-md mb-3">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-black text-brand-green">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <p className="font-bold text-gray-800 text-sm">{user?.fullName}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{user?.email}</p>
            </div>

            {/* Sidebar Tabs Menu */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-2 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (item.id === 'chat') {
                        setUnreadChat(false);
                      }
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition text-xs font-bold cursor-pointer ${
                      isActive 
                        ? 'bg-brand-green text-white shadow-sm'
                        : 'text-gray-600 hover:text-brand-green hover:bg-brand-light/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                      )}
                      <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive ? 'translate-x-0.5 transition' : ''}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tab Panel Content (9 cols) */}
          <div className="lg:col-span-9">
            
            {/* Panel 1: Profile Settings (Avatar & Password) */}
            {activeTab === 'profile' && (
              <ProfileTab 
                user={user} 
                updateAvatar={updateAvatar} 
                updatePassword={updatePassword} 
              />
            )}

            {/* Panel 2: Submit consultation request form */}
            {activeTab === 'consult' && (
              <ConsultTab onSuccess={fetchHistory} />
            )}

            {/* Panel 3: History log */}
            {activeTab === 'history' && (
              <HistoryTab 
                myForms={myForms} 
                isLoadingHistory={isLoadingHistory} 
              />
            )}

            {/* Panel 4: In-page Full-width Chat Console */}
            {activeTab === 'chat' && (
              <ChatConsole 
                chatMessages={chatMessages} 
                chatInput={chatInput} 
                setChatInput={setChatInput} 
                handleSendChatMessage={handleSendChatMessage} 
                chatEndRef={chatEndRef} 
              />
            )}

          </div>

        </div>
      </main>
    </div>
  );
}
