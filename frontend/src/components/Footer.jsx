import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-green text-white py-16 w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            
          {/* Cột 1: Logo & Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-brand-dark rounded flex items-center justify-center font-bold text-xl">🦉</div>
              <span className="font-bold text-2xl tracking-tight">Readizen</span>
            </div>
            <p className="text-gray-300 text-sm max-w-sm leading-relaxed">
              Truyện tiếng Anh luyện đọc có hướng dẫn cho trẻ 5+. Small Readers, Big Citizens.
            </p>
          </div>

          {/* Cột 2: Khám phá */}
          <div>
            <h5 className="font-bold mb-6 text-white">Khám phá</h5>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link to="/practice" className="hover:text-brand-yellow transition">Luyện đọc có hướng dẫn</Link></li>
              <li><Link to="/learn" className="hover:text-brand-yellow transition">Cách học Readizen</Link></li>
              <li><Link to="/tech" className="hover:text-brand-yellow transition">Công nghệ Readizen</Link></li>
              <li><Link to="/product" className="hover:text-brand-yellow transition">Readizen Set 1</Link></li>
            </ul>
          </div>

          {/* Cột 3: Phụ huynh */}
          <div>
            <h5 className="font-bold mb-6 text-white">Phụ huynh</h5>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><a href="#" className="hover:text-brand-yellow transition">Hướng dẫn phụ huynh</a></li>
              <li><a href="#" className="hover:text-brand-yellow transition">FAQ</a></li>
              <li><a href="#" className="hover:text-brand-yellow transition">Liên hệ</a></li>
              <li><Link to="/about" className="hover:text-brand-yellow transition">Về Readizen</Link></li>
            </ul>
          </div>

          {/* Cột 4: Chính sách */}
          <div>
            <h5 className="font-bold mb-6 text-white">Chính sách</h5>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><a href="#" className="hover:text-brand-yellow transition">Chính sách giao hàng</a></li>
              <li><a href="#" className="hover:text-brand-yellow transition">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-brand-yellow transition">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-brand-yellow transition">Điều khoản sử dụng</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <p>© {currentYear} Readizen. All rights reserved.</p>
          <p>Readizen — Truyện tiếng Anh luyện đọc có hướng dẫn cho trẻ 5+</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;