import React, { useState, useEffect } from 'react';
import api from '../../services/axios.js';
import { toast } from 'react-hot-toast';
import { Hash, Save, AlertTriangle, RefreshCw, HelpCircle } from 'lucide-react';

export default function ManageSmartCode() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/smart-code/config');
      // Ensure we sort them in a fixed order for UI consistency
      const sorted = response.data.sort((a, b) => {
        const order = { 'AlphabetLesson': 1, 'Lesson': 2, 'VideoLesson': 3 };
        return order[a.resourceType] - order[b.resourceType];
      });
      setConfigs(sorted);
    } catch (error) {
      console.error('Error fetching Smart Code configs:', error);
      toast.error('Không thể tải cấu hình Smart Code.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrefixChange = (index, value) => {
    // Only allow single digit 0-9
    if (value !== '' && !/^[0-9]$/.test(value)) return;
    
    const updated = [...configs];
    updated[index].prefix = value;
    setConfigs(updated);
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    
    // Validate empty values
    const hasEmpty = configs.some(c => c.prefix === '');
    if (hasEmpty) {
      toast.error('Tất cả các tiền tố không được để trống.');
      return;
    }

    // Validate uniqueness of prefixes
    const prefixes = configs.map(c => c.prefix);
    const uniquePrefixes = new Set(prefixes);
    if (uniquePrefixes.size !== prefixes.length) {
      toast.error('Các tiền tố không được trùng nhau.');
      return;
    }

    setShowConfirm(true);
  };

  const confirmSave = async () => {
    try {
      setSaving(true);
      setShowConfirm(false);
      const response = await api.put('/admin/smart-code/config', { configs });
      toast.success(response.data.message || 'Cấu hình và dữ liệu đã được cập nhật thành công!');
      fetchConfigs();
    } catch (error) {
      console.error('Error saving Smart Code config:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu cấu hình.');
    } finally {
      setSaving(false);
    }
  };

  const getFriendlyName = (type) => {
    switch (type) {
      case 'AlphabetLesson':
        return 'Bảng chữ cái (Alphabet)';
      case 'Lesson':
        return 'Bài học đọc AI (Reading)';
      case 'VideoLesson':
        return 'Video bài giảng (Lecture)';
      default:
        return type;
    }
  };

  const getDescription = (type) => {
    switch (type) {
      case 'AlphabetLesson':
        return 'Tiền tố chữ số dùng để truy cập các bài học thuộc bảng chữ cái tiếng Anh.';
      case 'Lesson':
        return 'Tiền tố chữ số dùng để truy cập các bài học đọc luyện phát âm AI.';
      case 'VideoLesson':
        return 'Tiền tố chữ số dùng để truy cập các video bài giảng và bài tập.';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-brand-green" />
        <span className="ml-2 font-bold text-gray-500">Đang tải cấu hình Smart Code...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">
            <Hash className="h-6 w-6 text-brand-green" />
            Cấu hình Tiền tố Smart Code
          </h2>
          <p className="text-xs lg:text-sm text-gray-500 mt-1">
            Thiết lập đầu số đại diện cho từng loại bài học để tạo ra dải mã Smart Code an toàn, không trùng lặp.
          </p>
        </div>
      </div>

      {/* Main Config Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Lưu ý quan trọng</span>
        </div>
        <div className="p-6 border-b border-gray-100">
          <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
            Thay đổi chữ số tiền tố sẽ kích hoạt hệ thống **tự động chuyển đổi toàn bộ mã Smart Code hiện tại** của phân mục đó trong cơ sở dữ liệu.
            Học sinh sẽ phải sử dụng đầu số mới khi nhập mã Smart Code. Vui lòng cân nhắc kỹ trước khi chỉnh sửa.
          </p>
        </div>

        <form onSubmit={handleSaveClick} className="p-6 lg:p-8 space-y-6">
          <div className="space-y-4">
            {configs.map((config, index) => (
              <div 
                key={config._id || config.resourceType} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-150 bg-gray-50/20 gap-4 hover:bg-gray-50/50 transition-all duration-200"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-800 text-sm lg:text-base">
                    {getFriendlyName(config.resourceType)}
                  </h4>
                  <p className="text-xs text-gray-500 max-w-md">
                    {getDescription(config.resourceType)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400">Tiền tố đầu số:</span>
                  <input
                    type="text"
                    maxLength={1}
                    value={config.prefix}
                    onChange={(e) => handlePrefixChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-lg font-black text-gray-800 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green shadow-sm"
                    required
                  />
                  <div className="h-10 w-24 bg-gray-150 rounded-xl flex items-center justify-center border border-gray-200 text-xs font-bold text-gray-400">
                    {config.prefix || 'X'}001 - {config.prefix || 'X'}999
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="
                inline-flex items-center gap-2
                rounded-xl bg-brand-green px-6 py-3
                text-sm font-black text-white
                shadow-[0_6px_16px_rgba(34,130,76,0.22)]
                transition-all duration-200
                hover:-translate-y-0.5 hover:bg-brand-dark
                hover:shadow-[0_9px_22px_rgba(34,130,76,0.3)]
                focus:outline-none focus:ring-2 focus:ring-brand-green/30
                disabled:opacity-50 disabled:pointer-events-none
                cursor-pointer
              "
            >
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Đang đồng bộ dữ liệu...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Lưu cấu hình
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-150 p-6 space-y-4 animate-in fade-in zoom-in duration-200 text-left">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-lg font-black">Xác nhận thay đổi cấu hình</h3>
            </div>
            
            <p className="text-sm text-gray-600 leading-relaxed">
              Bạn có chắc chắn muốn thay đổi tiền tố Smart Code? Hệ thống sẽ cập nhật lại toàn bộ bài học và video cũ sang cấu trúc mã mới. Học sinh phải sử dụng đầu số mới để truy cập.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={confirmSave}
                className="px-4 py-2 bg-brand-green hover:bg-brand-dark text-white font-bold rounded-xl text-xs shadow-md transition"
              >
                Tôi đồng ý và tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
