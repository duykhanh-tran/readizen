import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X, LogOut, Shield, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  // Click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const methodDropdownItems = [
    { 
      title: "Phương pháp học", 
      to: "/learn" 
    },
    { 
      title: "Phương pháp luyện đọc", 
      to: "/practice" 
    }
  ];

  // Helper to get initials from fullName
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="bg-[#FFFDF3] w-full relative border-b border-[#EAE5D1] shadow-sm z-50">
      <div className="px-6 py-3.5 flex items-center justify-between max-w-7xl mx-auto">
        {/* Cột trái: Logo */}
        <Link to="/" className="flex items-center cursor-pointer flex-shrink-0">
          <div className="bg-brand-green w-8 h-8 rounded-lg flex items-center justify-center mr-2 shadow-inner">
            <span className="text-lg leading-none transform translate-y-[-1px]" role="img" aria-label="owl">🦉</span>
          </div>
          <span className="text-brand-green font-black text-[22px] tracking-tight">Readizen</span>
        </Link>

        {/* Cột giữa: Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-10">
          <NavItem text="Phương pháp" hasDropdown dropdownItems={methodDropdownItems} />
          <NavItem text="Công nghệ" to="/tech" />
          <NavItem text="Sản phẩm" to="/product" />
          <NavItem text="Về Readizen" to="/about" />
        </nav>

        {/* Cột phải: CTA Button & Mobile Toggle */}
        <div className="flex items-center gap-1 lg:gap-3">
          {/* Nút đăng nhập/đăng ký hoặc User Profile (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 bg-brand-light/50 border border-brand-green/20 hover:bg-brand-light py-1.5 px-3.5 rounded-full transition duration-200 cursor-pointer"
                >
                  {user?.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full object-cover border border-brand-green/20 shadow-sm"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-green text-white font-bold flex items-center justify-center text-xs shadow-sm">
                      {getInitials(user?.fullName || user?.username)}
                    </div>
                  )}
                  <span className="font-bold text-gray-800 text-[14px]">
                    {user?.fullName || user?.username || 'Tài khoản'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-64 bg-white border border-[#EAE5D1] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-[#FAF7EE]">
                      <p className="text-[12px] text-gray-500">Đăng nhập dưới tên</p>
                      <p className="font-bold text-gray-800 text-sm truncate">{user?.fullName || user?.username}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                    </div>

                    <div className="p-1">
                      {user?.role === 'admin' ? (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-brand-green hover:bg-[#FAF7EE] rounded-xl transition duration-150"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Trang quản trị</span>
                        </Link>
                      ) : (
                        <Link
                          to="/profile"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-brand-green hover:bg-[#FAF7EE] rounded-xl transition duration-150"
                        >
                          <User className="w-4 h-4" />
                          <span>Trang cá nhân</span>
                        </Link>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition duration-150 text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-[#333333] hover:text-brand-green font-bold py-2 px-4 rounded-full text-[15px] transition-colors duration-200">
                  Đăng nhập
                </Link>
                <Link to="/register" className="bg-brand-green hover:bg-brand-dark text-white font-bold py-2.5 px-6 rounded-full text-[15px] transition-colors duration-200 shadow-md hover:shadow-lg">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
          
          {/* Nút menu hamburger cho màn hình mobile */}
          <button 
            className="lg:hidden p-2 text-brand-green hover:bg-[#EAE5D1] rounded-md transition-colors"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#FFFDF3] border-b border-[#EAE5D1] shadow-2xl flex flex-col py-4 px-6 space-y-2 animate-in slide-in-from-top-2 duration-200 z-50">
          <MobileNavItem text="Phương pháp" hasDropdown dropdownItems={methodDropdownItems} onClick={() => setIsMobileMenuOpen(false)} />
          <MobileNavItem text="Công nghệ" to="/tech" onClick={() => setIsMobileMenuOpen(false)} />
          <MobileNavItem text="Sản phẩm" to="/product" onClick={() => setIsMobileMenuOpen(false)} />
          <MobileNavItem text="Về Readizen" to="/about" onClick={() => setIsMobileMenuOpen(false)} />
          
          <div className="pt-6 pb-2 border-t border-[#EAE5D1] flex flex-col gap-3">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 px-2 py-1">
                  {user?.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt="Avatar" 
                      className="w-10 h-10 rounded-full object-cover border border-brand-green/20 shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-green text-white font-bold flex items-center justify-center text-sm shadow-sm">
                      {getInitials(user?.fullName || user?.username)}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-gray-800 text-[15px]">{user?.fullName || user?.username}</div>
                    <div className="text-[12px] text-gray-500 truncate">{user?.email}</div>
                  </div>
                </div>

                {user?.role === 'admin' ? (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full bg-brand-light text-brand-green font-bold py-3 px-4 rounded-full text-[15px] transition-colors duration-200 border border-brand-green/20"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Trang quản trị</span>
                  </Link>
                ) : (
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full bg-brand-light text-brand-green font-bold py-3 px-4 rounded-full text-[15px] transition-colors duration-200 border border-brand-green/20"
                  >
                    <User className="w-4 h-4" />
                    <span>Trang cá nhân</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-4 rounded-full text-[15px] transition-colors duration-200 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-[#333333] hover:text-brand-green text-center font-bold py-3 px-4 rounded-full text-[15px] transition-colors duration-200 border border-gray-200 block"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-brand-green hover:bg-brand-dark text-white text-center font-bold py-3 px-4 rounded-full text-[15px] transition-colors duration-200 shadow-md block"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

// Component con cho từng mục trong menu điều hướng (Desktop)
const NavItem = ({ text, to, hasDropdown, dropdownItems }) => {
  return (
    <div className="relative group py-2">
      <Link 
        to={hasDropdown ? '#' : to || '#'} 
        className="flex items-center cursor-pointer text-[#333333] hover:text-brand-green transition-colors duration-200"
      >
        <span className="font-bold text-[15px]">
          {text}
        </span>
        {hasDropdown && (
          <ChevronDown 
            className="ml-1 w-4 h-4 text-[#666666] group-hover:text-brand-green transition-transform duration-200 group-hover:rotate-180" 
            strokeWidth={2.5} 
          />
        )}
      </Link>
      
      {/* Hiệu ứng underline mờ khi hover */}
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-green transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"></div>

      {/* Dropdown Menu */}
      {hasDropdown && dropdownItems && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white border border-[#EAE5D1] rounded-2xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-[#EAE5D1] rotate-45"></div>
          <div className="relative bg-white rounded-2xl overflow-hidden">
            {dropdownItems.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className="block px-5 py-3 hover:bg-[#FAF7EE] text-[#333333] hover:text-brand-green transition-colors duration-150 border-b border-[#FAF7EE] last:border-b-0"
              >
                <div className="font-bold text-[14px]">{item.title}</div>
                {item.desc && <div className="text-[12px] text-gray-500 font-normal mt-0.5 leading-normal">{item.desc}</div>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Component con cho menu điều hướng (Mobile)
const MobileNavItem = ({ text, to, hasDropdown, dropdownItems, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (hasDropdown && dropdownItems) {
    return (
      <div className="flex flex-col">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between cursor-pointer py-3 px-2 rounded-lg hover:bg-[#EAE5D1]/50 group transition-colors w-full text-left"
        >
          <span className="text-[#333333] font-bold text-[16px] group-hover:text-brand-green transition-colors duration-200">
            {text}
          </span>
          <ChevronDown 
            className={`w-5 h-5 text-[#666666] group-hover:text-brand-green transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>
        
        {isOpen && (
          <div className="pl-4 flex flex-col border-l-2 border-brand-green/20 ml-2 mt-1 space-y-1">
            {dropdownItems.map((item, index) => (
              <Link 
                key={index}
                to={item.to} 
                onClick={onClick}
                className="block py-2.5 px-3 rounded-lg text-gray-700 hover:text-brand-green hover:bg-[#EAE5D1]/30 font-semibold text-[14px] transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link 
      to={to || '#'} 
      onClick={onClick}
      className="flex items-center justify-between cursor-pointer py-3 px-2 rounded-lg hover:bg-[#EAE5D1]/50 group transition-colors"
    >
      <span className="text-[#333333] font-bold text-[16px] group-hover:text-brand-green transition-colors duration-200">
        {text}
      </span>
    </Link>
  );
};

export default Header;