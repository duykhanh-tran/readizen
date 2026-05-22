import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api, { getAccessToken } from '../services/axios.js';
import { useSocket } from '../context/SocketContext.jsx';
import { Shield, Lock, FileText, AlertCircle, CheckCircle2, User, Key, Send, Clock, MessageSquare, X, ChevronRight } from 'lucide-react';

export default function Profile() {
  const { user, updatePassword, updateAvatar } = useAuth();
  const { socket } = useSocket();
  
  // Tab State: 'profile', 'consult', 'history', 'chat'
  const [activeTab, setActiveTab] = useState('profile');

  // Avatar State
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [avatarError, setAvatarError] = useState('');
  const [avatarSuccess, setAvatarSuccess] = useState('');
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  // Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  // Submit Form State
  const [phone, setPhone] = useState('');
  const [courseInterest, setCourseInterest] = useState('Readizen Set 1');
  const [currentLevel, setCurrentLevel] = useState('Chưa biết tiếng Anh');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

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

  // Update Avatar Handler
  const handleUpdateAvatar = async (e) => {
    e.preventDefault();
    setAvatarError('');
    setAvatarSuccess('');
    setIsUpdatingAvatar(true);

    if (!avatarUrl.trim()) {
      setAvatarError('Vui lòng nhập đường dẫn ảnh hợp lệ.');
      setIsUpdatingAvatar(false);
      return;
    }

    try {
      await updateAvatar(avatarUrl);
      setAvatarSuccess('Cập nhật ảnh đại diện thành công!');
    } catch (err) {
      setAvatarError(err.message || 'Cập nhật ảnh đại diện thất bại.');
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  // Update Password Handler
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');
    setIsUpdatingPass(true);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPassError('Vui lòng nhập đầy đủ các trường mật khẩu.');
      setIsUpdatingPass(false);
      return;
    }

    if (newPassword.length < 6) {
      setPassError('Mật khẩu mới phải chứa ít nhất 6 ký tự.');
      setIsUpdatingPass(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('Mật khẩu mới nhập lại không khớp.');
      setIsUpdatingPass(false);
      return;
    }

    try {
      await updatePassword(oldPassword, newPassword);
      setPassSuccess('Đổi mật khẩu thành công!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPassError(err.message || 'Thay đổi mật khẩu thất bại. Mật khẩu cũ không chính xác.');
    } finally {
      setIsUpdatingPass(false);
    }
  };

  // Submit Consultation Form Handler
  const handleSendForm = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setIsSubmittingForm(true);

    if (!phone) {
      setFormError('Vui lòng nhập số điện thoại.');
      setIsSubmittingForm(false);
      return;
    }

    try {
      await api.post('/forms/submit', {
        phone,
        courseInterest,
        currentLevel,
        message
      });
      setFormSuccess('Gửi yêu cầu tư vấn thành công! Chúng tôi sẽ liên hệ lại sớm nhất.');
      setPhone('');
      setMessage('');
      fetchHistory(); // Refresh history
    } catch (err) {
      setFormError(err.response?.data?.message || 'Gửi form thất bại.');
    } finally {
      setIsSubmittingForm(false);
    }
  };

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

  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    contacted: 'bg-blue-50 text-blue-800 border-blue-200',
    canceled: 'bg-red-50 text-red-800 border-red-200',
  };

  const statusLabels = {
    pending: 'Chờ liên hệ',
    contacted: 'Đang tư vấn',
    canceled: 'Đã hủy',
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Avatar Update */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="font-black text-gray-800 text-[15px] mb-4 flex items-center gap-2">
                    <User className="w-4.5 h-4.5 text-brand-green" />
                    <span>Ảnh đại diện</span>
                  </h3>
                  <form onSubmit={handleUpdateAvatar} className="space-y-4">
                    {avatarError && (
                      <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span>{avatarError}</span>
                      </div>
                    )}
                    {avatarSuccess && (
                      <div className="bg-green-50 text-green-700 text-xs p-3 rounded-xl border border-green-200 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{avatarSuccess}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                        Đường dẫn ảnh cá nhân (URL)
                      </label>
                      <input
                        type="text"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-brand-green focus:ring-2 focus:ring-brand-light focus:outline-none text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isUpdatingAvatar}
                      className="w-full bg-brand-green hover:bg-brand-dark text-white font-bold py-2.5 px-4 rounded-xl transition duration-200 shadow-sm text-xs cursor-pointer disabled:opacity-50"
                    >
                      {isUpdatingAvatar ? 'Đang cập nhật...' : 'Cập nhật Avatar'}
                    </button>
                  </form>
                </div>

                {/* Password Change */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="font-black text-gray-800 text-[15px] mb-4 flex items-center gap-2">
                    <Key className="w-4.5 h-4.5 text-brand-green" />
                    <span>Mật khẩu & Bảo mật</span>
                  </h3>
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    {passError && (
                      <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span>{passError}</span>
                      </div>
                    )}
                    {passSuccess && (
                      <div className="bg-green-50 text-green-700 text-xs p-3 rounded-xl border border-green-200 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{passSuccess}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                        Mật khẩu hiện tại
                      </label>
                      <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-brand-green focus:ring-2 focus:ring-brand-light focus:outline-none text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-brand-green focus:ring-2 focus:ring-brand-light focus:outline-none text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                        Nhập lại mật khẩu mới
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-brand-green focus:ring-2 focus:ring-brand-light focus:outline-none text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isUpdatingPass}
                      className="w-full bg-brand-green hover:bg-brand-dark text-white font-bold py-2.5 px-4 rounded-xl transition duration-200 shadow-sm text-xs cursor-pointer disabled:opacity-50"
                    >
                      {isUpdatingPass ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Panel 2: Submit consultation request form */}
            {activeTab === 'consult' && (
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="font-black text-gray-800 text-[16px] mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-green" />
                  <span>Đăng ký tư vấn lộ trình học</span>
                </h3>
                <p className="text-gray-500 text-xs mb-6">
                  Ba mẹ nhập số điện thoại và thông tin trình độ hiện tại của bé để được các thầy cô chuyên môn gọi điện tư vấn.
                </p>

                <form onSubmit={handleSendForm} className="space-y-4">
                  {formError && (
                    <div className="bg-red-50 text-red-700 text-xs p-4 rounded-xl border border-red-200 flex items-start gap-2.5">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>{formError}</span>
                    </div>
                  )}
                  {formSuccess && (
                    <div className="bg-green-50 text-green-700 text-xs p-4 rounded-xl border border-green-200 flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{formSuccess}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Số điện thoại phụ huynh
                      </label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="09xx xxx xxx"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-brand-green focus:ring-2 focus:ring-brand-light focus:outline-none text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Khóa học quan tâm
                      </label>
                      <select
                        value={courseInterest}
                        onChange={(e) => setCourseInterest(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-brand-green focus:outline-none text-xs font-semibold text-gray-700 cursor-pointer bg-white"
                      >
                        <option value="Readizen Set 1">Readizen Set 1</option>
                        <option value="Readizen Set 2">Readizen Set 2</option>
                        <option value="Readizen Set 3">Readizen Set 3</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Trình độ hiện tại của bé
                    </label>
                    <select
                      value={currentLevel}
                      onChange={(e) => setCurrentLevel(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-brand-green focus:outline-none text-xs font-semibold text-gray-700 cursor-pointer bg-white"
                    >
                      <option value="Chưa biết tiếng Anh">Chưa biết tiếng Anh (Mới bắt đầu)</option>
                      <option value="Biết từ đơn lẻ">Biết một số từ vựng đơn giản</option>
                      <option value="Nói được câu ngắn">Đã nói được câu ngắn/đơn giản</option>
                      <option value="Nói trôi chảy">Nói lưu loát câu chuyện dài</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Lời nhắn / Mô tả chi tiết
                    </label>
                    <textarea
                      rows="3"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Mô tả cụ thể mong muốn của ba mẹ..."
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-brand-green focus:ring-2 focus:ring-brand-light focus:outline-none text-xs"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingForm}
                    className="bg-brand-green hover:bg-brand-dark text-white font-bold py-2.5 px-6 rounded-xl transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs ml-auto"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmittingForm ? 'Đang gửi...' : 'Gửi yêu cầu'}</span>
                  </button>
                </form>
              </div>
            )}

            {/* Panel 3: History log */}
            {activeTab === 'history' && (
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="font-black text-gray-800 text-[15px] mb-4 flex items-center gap-2">
                  <Clock className="w-4.5 h-4.5 text-brand-green" />
                  <span>Lịch sử đăng ký tư vấn</span>
                </h3>

                {isLoadingHistory ? (
                  <div className="py-12 text-center text-gray-400 text-xs">
                    <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <span>Đang lấy lịch sử...</span>
                  </div>
                ) : myForms.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {myForms.map((item) => (
                      <div key={item._id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="font-bold text-gray-800 text-sm">{item.courseInterest}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[item.status] || 'bg-gray-100 border-gray-200 text-gray-800'}`}>
                              {statusLabels[item.status] || item.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">SĐT: {item.phone} • Trình độ: {item.currentLevel}</p>
                          {item.message && <p className="text-xs text-gray-500 mt-2 bg-brand-cream/50 p-2.5 rounded-xl border border-gray-100">{item.message}</p>}
                        </div>
                        <div className="text-[10px] text-gray-400 shrink-0 font-mono">
                          {new Date(item.createdAt).toLocaleString('vi-VN')}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-25" />
                    <p className="text-xs font-semibold">Chưa có lịch sử yêu cầu tư vấn nào.</p>
                  </div>
                )}
              </div>
            )}

            {/* Panel 4: In-page Full-width Chat Console */}
            {activeTab === 'chat' && (
              <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[500px]">
                {/* Header */}
                <div className="bg-brand-green text-white px-5 py-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-black text-sm">Phòng Chat Hỗ Trợ Trực Tuyến</span>
                  </div>
                  <span className="text-[10px] bg-white/20 text-white font-bold py-1 px-3 rounded-full border border-white/10 uppercase">
                    Admin Active
                  </span>
                </div>

                {/* Message logs area */}
                <div className="flex-grow p-5 overflow-y-auto space-y-4 bg-[#FAF9F5]">
                  {chatMessages.length > 0 ? (
                    chatMessages.map((msg) => {
                      const isMe = msg.sender === 'user';
                      return (
                        <div key={msg._id || msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`flex gap-2 max-w-[75%] ${isMe ? 'flex-row-reverse' : ''}`}>
                            {/* Avatar indicator */}
                            {!isMe && (
                              <div className="w-8 h-8 rounded-full bg-brand-green text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                                AD
                              </div>
                            )}
                            <div className="space-y-1">
                              <div className={`rounded-2xl px-4 py-2.5 shadow-sm leading-relaxed text-xs ${
                                isMe 
                                  ? 'bg-brand-green text-white rounded-tr-none'
                                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                              }`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                              </div>
                              <span className={`text-[9px] block text-gray-400 font-mono ${isMe ? 'text-right' : 'text-left'}`}>
                                {new Date(msg.createdAt || Date.now()).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 py-20 text-xs">
                      <MessageSquare className="w-12 h-12 opacity-25 mb-3" />
                      <span>Hỏi chúng tôi bất kỳ điều gì về tài khoản hoặc sách học!</span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input messaging box */}
                <form onSubmit={handleSendChatMessage} className="p-4 border-t border-gray-100 bg-white flex items-center gap-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Nhập câu hỏi hoặc yêu cầu hỗ trợ của ba mẹ tại đây..."
                    className="flex-grow px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-brand-green focus:outline-none text-xs transition"
                  />
                  <button 
                    type="submit"
                    className="bg-brand-green hover:bg-brand-dark text-white p-3 rounded-xl transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}
