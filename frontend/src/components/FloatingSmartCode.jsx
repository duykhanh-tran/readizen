import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, X, Loader2, Rocket } from 'lucide-react';
import api from '../services/axios.js';
import VirtualNumpad from './VirtualNumpad.jsx';

export default function FloatingSmartCode() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    
    const [isOpen, setIsOpen] = useState(false);
    const [code, setCode] = useState(['', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [activeInputIndex, setActiveInputIndex] = useState(0);

    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const errorTimeoutRef = useRef(null);
    const containerRef = useRef(null);

    // Close on click outside (only for desktop popover)
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

    // Handle cross-component event listeners for FloatingChat
    useEffect(() => {
        const handleCloseSmartCode = () => {
            setIsOpen(false);
        };
        window.addEventListener('close-smart-code', handleCloseSmartCode);
        return () => {
            window.removeEventListener('close-smart-code', handleCloseSmartCode);
        };
    }, []);

    // Dispatch closing event for FloatingChat when SmartCode opens
    useEffect(() => {
        if (isOpen) {
            window.dispatchEvent(new CustomEvent('close-floating-chat'));
            // Focus on first input
            setTimeout(() => {
                inputRefs[0].current?.focus();
                setActiveInputIndex(0);
            }, 100);
        } else {
            setCode(['', '', '', '']);
            setIsError(false);
        }
    }, [isOpen]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (errorTimeoutRef.current) {
                clearTimeout(errorTimeoutRef.current);
            }
        };
    }, []);

    // Auto submit when all 4 digits are filled
    useEffect(() => {
        const fullCode = code.join('');
        if (fullCode.length === 4) {
            submitCode(fullCode);
        }
    }, [code]);

    const handleInputFocus = (index) => {
        setActiveInputIndex(index);
    };

    const handleVirtualKeyPress = (key) => {
        if (isLoading) return;

        if (key === 'close') {
            setIsOpen(false);
            return;
        }

        if (key === 'backspace') {
            const newCode = [...code];
            // If the current index has a value, clear it
            if (code[activeInputIndex] !== '') {
                newCode[activeInputIndex] = '';
                setCode(newCode);
            } else if (activeInputIndex > 0) {
                // Otherwise move back and clear the previous one
                newCode[activeInputIndex - 1] = '';
                setCode(newCode);
                inputRefs[activeInputIndex - 1].current?.focus();
                setActiveInputIndex(activeInputIndex - 1);
            }
            return;
        }

        // If numeric digit (0-9)
        if (/^[0-9]$/.test(key)) {
            const newCode = [...code];
            newCode[activeInputIndex] = key;
            setCode(newCode);

            // Move to next input
            if (activeInputIndex < 3) {
                inputRefs[activeInputIndex + 1].current?.focus();
                setActiveInputIndex(activeInputIndex + 1);
            }
        }
    };

    // Standard physical keyboard inputs (fallback/support)
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            handleVirtualKeyPress('backspace');
        }
    };

    const handleChange = (e, index) => {
        const val = e.target.value;
        if (val && !/^[0-9]$/.test(val)) return;

        const newCode = [...code];
        newCode[index] = val;
        setCode(newCode);

        if (val && index < 3) {
            inputRefs[index + 1].current?.focus();
            setActiveInputIndex(index + 1);
        }
    };

    // Extract numbers on paste using regex
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
        if (!pastedData) return;

        const newCode = [...code];
        for (let i = 0; i < pastedData.length; i++) {
            newCode[i] = pastedData[i];
        }
        setCode(newCode);

        const nextFocusIndex = Math.min(pastedData.length, 3);
        inputRefs[nextFocusIndex].current?.focus();
        setActiveInputIndex(nextFocusIndex);
    };

    const submitCode = async (fullCode) => {
        setIsLoading(true);
        setIsError(false);
        try {
            const response = await api.get(`/search/smart-code/${fullCode}`);
            setIsLoading(false);
            setCode(['', '', '', '']);
            setIsOpen(false);
            navigate(response.data.redirectUrl);
        } catch (err) {
            setIsLoading(false);
            setIsError(true);
            
            if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
            errorTimeoutRef.current = setTimeout(() => {
                setIsError(false);
                setCode(['', '', '', '']);
                inputRefs[0].current?.focus();
                setActiveInputIndex(0);
            }, 2000);
        }
    };

    // Do not show on admin routes
    if (pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <div className="fixed bottom-24 right-6 z-50 select-none font-sans" ref={containerRef}>
            {/* Pop-over Smart Code Box */}
            {isOpen && (
                <>
                    {/* Mobile Dim Overlay backdrop */}
                    <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setIsOpen(false)} />
                    
                    <div className="fixed inset-x-4 bottom-40 z-50 bg-white border border-brand-green/10 rounded-3xl shadow-2xl p-6 transition-all duration-300 transform scale-100 origin-center
                        md:absolute md:inset-auto md:bottom-18 md:right-0 md:translate-y-0 md:w-[320px] md:max-w-[350px] md:rounded-2xl md:p-5 md:origin-bottom-right">
                        
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 text-brand-green font-bold">
                                <Rocket className="w-5 h-5 text-brand-yellow animate-bounce" />
                                <span className="text-sm">Bé nhập mã số bài học nhé!</span>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* OTP Inputs */}
                        <div className="flex justify-between gap-3 my-4">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    ref={inputRefs[index]}
                                    onFocus={() => handleInputFocus(index)}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onPaste={handlePaste}
                                    disabled={isLoading}
                                    inputMode="none" // Prevent standard system keyboard popups
                                    className={`w-12 h-14 text-center text-2xl font-black rounded-xl border-2 outline-none transition-all duration-200 
                                        ${isLoading ? 'bg-gray-50 border-gray-200 text-gray-400' : ''}
                                        ${isError 
                                            ? 'border-red-500 bg-red-50 text-red-500 animate-shake' 
                                            : 'border-brand-green/20 focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 bg-brand-cream/30 text-brand-green'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Virtual Numpad */}
                        <VirtualNumpad onKeyPress={handleVirtualKeyPress} />

                        {/* Loading or Error info */}
                        <div className="h-6 flex items-center justify-center text-xs font-semibold mt-4">
                            {isLoading && (
                                <div className="flex items-center gap-2 text-brand-green animate-pulse">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Đang kết nối tìm bài học...</span>
                                </div>
                            )}
                            {isError && (
                                <span className="text-red-500">Mã không chính xác, bé nhập lại nha!</span>
                            )}
                            {!isLoading && !isError && (
                                <span className="text-gray-400">Ví dụ mã: 0042, 1085...</span>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Main Trigger Button */}
            <button
                onClick={() => {
                    const nextState = !isOpen;
                    setIsOpen(nextState);
                    if (nextState) {
                        window.dispatchEvent(new CustomEvent('close-floating-chat'));
                    }
                }}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative cursor-pointer group
                    ${isOpen 
                        ? 'bg-gradient-to-tr from-brand-green to-emerald-500 text-white rotate-90' 
                        : 'bg-gradient-to-tr from-brand-yellow to-amber-400 text-brand-dark hover:from-brand-green hover:to-emerald-500 hover:text-white'
                    }`}
                title="Nhập mã bài học nhanh"
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <Sparkles className="w-6 h-6 animate-pulse" />
                )}

                {/* Pulse wave ring */}
                {!isOpen && (
                    <span className="absolute inset-0 rounded-full bg-brand-yellow/30 animate-ping opacity-75 pointer-events-none"></span>
                )}
            </button>
        </div>
    );
}
