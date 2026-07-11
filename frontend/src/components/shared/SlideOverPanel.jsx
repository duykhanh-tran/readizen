import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function SlideOverPanel({ isOpen, onClose, title, children }) {
  
  // CHỐT CHẶN AN TOÀN: Ngăn chặn cuộn trang phía sau khi Slide-over Panel đang mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Đảm bảo khôi phục lại khi component bị unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
      {/* 1. Backdrop (Lớp nền mờ phía sau) */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* 2. Slide-over Panel (Bảng trượt từ cạnh phải) */}
      <div
        className={`absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out border-l border-gray-100 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Panel Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-extrabold text-lg text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            aria-label="Đóng bảng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panel Content (Scrollable if content is long) */}
        <div className="flex-grow overflow-y-auto px-6 py-5 text-left">
          {children}
        </div>
      </div>
    </div>
  );
}
