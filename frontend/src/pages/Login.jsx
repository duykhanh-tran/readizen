import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { AlertCircle, Lock, Mail, User as UserIcon, ArrowLeft, CheckCircle2 } from 'lucide-react';
import SafeImage from '../components/shared/SafeImage.jsx';

export default function Login() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, adminLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Xác định route chuyển hướng sau khi đăng nhập thành công
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (isAdmin) {
        if (!username || !password) {
          throw new Error('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
        }
        const adminData = await adminLogin(username, password);
        setSuccessMsg('Đăng nhập quản trị thành công! Đang chuyển hướng...');
        setTimeout(() => {
          navigate('/admin');
        }, 1200);
      } else {
        if (!email || !password) {
          throw new Error('Vui lòng điền đầy đủ email và mật khẩu.');
        }
        await login(email, password);
        setSuccessMsg('Đăng nhập thành công! Đang quay lại trang trước...');
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1200);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Có lỗi xảy ra trong quá trình đăng nhập.');
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
              Cùng con bước vào thế giới Reading tiếng Anh
            </h2>
            <p className="text-brand-light text-sm leading-relaxed opacity-90">
              Đăng nhập để tiếp tục lộ trình luyện thuyết trình, xem điểm tiến trình học tập và nhận phản hồi chi tiết từ giáo viên.
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
          
          {/* Tab Selector for User/Admin */}
          <div className="flex bg-brand-cream p-1.5 rounded-xl mb-8 w-max">
            <button
              onClick={() => {
                setIsAdmin(false);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all duration-200 cursor-pointer ${
                !isAdmin 
                  ? 'bg-brand-green text-white shadow-sm' 
                  : 'text-gray-600 hover:text-brand-green'
              }`}
            >
              Học viên & Ba mẹ
            </button>
            <button
              onClick={() => {
                setIsAdmin(true);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all duration-200 cursor-pointer ${
                isAdmin 
                  ? 'bg-brand-green text-white shadow-sm' 
                  : 'text-gray-600 hover:text-brand-green'
              }`}
            >
              Quản trị viên
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              {isAdmin ? 'Đăng nhập Quản trị' : 'Đăng nhập học tập'}
            </h3>
            <p className="text-sm text-gray-500">
              {isAdmin 
                ? 'Dành cho quản lý viên kiểm duyệt forms và tin nhắn.' 
                : 'Bắt đầu hành trình đọc hiểu cùng con.'
              }
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-6 text-red-700 text-sm animate-in fade-in-50 slide-in-from-top-1 duration-200">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Lỗi đăng nhập</p>
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isAdmin ? (
              // Client Field (Email)
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
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
            ) : (
              // Admin Field (Username)
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Tên đăng nhập Admin
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none">
                    <UserIcon className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin_readizen"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-brand-cream/40 border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-light focus:outline-none transition text-[15px]"
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Mật khẩu
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-brand-cream/40 border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-light focus:outline-none transition text-[15px]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-green hover:bg-brand-dark text-white font-bold py-3.5 px-6 rounded-2xl transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-[15px]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                <span>Đăng nhập</span>
              )}
            </button>
          </form>

          {!isAdmin && (
            <p className="mt-8 text-center text-sm text-gray-500">
              Chưa có tài khoản học tập?{' '}
              <Link to="/register" className="text-brand-green hover:text-brand-dark font-bold underline">
                Đăng ký ngay tại đây
              </Link>
            </p>
          )}

        </div>

      </div>
    </div>
  );
}
