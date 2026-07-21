import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Rocket, Sparkles, X, Loader2 } from 'lucide-react';
import api from '../../services/axios.js';

export default function FloatingSmartCode() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const containerRef = useRef(null);

  // Click outside to close helper
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus the first input box when opening the popover
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRefs[0].current?.focus();
        setFocusedIndex(0);
      }, 100);
    } else {
      setCode(['', '', '', '']);
      setError('');
      setShake(false);
      setFocusedIndex(0);
    }
  }, [isOpen]);

  // Automatically submit once all 4 digits are filled
  useEffect(() => {
    const codeString = code.join('');
    if (codeString.length === 4 && !isLoading) {
      handleSearch(codeString);
    }
  }, [code]);

  const handleSearch = async (codeString) => {
    setIsLoading(true);
    setError('');
    setShake(false);

    try {
      const response = await api.get(`/search/smart-code/${codeString}`);
      const { redirectUrl } = response.data;
      
      setIsOpen(false);
      navigate(redirectUrl);
    } catch (err) {
      console.error('Error finding Smart Code:', err);
      setShake(true);
      setError(err.response?.data?.message || 'Mã Smart Code không chính xác.');
      
      // Keep shake animation for 500ms
      setTimeout(() => {
        setShake(false);
      }, 500);

      // Reset inputs & refocus first
      setCode(['', '', '', '']);
      inputRefs[0].current?.focus();
      setFocusedIndex(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (value, index) => {
    const cleanValue = value.replace(/\D/g, ''); // Digits only
    if (!cleanValue) return;

    const newCode = [...code];
    newCode[index] = cleanValue.slice(-1); // Take only the last digit typed
    setCode(newCode);

    // Auto-focus next input
    if (index < 3) {
      inputRefs[index + 1].current?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newCode = [...code];
      
      if (!newCode[index] && index > 0) {
        // If current box is empty, delete previous box value and focus it
        newCode[index - 1] = '';
        setCode(newCode);
        inputRefs[index - 1].current?.focus();
        setFocusedIndex(index - 1);
      } else {
        // Just clear current box
        newCode[index] = '';
        setCode(newCode);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const digits = pasteData.replace(/\D/g, '').slice(0, 4);

    if (digits.length > 0) {
      const newCode = [...code];
      for (let i = 0; i < 4; i++) {
        newCode[i] = digits[i] || '';
      }
      setCode(newCode);

      // Focus the appropriate input after paste
      const nextFocusIndex = Math.min(digits.length, 3);
      inputRefs[nextFocusIndex].current?.focus();
      setFocusedIndex(nextFocusIndex);
    }
  };

  // Virtual Keypad Handlers
  const handleKeyPress = (num) => {
    const newCode = [...code];
    newCode[focusedIndex] = num;
    setCode(newCode);

    // Auto-focus the next input
    if (focusedIndex < 3) {
      inputRefs[focusedIndex + 1].current?.focus();
      setFocusedIndex(focusedIndex + 1);
    }
  };

  const handleVirtualBackspace = () => {
    const newCode = [...code];
    
    // If the currently focused box is empty, delete previous box and focus it
    if (newCode[focusedIndex] === '' && focusedIndex > 0) {
      newCode[focusedIndex - 1] = '';
      setCode(newCode);
      inputRefs[focusedIndex - 1].current?.focus();
      setFocusedIndex(focusedIndex - 1);
    } else {
      // Just clear current box
      newCode[focusedIndex] = '';
      setCode(newCode);
      inputRefs[focusedIndex].current?.focus();
    }
  };

  const handleVirtualClear = () => {
    setCode(['', '', '', '']);
    setError('');
    setShake(false);
    inputRefs[0].current?.focus();
    setFocusedIndex(0);
  };

  // Hide on admin route pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 font-sans text-left animate-fade-in" ref={containerRef}>
      {/* Floating Smart Code Button (Stacked above chat button) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-brand-orange to-amber-500 text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative cursor-pointer group"
        aria-label="Nhập mã Smart Code"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-300 transform rotate-0 hover:rotate-90" />
        ) : (
          <svg
            viewBox="0 0 180 180"
            className="w-6 h-6 fill-current transition-transform duration-300 hover:scale-110"
          >
            <g>
              <path d="M45,29.7c-8.4,0-15.3,6.9-15.3,15.3c0,8.4,6.9,15.3,15.3,15.3c8.4,0,15.3-6.9,15.3-15.3C60.3,36.6,53.4,29.7,45,29.7z" />
              <path d="M90,29.7c-8.4,0-15.3,6.9-15.3,15.3c0,8.4,6.9,15.3,15.3,15.3c8.4,0,15.3-6.9,15.3-15.3C105.3,36.6,98.4,29.7,90,29.7z" />
              <path d="M90,74.7c-8.4,0-15.3,6.9-15.3,15.3c0,8.4,6.9,15.3,15.3,15.3c8.4,0,15.3-6.9,15.3-15.3C105.3,81.6,98.4,74.7,90,74.7z" />
              <path d="M90,119.7c-8.4,0-15.3,6.9-15.3,15.3c0,8.4,6.9,15.3,15.3,15.3c8.4,0,15.3-6.9,15.3-15.3C105.3,126.6,98.4,119.7,90,119.7z" />
              <path d="M135,74.7c-8.4,0-15.3,6.9-15.3,15.3c0,8.4,6.9,15.3,15.3,15.3s15.3-6.9,15.3-15.3C150.3,81.6,143.4,74.7,135,74.7z" />
              <path d="M45,74.7c-8.4,0-15.3,6.9-15.3,15.3c0,8.4,6.9,15.3,15.3,15.3c8.4,0,15.3-6.9,15.3-15.3C60.3,81.6,53.4,74.7,45,74.7z" />
              <path d="M135,29.7c-8.4,0-15.3,6.9-15.3,15.3c0,8.4,6.9,15.3,15.3,15.3s15.3-6.9,15.3-15.3C150.3,36.6,143.4,29.7,135,29.7z" />
            </g>
          </svg>
        )}
        
        {/* Pulse effect */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-brand-orange/30 animate-ping opacity-75"></span>
        )}
      </button>

      {/* Popover OTP Input Window (Opens leftwards from the button) */}
      {isOpen && (
        <div className="absolute bottom-18 right-0 w-[320px] bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 transform translate-y-0 opacity-100 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-orange to-amber-500 text-white px-5 py-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-200 fill-yellow-200 animate-pulse" />
              <div>
                <h4 className="font-extrabold text-sm tracking-tight">Nhập Smart Code</h4>
                <p className="text-[10px] text-amber-100 font-medium">Truy cập nhanh bài học từ sách</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 bg-[#FAF9F5] flex flex-col items-center space-y-4">
            <p className="text-[11px] text-gray-500 text-center font-semibold leading-normal">
              Nhập mã 4 chữ số in trong sách học để mở bài tương ứng.
            </p>

            {/* OTP Grid */}
            <div className={`flex gap-3 justify-center py-1 ${shake ? 'animate-shake' : ''}`}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  maxLength={1}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={digit}
                  onFocus={() => setFocusedIndex(index)}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  disabled={isLoading}
                  className={`w-12 h-14 text-center text-2xl font-black rounded-2xl border-2 bg-white transition-all duration-200 focus:outline-none focus:scale-105 ${
                    error
                      ? 'border-red-400 text-red-500 focus:border-red-500'
                      : focusedIndex === index
                      ? 'border-brand-orange text-brand-orange scale-105 shadow-sm'
                      : 'border-gray-200 text-gray-800 focus:border-brand-orange'
                  }`}
                />
              ))}
            </div>

            {/* Error Message & Loader */}
            {isLoading && (
              <div className="flex items-center gap-2 text-brand-orange animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-bold">Đang tìm kiếm...</span>
              </div>
            )}

            {error && (
              <p className="text-[11px] text-red-500 font-bold text-center animate-bounce">
                {error}
              </p>
            )}
          </div>

          {/* On-screen Numeric Keypad */}
          <div className="bg-[#FAF9F5] px-5 pb-5 pt-1 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((key) => {
                let btnClass = "py-3 rounded-2xl font-black text-sm text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-200 transition duration-100 active:scale-95 flex items-center justify-center cursor-pointer shadow-sm select-none h-11";
                let handler = () => handleKeyPress(key);
                
                if (key === 'C') {
                  btnClass = "py-3 rounded-2xl font-black text-sm text-red-500 bg-red-50 hover:bg-red-100 active:bg-red-200 border border-red-200 transition duration-100 active:scale-95 flex items-center justify-center cursor-pointer shadow-sm select-none h-11";
                  handler = handleVirtualClear;
                } else if (key === '⌫') {
                  btnClass = "py-3 rounded-2xl font-black text-sm text-amber-600 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 border border-amber-200 transition duration-100 active:scale-95 flex items-center justify-center cursor-pointer shadow-sm select-none h-11";
                  handler = handleVirtualBackspace;
                }

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={handler}
                    disabled={isLoading}
                    className={btnClass}
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
