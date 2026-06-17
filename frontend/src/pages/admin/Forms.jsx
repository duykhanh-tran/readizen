import React, { useState, useEffect } from 'react';
import api from '../../services/axios.js';
import { FileText, Search, Filter, Phone, CheckCircle2, AlertCircle, RefreshCw, Mail } from 'lucide-react';

export default function Forms() {
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch all forms from API
  const fetchForms = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await api.get('/forms/all');
      setForms(response.data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Không thể tải danh sách form đăng ký.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  // Update form status handler
  const handleStatusChange = async (id, newStatus) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const response = await api.put(`/forms/${id}/status`, { status: newStatus });
      setSuccessMsg('Cập nhật trạng thái xử lý thành công!');
      
      // Update locally
      setForms(forms.map(form => 
        form._id === id ? { ...form, status: newStatus } : form
      ));

      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Cập nhật trạng thái thất bại.');
    }
  };

  const statusMap = {
    pending: { label: 'Chờ liên hệ', color: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
    contacted: { label: 'Đang tư vấn', color: 'bg-blue-50 text-blue-800 border-blue-200' },
    canceled: { label: 'Đã hủy', color: 'bg-red-50 text-red-800 border-red-200' }
  };

  const filteredForms = forms.filter(form => {
    const fullName = form.userId?.fullName || '';
    const phone = form.phone || '';
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || form.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-sans text-left">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Quản lý Form Đăng Ký</h2>
          <p className="text-sm text-gray-500 mt-1">Kết nối dữ liệu thực để giám sát và cập nhật trạng thái tư vấn trực tiếp từ hệ thống.</p>
        </div>
        <button
          onClick={fetchForms}
          disabled={isLoading}
          className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold px-4 py-2 rounded-xl text-xs transition duration-200 cursor-pointer shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="bg-red-50 text-red-700 text-xs p-4 rounded-xl border border-red-200 flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 text-green-700 text-xs p-4 rounded-xl border border-green-200 flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Tìm theo tên học viên hoặc SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#F4F6F8]/50 border border-gray-200 focus:border-brand-green focus:outline-none text-xs transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            <Filter className="w-4 h-4" />
            <span>Lọc trạng thái:</span>
          </div>

          <div className="flex bg-[#F4F6F8] p-1 rounded-xl border border-gray-200">
            {['All', 'pending', 'contacted', 'canceled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  statusFilter === status
                    ? 'bg-brand-green text-white shadow-sm'
                    : 'text-gray-600 hover:text-brand-green'
                }`}
              >
                {status === 'All' ? 'Tất cả' : statusMap[status].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Forms Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-gray-400 text-xs">
            <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <span>Đang đồng bộ dữ liệu từ Server...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100 uppercase tracking-wider">
                  <th className="p-4 pl-6 w-1/4">Học viên / Phụ huynh</th>
                  <th className="p-4 w-1/5">Số điện thoại</th>
                  <th className="p-4 w-1/6">Khóa học đăng ký</th>
                  <th className="p-4 w-1/4">Nội dung ghi chú</th>
                  <th className="p-4 w-1/6">Trạng thái</th>
                  <th className="p-4 pr-6 text-center w-1/6">Cập nhật</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredForms.length > 0 ? (
                  filteredForms.map((form) => (
                    <tr key={form._id} className="hover:bg-gray-50/50 transition align-top">
                      <td className="p-4 pl-6 whitespace-nowrap">
                        <div className="font-bold text-gray-800 text-sm">
                          {form.userId?.fullName || 'Khách vãng lai'}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          <span>{form.userId?.email || 'N/A'}</span>
                        </div>
                        <div className="text-[9px] text-gray-400 font-mono mt-1">
                          Gửi: {new Date(form.createdAt).toLocaleString('vi-VN')}
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-gray-700 font-bold">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-mono">{form.phone}</span>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1 bg-brand-cream px-2 py-0.5 rounded border border-gray-100 w-max font-semibold">
                          {form.currentLevel}
                        </div>
                      </td>
                      <td className="p-4 text-gray-700 font-bold whitespace-nowrap">
                        {form.courseInterest}
                      </td>
                      <td className="p-4 min-w-[200px]">
                        <p className="text-gray-500 leading-relaxed max-w-xs break-words whitespace-pre-line text-[11px]">
                          {form.message || 'Không có ghi chú thêm.'}
                        </p>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusMap[form.status].color}`}>
                          {statusMap[form.status].label}
                        </span>
                      </td>
                      <td className="p-4 pr-6 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <select
                            value={form.status}
                            onChange={(e) => handleStatusChange(form._id, e.target.value)}
                            className="text-[11px] bg-[#F4F6F8] border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:border-brand-green font-bold text-gray-700 cursor-pointer"
                          >
                            <option value="pending">Chờ liên hệ</option>
                            <option value="contacted">Đang tư vấn</option>
                            <option value="canceled">Đã hủy</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-gray-400 bg-gray-50/50">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="font-medium text-xs">Không tìm thấy yêu cầu tư vấn nào phù hợp.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
