import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X, LogOut, Shield, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Set scrolled state
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide header if scrolling down and past 80px, show if scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsVisible(false);
        setIsUserDropdownOpen(false); // Close dropdown on scroll
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
      title: "5 học phần của sách",
      to: "/learn"
    },
    {
      title: "Luyện đọc tại nhà",
      to: "/practice"
    },
    {
      title: "Công nghệ luyện đọc",
      to: "/tech"
    }
  ];

  const resourceDropdownItems = [
    {
      title: "Phiếu đọc AI",
      to: "/library"
    },
    {
      title: "SmartABC",
      to: "/smartabc"
    },
    {
      title: "Videos",
      to: "/videos"
    }
  ];

  // Helper to get initials from fullName
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const isSolid = isScrolled || isMobileMenuOpen;

  return (
    <header className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'} ${isSolid ? 'bg-[#FFFDF3]/95 backdrop-blur-md border-b border-[#EAE5D1] shadow-sm' : 'bg-transparent border-b border-transparent shadow-none'}`}>
      <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        {/* Cột trái: Logo */}
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center cursor-pointer flex-shrink-0" aria-label="Readizen - Trang chủ">
          <img src="/assets/logo.png" alt="Readizen Logo" className="h-6 lg:h-8 w-auto object-contain" />
        </Link>

        {/* Cột giữa: Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-10">
          <NavItem text="Phương pháp" hasDropdown dropdownItems={methodDropdownItems} />
          <NavItem text="Tài nguyên" hasDropdown dropdownItems={resourceDropdownItems} />
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
                  className="flex items-center gap-2 bg-brand-light/50 border border-brand-green/20 hover:bg-brand-light py-2 px-4 rounded-full transition duration-200 cursor-pointer"
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
                  <span className="font-bold text-gray-800 text-sm">
                    {user?.fullName || user?.username || 'Tài khoản'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white border border-[#EAE5D1] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-[#FAF7EE]">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Đăng nhập dưới tên</p>
                      <p className="font-bold text-gray-800 text-sm truncate mt-1">{user?.fullName || user?.username}</p>
                      <p className="text-xs text-gray-600 truncate mt-0.5">{user?.email}</p>
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
                <Link to="/login" className="text-[#333333] hover:text-brand-green font-bold py-2 px-4 rounded-full text-sm transition-colors duration-200">
                  Đăng nhập
                </Link>
                <Link to="/register" className="bg-brand-green hover:bg-brand-dark text-white font-bold py-2.5 px-6 rounded-full text-sm transition-colors duration-200 shadow-md hover:shadow-lg">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Nút menu hamburger cho màn hình mobile */}
          <button
            className="lg:hidden p-2 text-brand-green hover:bg-[#EAE5D1] rounded-md transition-colors"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Đóng menu điều hướng" : "Mở menu điều hướng"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#FFFDF3] border-b border-[#EAE5D1] shadow-2xl flex flex-col py-4 px-6 space-y-2 animate-in slide-in-from-top-2 duration-200 z-50">
          <MobileNavItem text="Phương pháp" hasDropdown dropdownItems={methodDropdownItems} onClick={() => setIsMobileMenuOpen(false)} />
          <MobileNavItem text="Tài nguyên" hasDropdown dropdownItems={resourceDropdownItems} onClick={() => setIsMobileMenuOpen(false)} />
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
                    <div className="font-bold text-gray-800 text-sm">{user?.fullName || user?.username}</div>
                    <div className="text-xs text-gray-600 truncate">{user?.email}</div>
                  </div>
                </div>

                {user?.role === 'admin' ? (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full bg-brand-light text-brand-green font-bold py-3 px-4 rounded-full text-sm transition-colors duration-200 border border-brand-green/20"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Trang quản trị</span>
                  </Link>
                ) : (
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full bg-brand-light text-brand-green font-bold py-3 px-4 rounded-full text-sm transition-colors duration-200 border border-brand-green/20"
                  >
                    <User className="w-4 h-4" />
                    <span>Trang cá nhân</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-4 rounded-full text-sm transition-colors duration-200 cursor-pointer"
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
                  className="w-full text-[#333333] hover:text-brand-green text-center font-bold py-3 px-4 rounded-full text-sm transition-colors duration-200 border border-gray-200 block"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-brand-green hover:bg-brand-dark text-white text-center font-bold py-3 px-4 rounded-full text-sm transition-colors duration-200 shadow-md block"
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

// Helper function to calculate active route match including sub-routes (lessons/details)
const isRouteActive = (itemUrl, currentPath) => {
  if (itemUrl === '/library') {
    return currentPath === '/library' || currentPath.startsWith('/lessons/');
  }
  if (itemUrl === '/smartabc') {
    return currentPath === '/smartabc' || currentPath.startsWith('/smartabc/');
  }
  if (itemUrl === '/videos') {
    return currentPath === '/videos' || currentPath.startsWith('/videos/');
  }
  return currentPath === itemUrl;
};

// Component con cho từng mục trong menu điều hướng (Desktop)
const NavItem = ({ text, to, hasDropdown, dropdownItems }) => {
  const { pathname } = useLocation();

  // Parent is active if its URL matches or any of its child items match
  const isActive = hasDropdown
    ? dropdownItems?.some(item => isRouteActive(item.to, pathname))
    : isRouteActive(to, pathname);

  return (
    <div className="relative group py-2">
      <Link
        to={hasDropdown ? '#' : to || '#'}
        className={`flex items-center cursor-pointer font-bold text-sm transition-colors duration-200 ${isActive ? 'text-brand-green' : 'text-[#333333] hover:text-brand-green'
          }`}
      >
        <span>
          {text}
        </span>
        {hasDropdown && (
          <ChevronDown
            className={`ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180 ${isActive ? 'text-brand-green' : 'text-[#666666] group-hover:text-brand-green'
              }`}
            strokeWidth={2.5}
          />
        )}
      </Link>

      {/* Hiệu ứng underline mờ khi hover hoặc active */}
      <div className={`absolute bottom-0 left-0 h-0.5 bg-brand-green transition-all duration-300 ${isActive ? 'w-full opacity-100' : 'w-0 group-hover:w-full opacity-0 group-hover:opacity-100'
        }`}></div>

      {/* Dropdown Menu */}
      {hasDropdown && dropdownItems && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white border border-[#EAE5D1] rounded-2xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
          <div className="absolute -top-1 w-2.5 h-2.5 bg-white border-t border-l border-[#EAE5D1] rotate-45 left-1/2 -translate-x-1/2"></div>
          <div className="relative bg-white rounded-2xl overflow-hidden">
            {dropdownItems.map((item, index) => {
              const isChildActive = isRouteActive(item.to, pathname);
              return (
                <Link
                  key={index}
                  to={item.to}
                  className={`block px-6 py-3 transition-colors duration-150 border-b border-[#FAF7EE] last:border-b-0 ${isChildActive ? 'bg-[#FAF7EE] text-brand-green' : 'text-[#333333] hover:text-brand-green hover:bg-[#FAF7EE]'
                    }`}
                >
                  <div className="font-bold text-sm">{item.title}</div>
                  {item.desc && <div className="text-xs text-gray-600 font-normal mt-1 leading-normal">{item.desc}</div>}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Component con cho menu điều hướng (Mobile)
const MobileNavItem = ({ text, to, hasDropdown, dropdownItems, onClick }) => {
  const { pathname } = useLocation();

  const isParentActive = hasDropdown
    ? dropdownItems?.some(item => isRouteActive(item.to, pathname))
    : isRouteActive(to, pathname);

  // Accordion expands automatically if any of its children are active
  const [isOpen, setIsOpen] = useState(isParentActive);

  // Sync accordion expansion state when path changes
  useEffect(() => {
    if (isParentActive) {
      setIsOpen(true);
    }
  }, [pathname, isParentActive]);

  if (hasDropdown && dropdownItems) {
    return (
      <div className="flex flex-col font-sans">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between cursor-pointer py-3 px-2 rounded-lg hover:bg-[#EAE5D1]/50 group transition-colors w-full text-left ${isParentActive ? 'bg-[#EAE5D1]/30' : ''
            }`}
        >
          <span className={`font-bold text-base transition-colors duration-200 ${isParentActive ? 'text-brand-green' : 'text-[#333333] group-hover:text-brand-green'
            }`}>
            {text}
          </span>
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${isParentActive ? 'text-brand-green' : 'text-[#666666] group-hover:text-brand-green'
              } ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="pl-4 flex flex-col border-l-2 border-brand-green/20 ml-2 mt-1 space-y-1">
            {dropdownItems.map((item, index) => {
              const isChildActive = isRouteActive(item.to, pathname);
              return (
                <Link
                  key={index}
                  to={item.to}
                  onClick={onClick}
                  className={`block py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors ${isChildActive ? 'text-brand-green bg-[#EAE5D1]/40' : 'text-gray-700 hover:text-brand-green hover:bg-[#EAE5D1]/30'
                    }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const isActive = isRouteActive(to, pathname);

  return (
    <Link
      to={to || '#'}
      onClick={onClick}
      className={`flex items-center justify-between cursor-pointer py-3 px-2 rounded-lg hover:bg-[#EAE5D1]/50 group transition-colors ${isActive ? 'bg-[#EAE5D1]/30' : ''
        }`}
    >
      <span className={`font-bold text-base transition-colors duration-200 ${isActive ? 'text-brand-green' : 'text-[#333333] group-hover:text-brand-green'
        }`}>
        {text}
      </span>
    </Link>
  );
};

export default Header;