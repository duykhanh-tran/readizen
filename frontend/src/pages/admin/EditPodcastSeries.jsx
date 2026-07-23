import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/axios.js';
import { ArrowLeft, Save, Upload, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function EditPodcastSeries() {
  const { id } = useParams(); // Edit if id exists, else Create
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    coverAsset: {
      storageProvider: 'cloudinary',
      assetUrl: '',
      assetKey: '',
      resourceType: 'image',
      format: 'jpg',
      bytes: 0
    },
    host: 'Readizen Podcast',
    targetAudience: 'Phụ huynh có con 5+',
    order: 0,
    status: 'draft',
    seoTitle: '',
    seoDescription: ''
  });

  useEffect(() => {
    if (!id) return;
    const fetchSeries = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/podcasts/admin/series/${id}`);
        const s = res.data;
        setForm({
          title: s.title || '',
          slug: s.slug || '',
          description: s.description || '',
          coverAsset: s.coverAsset || {
            storageProvider: 'cloudinary',
            assetUrl: '',
            assetKey: '',
            resourceType: 'image',
            format: 'jpg',
            bytes: 0
          },
          host: s.host || 'Readizen Podcast',
          targetAudience: s.targetAudience || 'Phụ huynh có con 5+',
          order: s.order || 0,
          status: s.status || 'draft',
          seoTitle: s.seoTitle || '',
          seoDescription: s.seoDescription || ''
        });
      } catch (err) {
        console.error('Lỗi khi tải thông tin Series:', err);
        alert('Không thể tải thông tin Series.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeries();
  }, [id]);

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // MIME type check
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedMimes.includes(file.type.toLowerCase())) {
      alert('Ảnh bìa Series không hợp lệ. Vui lòng chọn tệp ảnh JPG, PNG hoặc WEBP.');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert('Ảnh bìa Series không được vượt quá 3MB. Vui lòng chọn ảnh JPG, PNG hoặc WEBP có dung lượng nhỏ hơn.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const res = await api.post('/podcasts/admin/upload?category=cover', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm(prev => ({ ...prev, coverAsset: res.data }));
    } catch (err) {
      console.error('Lỗi khi tải ảnh bìa lên:', err);
      alert(err.response?.data?.message || 'Ảnh bìa Series không được vượt quá 3MB. Vui lòng chọn ảnh JPG, PNG hoặc WEBP có dung lượng nhỏ hơn.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert('Vui lòng nhập tên Series.');
      return;
    }
    if (!form.coverAsset || !form.coverAsset.assetUrl) {
      alert('Vui lòng chọn hoặc tải lên ảnh bìa Series.');
      return;
    }

    setIsSaving(true);
    try {
      if (id) {
        await api.put(`/podcasts/admin/series/${id}`, form);
      } else {
        await api.post('/podcasts/admin/series', form);
      }
      navigate('/admin/podcasts/series');
    } catch (err) {
      console.error('Lỗi khi lưu Series:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu Series.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-100 rounded-2xl">
        <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
        <p className="text-xs text-gray-500 font-bold mt-3">Đang tải thông tin Series...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto font-sans pb-16">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/admin/podcasts/series')}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand-green transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách Series</span>
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving || isUploading}
          className="flex items-center gap-2 bg-brand-green hover:bg-brand-dark text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{id ? 'Cập nhật Series' : 'Tạo mới Series'}</span>
        </button>
      </div>

      {/* Main Full Page Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-150 p-8 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h1 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-green" />
            {id ? 'Biên soạn Podcast Series' : 'Tạo mới Podcast Series'}
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">Biên soạn thông tin tổng quan, ảnh bìa và mô tả chi tiết cho chuỗi bài học Podcast.</p>
        </div>

        {/* Basic Title & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1.5 text-xs font-extrabold text-gray-700">Tên Series *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ví dụ: Ba mẹ bắt đầu luyện đọc cùng con"
              className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4.5 py-3 text-xs font-bold text-gray-800 outline-none focus:border-brand-green/50"
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-extrabold text-gray-700">Đường dẫn tĩnh (Slug)</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="Tự động sinh từ tên nếu để trống"
              className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4.5 py-3 text-xs font-bold text-gray-800 outline-none focus:border-brand-green/50"
            />
          </div>
        </div>

        {/* Cover Asset Upload (Max 3MB) */}
        <div>
          <label className="block mb-1 text-xs font-extrabold text-gray-700">Ảnh bìa Series (Tối đa 3MB, định dạng JPG/PNG/WEBP) *</label>
          <p className="text-[11px] text-gray-400 mb-2 font-medium">Ảnh bìa nổi bật hiển thị ở đầu trang chi tiết Series và các ô xem trước.</p>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              required
              value={form.coverAsset?.assetUrl || ''}
              onChange={(e) => setForm({
                ...form,
                coverAsset: {
                  storageProvider: 'external',
                  assetUrl: e.target.value,
                  assetKey: '',
                  resourceType: 'image',
                  format: 'jpg',
                  bytes: 0
                }
              })}
              placeholder="Dán URL ảnh hoặc nhấn Tải lên"
              className="flex-grow bg-gray-50 border border-gray-250 rounded-xl px-4.5 py-3 text-xs font-bold text-gray-800 outline-none focus:border-brand-green/50"
            />
            <label className="bg-gray-100 hover:bg-gray-200 border border-gray-250 rounded-xl px-4 flex items-center justify-center gap-1.5 cursor-pointer text-gray-600 transition h-11 shrink-0 font-bold text-xs">
              <Upload className="w-4 h-4" />
              <span>Tải lên (Max 3MB)</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleCoverUpload}
              />
            </label>
          </div>
          {isUploading && (
            <div className="text-[10px] text-brand-green flex items-center gap-1 font-bold">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Đang tải ảnh bìa lên Cloudinary...</span>
            </div>
          )}
        </div>

        {/* Expanded Description Area (min-h-[200px]) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-extrabold text-gray-700">Mô tả chi tiết Series</label>
            <span className="text-[10px] text-gray-400 font-mono">{(form.description || '').length} ký tự</span>
          </div>
          <p className="text-[11px] text-gray-400 mb-2 font-medium">Nhập nội dung chi tiết mô tả chuỗi bài học Podcast. Hỗ trợ nhiều đoạn văn xuống dòng tự nhiên.</p>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Giới thiệu đầy đủ mục tiêu, nội dung chính và phương pháp học tập của Series Podcast..."
            className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4.5 py-3 text-xs font-medium text-gray-800 outline-none focus:border-brand-green/50 min-h-[200px] resize-y leading-relaxed"
          />
        </div>

        {/* Host & Target Audience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1.5 text-xs font-extrabold text-gray-700">Host (Kênh / Người dẫn)</label>
            <input
              type="text"
              value={form.host}
              onChange={(e) => setForm({ ...form, host: e.target.value })}
              className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-3 text-xs font-bold text-gray-800"
            />
          </div>
          <div>
            <label className="block mb-1.5 text-xs font-extrabold text-gray-700">Đối tượng tiếp cận</label>
            <input
              type="text"
              value={form.targetAudience}
              onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
              className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-3 text-xs font-bold text-gray-800"
            />
          </div>
        </div>

        {/* Order & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1.5 text-xs font-extrabold text-gray-700">Thứ tự hiển thị</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
              className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-3 text-xs font-bold text-gray-800"
            />
          </div>
          <div>
            <label className="block mb-1.5 text-xs font-extrabold text-gray-700">Trạng thái xuất bản</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 cursor-pointer"
            >
              <option value="draft">Bản nháp (Draft)</option>
              <option value="published">Xuất bản (Published)</option>
            </select>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-150">
          <button
            type="button"
            onClick={() => navigate('/admin/podcasts/series')}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold text-xs transition cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSaving || isUploading}
            className="flex items-center gap-2 bg-brand-green hover:bg-brand-dark text-white px-8 py-3 rounded-xl font-black text-xs shadow-md transition cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{id ? 'Lưu thay đổi' : 'Tạo mới Series'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
