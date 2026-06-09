import React from 'react';
import { MessageSquare, Send } from 'lucide-react';

export default function ChatConsole({ 
  chatMessages, 
  chatInput, 
  setChatInput, 
  handleSendChatMessage, 
  chatEndRef 
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[500px] text-left">
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
  );
}
