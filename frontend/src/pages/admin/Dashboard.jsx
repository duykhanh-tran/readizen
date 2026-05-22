import React, { useState, useEffect } from 'react';
import api from '../../services/axios.js';
import { FileText, MessageSquare, Users, TrendingUp, Calendar, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentForms, setRecentForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      // Gọi song song hai API thống kê và liên hệ gần đây
      const [statsRes, formsRes] = await Promise.all([
        api.get('/admin/dashboard-stats'),
        api.get('/forms/all')
      ]);

      setStats(statsRes.data);
      // Lấy tối đa 4 form gần đây nhất
      setRecentForms(formsRes.data.slice(0, 4));
    } catch (err) {
      setErrorMsg('Không thể đồng bộ dữ liệu thống kê từ hệ thống.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    contacted: 'bg-blue-50 text-blue-800 border-blue-200',
    canceled: 'bg-red-50 text-red-800 border-red-200',
  };

  const statusLabels = {
    pending: 'Chờ liên hệ',
    contacted: 'Đang tư vấn',
    canceled: 'Đã hủy',
  };

  return (
    <div className="space-y-8 font-sans text-left">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Bảng điều khiển quản trị</h2>
          <p className="text-sm text-gray-500 mt-1">Giám sát các hoạt động đăng ký tư vấn và hỗ trợ học tập tại thời điểm thực tế.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold px-4 py-2 rounded-xl text-xs transition duration-200 cursor-pointer shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 text-xs font-semibold text-gray-600 w-max">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Hôm nay: {new Date().toLocaleDateString('vi-VN')}</span>
          </div>
        </div>
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="bg-red-50 text-red-700 text-xs p-4 rounded-xl border border-red-200 flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Users */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between">
          <div className="space-y-4">
            <p className="text-sm font-bold text-gray-500">Học Viên Đăng Ký</p>
            {isLoading ? (
              <div className="h-9 w-20 bg-gray-100 animate-pulse rounded-lg"></div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900">{stats?.totalUsers || 0}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 bg-green-50 text-green-700">
                  <TrendingUp className="w-3 h-3" />
                  +100% active
                </span>
              </div>
            )}
          </div>
          <div className="p-3.5 rounded-xl border bg-yellow-50 text-yellow-600 border-yellow-100">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Forms */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between">
          <div className="space-y-4">
            <p className="text-sm font-bold text-gray-500">Form Yêu Cầu Tư Vấn</p>
            {isLoading ? (
              <div className="h-9 w-20 bg-gray-100 animate-pulse rounded-lg"></div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900">{stats?.totalForms || 0}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 bg-blue-50 text-blue-700">
                  <FileText className="w-3 h-3" />
                  Đã nhận
                </span>
              </div>
            )}
          </div>
          <div className="p-3.5 rounded-xl border bg-blue-50 text-blue-600 border-blue-100">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Pending chats/forms */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between">
          <div className="space-y-4">
            <p className="text-sm font-bold text-gray-500">Đang Chờ Tư Vấn</p>
            {isLoading ? (
              <div className="h-9 w-20 bg-gray-100 animate-pulse rounded-lg"></div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#D97706]">{stats?.pendingForms || 0}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 bg-yellow-50 text-[#D97706]">
                  Chờ xử lý
                </span>
              </div>
            )}
          </div>
          <div className="p-3.5 rounded-xl border bg-green-50 text-green-600 border-green-100">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Bottom Grid: Forms & Chats summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Registration Forms */}
        <div className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-black text-gray-900">Đăng ký tư vấn gần đây</h3>
              <p className="text-xs text-gray-500 mt-0.5">Danh sách các phụ huynh gửi form liên hệ tư vấn học tập.</p>
            </div>
            <Link to="/admin/forms" className="text-brand-green hover:text-brand-dark font-bold text-xs flex items-center gap-1.5 transition">
              <span>Xem tất cả</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto flex-grow">
            {isLoading ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <span>Đang tải thông tin form...</span>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100 uppercase tracking-wider">
                    <th className="p-4 pl-6">Họ Tên</th>
                    <th className="p-4">Số Điện Thoại</th>
                    <th className="p-4">Khóa Học</th>
                    <th className="p-4">Trình Độ Con</th>
                    <th className="p-4">Trạng Thái</th>
                    <th className="p-4 pr-6 text-right">Gửi Lúc</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentForms.length > 0 ? (
                    recentForms.map((form) => (
                      <tr key={form._id} className="hover:bg-gray-50/50 transition">
                        <td className="p-4 pl-6 font-bold text-gray-800">
                          {form.userId?.fullName || 'Khách vãng lai'}
                        </td>
                        <td className="p-4 text-gray-600 font-mono">{form.phone}</td>
                        <td className="p-4 text-gray-600 font-semibold">{form.courseInterest}</td>
                        <td className="p-4 text-gray-500">{form.currentLevel}</td>
                        <td className="p-4">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[form.status] || 'bg-gray-100 border-gray-200 text-gray-800'}`}>
                            {statusLabels[form.status] || form.status}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right text-gray-400 font-mono">
                          {new Date(form.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-400">
                        Chưa nhận được form đăng ký nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column: Chat summary / Help guide */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-black text-gray-900 mb-2 text-sm">Hỗ trợ nhanh</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Hệ thống sử dụng cơ chế Socket.io để chat trực tiếp thời gian thực với học viên khi họ mở widget chat trên website.
            </p>
            
            <div className="space-y-3">
              <div className="flex gap-3 items-start p-3 bg-brand-cream/50 rounded-xl border border-brand-green/10 text-xs">
                <span className="text-lg mt-0.5">💡</span>
                <div>
                  <h4 className="font-bold text-xs text-brand-dark mb-0.5">Kiểm tra Form tư vấn</h4>
                  <p className="text-[11px] text-gray-500 leading-normal">
                    Hãy gọi điện hoặc phản hồi nhanh cho phụ huynh theo số điện thoại ghi nhận được.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start p-3 bg-brand-cream/50 rounded-xl border border-brand-green/10 text-xs">
                <span className="text-lg mt-0.5">💬</span>
                <div>
                  <h4 className="font-bold text-xs text-brand-dark mb-0.5">Giải đáp tin nhắn chờ</h4>
                  <p className="text-[11px] text-gray-500 leading-normal">
                    Chuyển sang tab Hỗ trợ Chat để xử lý các câu hỏi phát sinh trực tiếp từ website.
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/admin/chat"
              className="mt-6 w-full bg-brand-green hover:bg-brand-dark text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition duration-200"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Bắt đầu Chat ngay</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
