import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { AlertCircle, Lock, Mail, User as UserIcon, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMsg('Vui lòng nhập đầy đủ các trường thông tin.');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Mật khẩu phải chứa ít nhất 6 ký tự.');
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu nhập lại không khớp.');
      setIsSubmitting(false);
      return;
    }

    try {
      await register(fullName, email, password);
      setSuccessMsg('Đăng ký tài khoản thành công! Đang chuyển hướng đến trang đăng nhập...');
      
      // Auto redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message || 'Đăng ký thất bại. Email có thể đã tồn tại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-light/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch min-h-[600px] border border-gray-100">
        
        {/* Left Side: Art & Intro Banner */}
        <div className="md:col-span-5 bg-brand-green p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Overlay Grid Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-white hover:text-brand-yellow transition font-bold text-sm mb-12">
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại Trang chủ</span>
            </Link>

            <div className="flex items-center gap-2 mb-6">
              <div className="bg-white/10 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md">
                <span className="text-xl">🦉</span>
              </div>
              <span className="font-black text-2xl tracking-tight">Readizen</span>
            </div>

            <h2 className="text-3xl font-extrabold leading-tight mb-4">
              Đăng ký tài khoản học tập Readizen
            </h2>
            <p className="text-brand-light text-sm leading-relaxed opacity-90">
              Chỉ mất 30 giây để tạo tài khoản và đồng hành cùng bé luyện nói tiếng Anh chuẩn bản xứ qua mỗi câu chuyện.
            </p>
          </div>

          <div className="relative z-10 mt-auto pt-8 border-t border-white/15">
            <p className="text-xs text-brand-light/80">
              © {new Date().getFullYear()} Readizen. Small Readers, Big Citizens.
            </p>
          </div>
        </div>

        {/* Right Side: Form Area */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-white text-left">
          
          <div className="mb-6">
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              Đăng ký tài khoản mới
            </h3>
            <p className="text-sm text-gray-500">
              Tạo tài khoản học tập để kết nối trực tiếp với giáo viên hướng dẫn.
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-6 text-red-700 text-sm animate-in fade-in-50 slide-in-from-top-1 duration-200">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Lỗi đăng ký</p>
                <p className="opacity-90">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 mb-6 text-green-800 text-sm animate-in fade-in-50 slide-in-from-top-1 duration-200">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Thành công</p>
                <p className="opacity-90">{successMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Họ và Tên
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none">
                  <UserIcon className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-brand-cream/40 border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-light focus:outline-none transition text-[15px]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Địa chỉ Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="TenCuaBan@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-brand-cream/40 border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-light focus:outline-none transition text-[15px]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Mật khẩu (ít nhất 6 ký tự)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-2xl bg-brand-cream/40 border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-light focus:outline-none transition text-[15px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand-green transition cursor-pointer"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Nhập lại mật khẩu
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-2xl bg-brand-cream/40 border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-light focus:outline-none transition text-[15px]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand-green transition cursor-pointer"
                  aria-label={showConfirmPassword ? 'Ẩn mật khẩu nhập lại' : 'Hiện mật khẩu nhập lại'}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-green hover:bg-brand-dark text-white font-bold py-3.5 px-6 rounded-2xl transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-[15px] mt-4"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang đăng ký tài khoản...</span>
                </>
              ) : (
                <span>Đăng ký</span>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Đã có tài khoản học tập?{' '}
            <Link to="/login" className="text-brand-green hover:text-brand-dark font-bold underline">
              Đăng nhập tại đây
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
}
