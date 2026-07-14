import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { MessageSquare, Send, X, User, Phone, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSocket } from '../../context/SocketContext.jsx';
import api from '../../services/axios.js';

export default function FloatingChat() {
  const { pathname } = useLocation();
  const { user: authUser, isAuthenticated } = useAuth();
  const { socket: globalSocket } = useSocket();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Guest State
  const [guestUser, setGuestUser] = useState(() => {
    const saved = localStorage.getItem('guest_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [guestToken, setGuestToken] = useState(() => {
    return localStorage.getItem('guest_token') || null;
  });
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isRegisteringGuest, setIsRegisteringGuest] = useState(false);
  const [guestError, setGuestError] = useState('');

  // Local socket instance for guest chat
  const [localSocket, setLocalSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // Determine active user context
  const activeUser = isAuthenticated ? authUser : guestUser;
  const tokenToUse = isAuthenticated ? null : guestToken; // null means let axios handle global token, otherwise we pass manually

  useEffect(() => {
    const handleToggleChatEvent = () => {
      setIsOpen(true);
    };
    window.addEventListener('toggle-floating-chat', handleToggleChatEvent);
    return () => {
      window.removeEventListener('toggle-floating-chat', handleToggleChatEvent);
    };
  }, []);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle local socket connection for guests
  useEffect(() => {
    // If authenticated, we rely on the globalSocket
    if (isAuthenticated) {
      if (localSocket) {
        localSocket.disconnect();
        setLocalSocket(null);
      }
      return;
    }

    // If guest is logged in with token, create a local socket
    if (guestToken && guestUser) {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      const socketInstance = io(socketUrl, {
        auth: { token: guestToken },
        transports: ['websocket', 'polling']
      });

      socketInstance.on('connect', () => {
        console.log('🟢 Guest socket connected:', socketInstance.id);
        socketInstance.emit('join_room', guestUser.id || guestUser._id);
      });

      socketInstance.on('receive_message', (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
        if (!isOpen) {
          setUnreadCount((c) => c + 1);
        }
      });

      setLocalSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
        console.log('🔴 Guest socket disconnected');
      };
    }
  }, [isAuthenticated, guestToken, guestUser]);

  // Listen to global socket messages for authenticated users
  useEffect(() => {
    if (!isAuthenticated || !globalSocket) return;

    const handleGlobalMessage = (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      if (!isOpen) {
        setUnreadCount((c) => c + 1);
      }
    };

    globalSocket.on('receive_message', handleGlobalMessage);

    return () => {
      globalSocket.off('receive_message', handleGlobalMessage);
    };
  }, [isAuthenticated, globalSocket, isOpen]);

  // Reset unread count when chat opens
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      if (activeUser) {
        // Mark messages as read in backend
        const config = tokenToUse ? { headers: { Authorization: `Bearer ${tokenToUse}` } } : {};
        api.put('/chat/read', {}, config).catch(console.error);
      }
    }
  }, [isOpen, activeUser, tokenToUse]);

  // Fetch chat history whenever active user becomes available or chat opens
  useEffect(() => {
    if (!activeUser || !isOpen) return;

    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const config = tokenToUse ? { headers: { Authorization: `Bearer ${tokenToUse}` } } : {};
        const response = await api.get('/chat', config);
        setMessages(response.data);
      } catch (error) {
        console.error('Lỗi khi tải lịch sử chat:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [activeUser, isOpen, tokenToUse]);

  // Handle Guest Registration Form Submit
  const handleStartGuestChat = async (e) => {
    e.preventDefault();
    if (!guestName.trim() || !guestPhone.trim()) {
      setGuestError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setGuestError('');
    setIsRegisteringGuest(true);

    try {
      const response = await api.post('/chat/guest', {
        fullName: guestName,
        phone: guestPhone
      });

      const { accessToken, user } = response.data;
      localStorage.setItem('guest_token', accessToken);
      localStorage.setItem('guest_user', JSON.stringify(user));

      setGuestToken(accessToken);
      setGuestUser(user);
    } catch (error) {
      console.error('Error starting guest chat:', error);
      setGuestError(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsRegisteringGuest(false);
    }
  };

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeUser) return;

    const msgData = {
      userId: activeUser.id || activeUser._id,
      sender: 'user',
      text: inputMessage.trim()
    };

    if (isAuthenticated && globalSocket) {
      globalSocket.emit('send_message', msgData);
    } else if (localSocket) {
      localSocket.emit('send_message', msgData);
    }

    setInputMessage('');
  };

  // Do not render floating chat bubble on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans text-left">
      {/* Floating Chat Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-brand-green to-emerald-500 text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative cursor-pointer group"
        aria-label="Trò chuyện hỗ trợ"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-300 transform rotate-0 hover:rotate-90" />
        ) : (
          <MessageSquare className="w-6 h-6 transition-transform duration-300 hover:scale-110" />
        )}

        {/* Pulse ripple rings around bubble */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce shadow-md">
            {unreadCount}
          </span>
        )}
        {!isOpen && unreadCount === 0 && (
          <span className="absolute inset-0 rounded-full bg-brand-green/30 animate-ping opacity-75"></span>
        )}
      </button>

      {/* Popover Chat Window Card */}
      {isOpen && (
        <div className="absolute bottom-18 right-0 w-[350px] md:w-[380px] h-[500px] bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 transform translate-y-0 opacity-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-green to-emerald-600 text-white px-5 py-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <h4 className="font-extrabold text-sm tracking-tight flex items-center gap-1">
                  Trò chuyện hỗ trợ <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                </h4>
                <p className="text-[10px] text-emerald-100 font-medium">Chúng tôi luôn online hỗ trợ ba mẹ</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-grow overflow-y-auto bg-[#FAF9F5] p-4 flex flex-col">
            {!activeUser ? (
              /* Guest registration form */
              <div className="my-auto px-4 py-6 bg-white rounded-2xl border border-gray-100 shadow-sm text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center mx-auto text-brand-green mb-1">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h5 className="font-bold text-gray-800 text-sm">Bắt đầu trò chuyện cùng Admin</h5>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Ba mẹ vui lòng để lại Tên và Số điện thoại để Readizen kết nối hỗ trợ tư vấn lộ trình học tập tốt nhất cho con.
                </p>

                <form onSubmit={handleStartGuestChat} className="space-y-3 pt-2 text-left">
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="Họ và tên ba mẹ..."
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:bg-white focus:border-brand-green focus:outline-none transition font-medium"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="Số điện thoại..."
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:bg-white focus:border-brand-green focus:outline-none transition font-medium"
                    />
                  </div>

                  {guestError && <p className="text-[11px] text-red-500 font-bold text-center">{guestError}</p>}

                  <button
                    type="submit"
                    disabled={isRegisteringGuest}
                    className="w-full bg-brand-green hover:bg-brand-dark text-white font-bold text-xs py-3 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isRegisteringGuest ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Kết nối trò chuyện'
                    )}
                  </button>
                </form>
              </div>
            ) : isLoadingHistory ? (
              <div className="my-auto flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-brand-green mb-2" />
                <span className="text-xs font-medium">Đang tải tin nhắn...</span>
              </div>
            ) : (
              /* Message Logs */
              <div className="space-y-3.5 flex-grow">
                {messages.length > 0 ? (
                  messages.map((msg) => {
                    const isMe = msg.sender === 'user';
                    return (
                      <div key={msg._id || msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-2 max-w-[80%] ${isMe ? 'flex-row-reverse' : ''}`}>
                          {!isMe && (
                            <div className="w-8 h-8 rounded-full bg-brand-green text-white text-[9px] font-black flex items-center justify-center shadow-md shrink-0">
                              AD
                            </div>
                          )}
                          <div className="space-y-0.5">
                            <div
                              className={`rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed text-xs ${
                                isMe
                                  ? 'bg-brand-green text-white rounded-tr-none'
                                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                            <span className={`text-[8px] block text-gray-400 font-mono ${isMe ? 'text-right' : 'text-left'}`}>
                              {new Date(msg.createdAt || Date.now()).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="my-auto flex flex-col items-center justify-center text-gray-400 py-16 text-center">
                    <MessageSquare className="w-12 h-12 opacity-20 mb-3" />
                    <p className="text-xs font-semibold text-gray-500">Xin chào, ba mẹ!</p>
                    <p className="text-[11px] text-gray-400 px-4 mt-1 leading-relaxed">
                      Ba mẹ hãy gửi tin nhắn tại đây để nhận giải đáp về tài khoản, sách luyện đọc hoặc lộ trình của bé nhé.
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Footer Input Form */}
          {activeUser && (
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Nhập tin nhắn hỗ trợ của ba mẹ..."
                className="flex-grow px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs focus:bg-white focus:border-brand-green focus:outline-none transition font-medium"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="bg-brand-green hover:bg-brand-dark disabled:opacity-40 text-white p-2.5 rounded-2xl transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
