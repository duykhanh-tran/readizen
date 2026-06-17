import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/axios.js';
import { useSocket } from '../../context/SocketContext.jsx';
import { MessageSquare, Send, Search, Shield, AlertCircle, ChevronLeft } from 'lucide-react';

export default function Chat() {
  const { socket } = useSocket();
  const [activeRoomId, setActiveRoomId] = useState('');
  const [typedMessage, setTypedMessage] = useState('');
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [mobileShowChat, setMobileShowChat] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load Rooms (Chat Users)
  const fetchRooms = async () => {
    try {
      const response = await api.get('/chat/users');
      setRooms(response.data);
      if (response.data.length > 0 && !activeRoomId) {
        setActiveRoomId(response.data[0].userId);
      }
    } catch (err) {
      setErrorMsg('Không thể tải danh sách cuộc trò chuyện.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);



  // Handle Room Switching & History Fetching
  useEffect(() => {
    if (!activeRoomId) return;

    const fetchHistory = async () => {
      try {
        const response = await api.get(`/chat/${activeRoomId}`);
        setMessages(response.data);
        
        // Đánh dấu đã đọc
        await api.put(`/chat/${activeRoomId}/read`);
        
        // Cập nhật trạng thái unread cục bộ của sidebar
        setRooms(prev => prev.map(room => 
          room.userId === activeRoomId ? { ...room, unread: false } : room
        ));
      } catch (err) {
        console.error('Lỗi lấy lịch sử chat:', err);
      }
    };

    fetchHistory();

    if (socket) {
      socket.emit('join_room', activeRoomId);
    }
  }, [activeRoomId, socket]);

  // Socket Listener for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (newMessage) => {
      // Nếu tin nhắn thuộc về phòng đang mở
      if (newMessage.userId === activeRoomId) {
        setMessages(prev => [...prev, newMessage]);
        // Tự động gọi API báo đã đọc
        api.put(`/chat/${activeRoomId}/read`).catch(console.error);
      }

      // Cập nhật preview tin nhắn cuối cùng và trạng thái unread ở sidebar
      setRooms(prevRooms => {
        const updated = prevRooms.map(room => {
          if (room.userId === newMessage.userId) {
            return {
              ...room,
              lastMessage: newMessage.text,
              timestamp: newMessage.createdAt,
              unread: newMessage.userId !== activeRoomId
            };
          }
          return room;
        });

        // Sắp xếp lại danh sách: đưa phòng vừa có tin nhắn lên đầu
        return [...updated].sort((a, b) => {
          if (!a.timestamp) return 1;
          if (!b.timestamp) return -1;
          return new Date(b.timestamp) - new Date(a.timestamp);
        });
      });
    };

    socket.on('receive_message', handleIncomingMessage);

    return () => {
      socket.off('receive_message', handleIncomingMessage);
    };
  }, [socket, activeRoomId]);

  // Send Message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !socket || !activeRoomId) return;

    socket.emit('send_message', {
      userId: activeRoomId,
      sender: 'admin',
      text: typedMessage
    });

    setTypedMessage('');
  };

  const activeRoom = rooms.find(room => room.userId === activeRoomId);

  const filteredRooms = rooms.filter(room => 
    room.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-160px)] bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden grid grid-cols-12 items-stretch font-sans text-left">
      
      {/* Rooms Sidebar (Left 4 cols) */}
      <div className={`col-span-12 md:col-span-4 border-r border-gray-200 flex flex-col h-full bg-gray-50/50 ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200 bg-white">
          <h3 className="font-black text-gray-900 text-base mb-3">Hộp thư hỗ trợ</h3>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm cuộc trò chuyện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F4F6F8]/80 border border-transparent focus:border-brand-green focus:bg-white focus:outline-none text-xs transition"
            />
          </div>
        </div>

        {/* Room List */}
        <div className="flex-grow overflow-y-auto divide-y divide-gray-100 p-2 space-y-1">
          {errorMsg && (
            <div className="p-4 text-center text-red-500 text-xs flex items-center gap-1.5 justify-center">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => {
              const isActive = room.userId === activeRoomId;
              return (
                <button
                  key={room.userId}
                  onClick={() => {
                    setActiveRoomId(room.userId);
                    setMobileShowChat(true);
                  }}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl transition duration-150 text-left cursor-pointer ${
                    isActive 
                      ? 'bg-brand-light/35 border border-brand-green/20' 
                      : 'hover:bg-white border border-transparent'
                  }`}
                >
                  {room.avatarUrl ? (
                    <img src={room.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {room.userName.charAt(0)}
                    </div>
                  )}
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800 text-xs truncate">{room.userName}</span>
                      <span className="text-[9px] text-gray-400 font-mono">
                        {room.timestamp ? new Date(room.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className={`text-[11px] truncate mt-1 ${
                      room.unread && !isActive ? 'font-bold text-gray-900' : 'text-gray-500'
                    }`}>
                      {room.lastMessage}
                    </p>
                  </div>

                  {room.unread && !isActive && (
                    <span className="w-2.5 h-2.5 bg-brand-green rounded-full flex-shrink-0 mt-1"></span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-400 text-xs">Không tìm thấy người dùng nào.</div>
          )}
        </div>
      </div>

      {/* Message Area (Right 8 cols) */}
      <div className={`col-span-12 md:col-span-8 flex flex-col h-full bg-white relative ${!mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
        {activeRoom ? (
          <>
            {/* Header */}
            <div className="px-4 lg:px-6 py-3.5 border-b border-gray-200 flex items-center justify-between bg-white z-10 shadow-sm flex-shrink-0">
              <div className="flex items-center gap-3">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setMobileShowChat(false)}
                  className="md:hidden p-1.5 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {activeRoom.avatarUrl ? (
                  <img src={activeRoom.avatarUrl} alt="Avatar" className="w-9 h-9 rounded-full object-cover shadow-sm border" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {activeRoom.userName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-gray-800 text-sm leading-tight">{activeRoom.userName}</h4>
                  <span className="text-[10px] text-gray-400">{activeRoom.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Đang hoạt động</span>
              </div>
            </div>

            {/* Messages Scroll View */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-[#FAF9F5]">
              {messages.length > 0 ? (
                messages.map((msg) => {
                  const isAdminMsg = msg.sender === 'admin';
                  return (
                    <div key={msg._id || msg.id} className={`flex ${isAdminMsg ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex items-start gap-2.5 max-w-[70%] ${isAdminMsg ? 'flex-row-reverse' : ''}`}>
                        {isAdminMsg ? (
                          <div className="w-7 h-7 rounded-full bg-brand-green text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                            AD
                          </div>
                        ) : activeRoom.avatarUrl ? (
                          <img src={activeRoom.avatarUrl} alt="User Avatar" className="w-7 h-7 rounded-full object-cover border" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 border flex items-center justify-center text-[10px] font-bold">
                            {activeRoom.userName.charAt(0)}
                          </div>
                        )}
                        
                        <div className="space-y-1">
                          <div className={`rounded-2xl px-4 py-2.5 text-xs shadow-sm leading-relaxed ${
                            isAdminMsg 
                              ? 'bg-brand-green text-white rounded-tr-none' 
                              : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                          }`}>
                            {msg.text}
                          </div>
                          <div className={`text-[9px] text-gray-400 font-mono ${isAdminMsg ? 'text-right' : 'text-left'}`}>
                            {new Date(msg.createdAt || Date.now()).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-xs py-20">
                  <MessageSquare className="w-10 h-10 opacity-20 mb-2" />
                  <span>Bắt đầu cuộc trò chuyện mới.</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white flex items-center gap-3 flex-shrink-0">
              <input
                type="text"
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                placeholder="Nhập tin nhắn phản hồi học viên..."
                className="flex-grow px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-green focus:outline-none text-xs transition"
              />
              <button
                type="submit"
                className="bg-brand-green hover:bg-brand-dark text-white p-2.5 rounded-xl transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center flex-shrink-0 cursor-pointer"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
            <MessageSquare className="w-16 h-16 opacity-20 mb-4" />
            <p className="font-semibold text-sm">Chưa chọn cuộc hội thoại nào.</p>
            <p className="text-xs mt-1 text-gray-400">Chọn một phòng chat ở cột trái để bắt đầu nhắn tin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
