import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/axios.js';
import { ArrowLeft, Save, Upload, Loader2, AlertTriangle, Sparkles, Plus, Trash2, CheckCircle2, Film, Tv } from 'lucide-react';

export default function EditPodcastEpisode() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [seriesList, setSeriesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [form, setForm] = useState({
    seriesId: '',
    title: '',
    slug: '',
    episodeNumber: 1,
    mediaSource: 'youtube', // 'youtube' | 'tiktok' | 'upload'
    videoUrl: '',
    thumbnailAsset: {
      storageProvider: 'external',
      assetUrl: '',
      assetKey: '',
      resourceType: 'image',
      format: 'jpg',
      bytes: 0
    },
    audioAsset: null,
    videoAsset: null,
    duration: '10 phút',
    summary: '',
    relatedVocabulary: [{ term: '', meaning: '', note: '' }],
    transcript: '',
    status: 'draft',
    smartCode: '',
    seoTitle: '',
    seoDescription: ''
  });

  // Upload States
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const seriesRes = await api.get('/podcasts/admin/series');
        setSeriesList(seriesRes.data);
        if (seriesRes.data.length > 0 && !form.seriesId) {
          setForm(prev => ({ ...prev, seriesId: seriesRes.data[0]._id }));
        }

        if (id) {
          const episodeRes = await api.get(`/podcasts/admin/episodes/${id}`);
          const ep = episodeRes.data;
          setForm({
            seriesId: ep.seriesId?._id || ep.seriesId || '',
            title: ep.title || '',
            slug: ep.slug || '',
            episodeNumber: ep.episodeNumber || 1,
            mediaSource: ep.mediaSource || 'youtube',
            videoUrl: ep.videoUrl || '',
            thumbnailAsset: ep.thumbnailAsset || {
              storageProvider: 'external',
              assetUrl: '',
              assetKey: '',
              resourceType: 'image',
              format: 'jpg',
              bytes: 0
            },
            audioAsset: ep.audioAsset || null,
            videoAsset: ep.videoAsset || null,
            duration: ep.duration || '10 phút',
            summary: ep.summary || '',
            relatedVocabulary: ep.relatedVocabulary?.length ? ep.relatedVocabulary : [{ term: '', meaning: '', note: '' }],
            transcript: ep.transcript || '',
            status: ep.status || 'draft',
            smartCode: ep.smartCode || '',
            seoTitle: ep.seoTitle || '',
            seoDescription: ep.seoDescription || ''
          });
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu tập Podcast:', err);
        setError('Không thể tải thông tin khởi tạo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  // Derived auto format preview helper
  const getAutoDetectedFormat = () => {
    const url = form.videoUrl.toLowerCase();
    if (form.mediaSource === 'tiktok' || url.includes('/shorts/')) {
      return { label: 'Shorts (9:16 - Khung dọc)', isShort: true };
    }
    return { label: 'Video dài (16:9 - Khung ngang)', isShort: false };
  };

  // Upload Handlers
  const handleUploadFile = async (e, category) => {
    const file = e.target.files[0];
    if (!file) return;

    if (category === 'thumbnail') {
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!allowedMimes.includes(file.type.toLowerCase())) {
        alert('Ảnh đại diện không hợp lệ. Vui lòng chọn tệp ảnh JPG, PNG hoặc WEBP.');
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        alert('Ảnh đại diện không được vượt quá 3MB. Vui lòng chọn ảnh JPG, PNG hoặc WEBP có dung lượng nhỏ hơn.');
        return;
      }
    }

    if (category === 'audio' && file.size > 20 * 1024 * 1024) {
      alert('Dung lượng tệp Audio MP3 không được vượt quá 20MB.');
      return;
    }
    if (category === 'video' && file.size > 50 * 1024 * 1024) {
      alert('Dung lượng tệp Video trực tiếp không được vượt quá 50MB. Vui lòng ưu tiên dùng liên kết YouTube hoặc TikTok.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    if (category === 'thumbnail') setIsUploadingThumb(true);
    if (category === 'audio') setIsUploadingAudio(true);
    if (category === 'video') setIsUploadingVideo(true);

    try {
      const res = await api.post(`/podcasts/admin/upload?category=${category}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const uploadedAsset = res.data;

      if (category === 'thumbnail') {
        setForm(prev => ({ ...prev, thumbnailAsset: uploadedAsset }));
      } else if (category === 'audio') {
        setForm(prev => ({ ...prev, audioAsset: uploadedAsset }));
      } else if (category === 'video') {
        setForm(prev => ({ ...prev, videoAsset: uploadedAsset, videoUrl: uploadedAsset.assetUrl }));
      }
    } catch (err) {
      console.error(`Lỗi khi tải tệp ${category} lên:`, err);
      alert(err.response?.data?.message || 'Không thể tải tệp lên máy chủ.');
    } finally {
      if (category === 'thumbnail') setIsUploadingThumb(false);
      if (category === 'audio') setIsUploadingAudio(false);
      if (category === 'video') setIsUploadingVideo(false);
    }
  };

  // Related Vocabulary Handlers
  const handleVocabChange = (index, field, value) => {
    const updated = [...form.relatedVocabulary];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, relatedVocabulary: updated });
  };

  const handleAddVocabRow = () => {
    setForm({
      ...form,
      relatedVocabulary: [...form.relatedVocabulary, { term: '', meaning: '', note: '' }]
    });
  };

  const handleRemoveVocabRow = (index) => {
    const updated = form.relatedVocabulary.filter((_, i) => i !== index);
    setForm({
      ...form,
      relatedVocabulary: updated.length > 0 ? updated : [{ term: '', meaning: '', note: '' }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.seriesId) {
      alert('Vui lòng chọn Podcast Series.');
      return;
    }
    if (!form.thumbnailAsset || !form.thumbnailAsset.assetUrl) {
      alert('Vui lòng chọn hoặc tải lên ảnh đại diện tập.');
      return;
    }
    if (!form.videoUrl) {
      alert('Vui lòng nhập đường dẫn Video (YouTube, TikTok) hoặc tải video lên.');
      return;
    }

    setIsSaving(true);
    try {
      if (id) {
        await api.put(`/podcasts/admin/episodes/${id}`, form);
      } else {
        await api.post('/podcasts/admin/episodes', form);
      }
      navigate('/admin/podcasts/episodes');
    } catch (err) {
      console.error('Lỗi khi lưu tập Podcast:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu tập Podcast.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-100 rounded-2xl">
        <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
        <p className="text-xs text-gray-500 font-bold mt-3">Đang tải thông tin biên soạn...</p>
      </div>
    );
  }

  const autoDetected = getAutoDetectedFormat();

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto font-sans pb-16">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/admin/podcasts/episodes')}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand-green transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách tập</span>
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving || isUploadingThumb || isUploadingAudio || isUploadingVideo}
          className="flex items-center gap-2 bg-brand-green hover:bg-brand-dark text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{id ? 'Cập nhật tập Podcast' : 'Xuất bản tập mới'}</span>
        </button>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Thông tin cơ bản */}
        <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-green" />
            Thông tin tập Podcast
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-xs font-extrabold text-gray-700">Thuộc Podcast Series *</label>
              <select
                required
                value={form.seriesId}
                onChange={(e) => setForm({ ...form, seriesId: e.target.value })}
                className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 outline-none focus:border-brand-green/50 cursor-pointer"
              >
                <option value="" disabled>-- Chọn Series --</option>
                {seriesList.map(s => (
                  <option key={s._id} value={s._id}>{s.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-extrabold text-gray-700">Số tập (Episode #) *</label>
              <input
                type="number"
                required
                min="1"
                value={form.episodeNumber}
                onChange={(e) => setForm({ ...form, episodeNumber: parseInt(e.target.value) || 1 })}
                className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 outline-none focus:border-brand-green/50"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-extrabold text-gray-700">Tiêu đề tập Podcast *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ví dụ: Vì sao trẻ nên luyện đọc tiếng Anh bằng truyện ngắn?"
              className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4.5 py-3 text-xs font-bold text-gray-800 outline-none focus:border-brand-green/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Smart Code Input */}
            <div>
              <label className="block mb-1.5 text-xs font-bold text-amber-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Smart Code (Mã 4 chữ số)
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="Ví dụ: 9142 (Tự tạo nếu rỗng)"
                value={form.smartCode || ''}
                onChange={(e) => setForm({ ...form, smartCode: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                className="w-full bg-amber-50/30 border border-amber-300 rounded-xl px-4 py-3 text-xs font-mono font-extrabold text-amber-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/35"
              />
            </div>

            {/* Automatic Detection Badge Notice */}
            <div>
              <label className="block mb-1.5 text-xs font-extrabold text-gray-700">Kiểu hiển thị</label>
              <div className="bg-brand-light/35 border border-brand-green/20 rounded-xl p-3 flex items-center justify-between text-xs font-bold text-brand-green">
                <span className="flex items-center gap-1.5">
                  {autoDetected.isShort ? <Tv className="w-4 h-4" /> : <Film className="w-4 h-4" />}
                  {autoDetected.label}
                </span>
                <span className="text-[10px] bg-brand-green text-white px-2 py-0.5 rounded font-black uppercase">Tự động</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Nguồn Video (YouTube / TikTok / Upload) */}
        <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-green" />
            Nguồn Video Phát
          </h3>

          {/* Warning Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs font-semibold leading-relaxed">
              <span className="font-extrabold uppercase block text-amber-800 mb-0.5">Quy tắc lưu trữ Media:</span>
              Nên sử dụng liên kết <strong>YouTube</strong> hoặc <strong>TikTok</strong>. Chỉ tải trực tiếp video có dung lượng nhỏ (dưới 50MB) khi thật sự cần thiết.
            </div>
          </div>

          <div>
            <label className="block mb-2 text-xs font-extrabold text-gray-700">Phương thức nguồn phát (Ưu tiên theo thứ tự):</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className={`flex items-center gap-2.5 p-3.5 rounded-xl border-2 cursor-pointer transition ${form.mediaSource === 'youtube' ? 'border-red-500 bg-red-50/40 text-red-700 font-extrabold' : 'border-gray-200 text-gray-700 font-bold'}`}>
                <input
                  type="radio"
                  name="mediaSource"
                  value="youtube"
                  checked={form.mediaSource === 'youtube'}
                  onChange={(e) => setForm({ ...form, mediaSource: e.target.value })}
                  className="accent-red-500"
                />
                <span>1. YouTube (Khuyên dùng)</span>
              </label>

              <label className={`flex items-center gap-2.5 p-3.5 rounded-xl border-2 cursor-pointer transition ${form.mediaSource === 'tiktok' ? 'border-zinc-800 bg-zinc-100 text-zinc-900 font-extrabold' : 'border-gray-200 text-gray-700 font-bold'}`}>
                <input
                  type="radio"
                  name="mediaSource"
                  value="tiktok"
                  checked={form.mediaSource === 'tiktok'}
                  onChange={(e) => setForm({ ...form, mediaSource: e.target.value })}
                  className="accent-zinc-800"
                />
                <span>2. TikTok</span>
              </label>

              <label className={`flex items-center gap-2.5 p-3.5 rounded-xl border-2 cursor-pointer transition ${form.mediaSource === 'upload' ? 'border-blue-500 bg-blue-50/40 text-blue-700 font-extrabold' : 'border-gray-200 text-gray-700 font-bold'}`}>
                <input
                  type="radio"
                  name="mediaSource"
                  value="upload"
                  checked={form.mediaSource === 'upload'}
                  onChange={(e) => setForm({ ...form, mediaSource: e.target.value })}
                  className="accent-blue-500"
                />
                <span>3. Tải lên máy (Dự phòng)</span>
              </label>
            </div>
          </div>

          {form.mediaSource === 'youtube' && (
            <div>
              <label className="block mb-1.5 text-xs font-extrabold text-gray-700">Liên kết Video YouTube *</label>
              <input
                type="text"
                required
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                placeholder="Dán đường dẫn YouTube (ví dụ: https://www.youtube.com/watch?v=... hoặc /shorts/...)"
                className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4.5 py-3 text-xs font-bold text-gray-800 outline-none focus:border-red-500"
              />
            </div>
          )}

          {form.mediaSource === 'tiktok' && (
            <div>
              <label className="block mb-1.5 text-xs font-extrabold text-gray-700">Liên kết Video TikTok *</label>
              <input
                type="text"
                required
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                placeholder="Dán đường dẫn TikTok (ví dụ: https://www.tiktok.com/@user/video/123456789)"
                className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4.5 py-3 text-xs font-bold text-gray-800 outline-none focus:border-zinc-800"
              />
            </div>
          )}

          {form.mediaSource === 'upload' && (
            <div>
              <label className="block mb-1.5 text-xs font-extrabold text-gray-700">Tệp Video MP4 (Max 50MB) *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  placeholder="URL Video tải lên"
                  className="flex-grow bg-gray-50 border border-gray-250 rounded-xl px-4.5 py-3 text-xs font-bold text-gray-800 outline-none"
                />
                <label className="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-xl px-4 flex items-center justify-center gap-1.5 cursor-pointer font-bold transition h-11 shrink-0 text-xs">
                  <Upload className="w-4 h-4" />
                  <span>Tải video (Max 50MB)</span>
                  <input
                    type="file"
                    accept="video/mp4,video/mov,video/avi"
                    className="hidden"
                    onChange={(e) => handleUploadFile(e, 'video')}
                  />
                </label>
              </div>
              {isUploadingVideo && (
                <div className="text-[10px] text-blue-600 flex items-center gap-1 font-bold mt-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang tải video lên Cloudinary...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 3: Upload Thumbnail (Max 3MB) & Audio (Max 20MB) */}
        <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-green" />
            Tệp Tải Phụ Tùng (Thumbnail Max 3MB & Audio Max 20MB)
          </h3>

          <div>
            <label className="block mb-1.5 text-xs font-extrabold text-gray-700">Ảnh đại diện tập (Max 3MB, định dạng JPG/PNG/WEBP) *</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                required
                value={form.thumbnailAsset?.assetUrl || ''}
                onChange={(e) => setForm({
                  ...form,
                  thumbnailAsset: {
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
                <span>Tải ảnh (Max 3MB)</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleUploadFile(e, 'thumbnail')}
                />
              </label>
            </div>
            {isUploadingThumb && (
              <div className="text-[10px] text-brand-green flex items-center gap-1 font-bold">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang tải ảnh đại diện...</span>
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-extrabold text-gray-700">Tệp Audio MP3 đính kèm (Max 20MB) (Tùy chọn)</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={form.audioAsset?.assetUrl || ''}
                onChange={(e) => setForm({
                  ...form,
                  audioAsset: e.target.value ? {
                    storageProvider: 'external',
                    assetUrl: e.target.value,
                    assetKey: '',
                    resourceType: 'video',
                    format: 'mp3',
                    bytes: 0
                  } : null
                })}
                placeholder="Dán URL MP3 hoặc tải lên tệp audio lời giảng"
                className="flex-grow bg-gray-50 border border-gray-250 rounded-xl px-4.5 py-3 text-xs font-bold text-gray-800 outline-none focus:border-brand-green/50"
              />
              <label className="bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-xl px-4 flex items-center justify-center gap-1.5 cursor-pointer font-bold transition h-11 shrink-0 text-xs">
                <Upload className="w-4 h-4" />
                <span>Tải MP3</span>
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => handleUploadFile(e, 'audio')}
                />
              </label>
            </div>
            {isUploadingAudio && (
              <div className="text-[10px] text-amber-600 flex items-center gap-1 font-bold">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang tải tệp MP3...</span>
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Từ Mới Liên Quan (relatedVocabulary) */}
        <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-green" />
              Từ Mới Liên Quan (relatedVocabulary)
            </h3>
            <button
              type="button"
              onClick={handleAddVocabRow}
              className="inline-flex items-center gap-1 text-xs font-black text-brand-green hover:underline cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm từ mới</span>
            </button>
          </div>

          <p className="text-[11px] text-gray-500 font-medium">Nhập các từ vựng/cụm từ quan trọng trong tập giúp bé học tập mở rộng.</p>

          <div className="space-y-3">
            {form.relatedVocabulary.map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={item.term}
                    onChange={(e) => handleVocabChange(idx, 'term', e.target.value)}
                    placeholder="Từ/Cụm từ tiếng Anh *"
                    className="w-full bg-white border border-gray-250 rounded-lg px-3 py-2 text-xs font-bold text-gray-800 outline-none"
                  />
                </div>
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={item.meaning}
                    onChange={(e) => handleVocabChange(idx, 'meaning', e.target.value)}
                    placeholder="Nghĩa tiếng Việt (Tùy chọn)"
                    className="w-full bg-white border border-gray-250 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 outline-none"
                  />
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    value={item.note}
                    onChange={(e) => handleVocabChange(idx, 'note', e.target.value)}
                    placeholder="Ghi chú/Ví dụ (Tùy chọn)"
                    className="w-full bg-white border border-gray-250 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 outline-none"
                  />
                </div>
                <div className="sm:col-span-1 text-right">
                  <button
                    type="button"
                    onClick={() => handleRemoveVocabRow(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Khung Nhập Rộng Cho Summary & Transcript */}
        <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-green" />
            Nội dung Biên soạn Chi tiết
          </h3>

          {/* Summary Large Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-extrabold text-gray-700">Tóm tắt nội dung tập (Summary)</label>
              <span className="text-[10px] text-gray-400 font-mono">{(form.summary || '').length} ký tự</span>
            </div>
            <textarea
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="Tóm tắt nội dung bài giảng giúp ba mẹ dễ nắm bắt. Hỗ trợ xuống dòng..."
              className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4.5 py-3 text-xs font-medium text-gray-800 outline-none focus:border-brand-green/50 min-h-[180px] resize-y leading-relaxed"
            />
          </div>

          {/* Transcript Large Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-extrabold text-gray-700">Lời thoại / Bản ghi bài học (Transcript)</label>
              <span className="text-[10px] text-gray-400 font-mono">{(form.transcript || '').length} ký tự</span>
            </div>
            <textarea
              value={form.transcript}
              onChange={(e) => setForm({ ...form, transcript: e.target.value })}
              placeholder="Nhập toàn bộ nội dung lời thoại chi tiết bài giảng. Xuống dòng tự nhiên..."
              className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4.5 py-3 text-xs font-medium text-gray-800 outline-none focus:border-brand-green/50 min-h-[350px] resize-y leading-relaxed font-mono"
            />
          </div>
        </div>

        {/* Submit Actions Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/admin/podcasts/episodes')}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold text-xs transition cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSaving || isUploadingThumb || isUploadingAudio || isUploadingVideo}
            className="flex items-center gap-2 bg-brand-green hover:bg-brand-dark text-white px-8 py-3 rounded-xl font-black text-xs shadow-md transition cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{id ? 'Lưu thay đổi' : 'Tạo mới tập Podcast'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
