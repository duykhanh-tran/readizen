import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/axios.js';
import { ArrowLeft, Save, Upload, Loader2, AlertCircle, Video, Image, FileText, Eye, EyeOff } from 'lucide-react';

export default function EditVideoLesson() {
  const { id } = useParams(); // Nếu có id -> Edit Mode, ngược lại -> Create Mode
  const navigate = useNavigate();
  const isEditMode = !!id;

  // States
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [topicId, setTopicId] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [videoType, setVideoType] = useState('youtube');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [order, setOrder] = useState(0);
  const [status, setStatus] = useState('draft');

  // Uploading States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTarget, setUploadTarget] = useState(''); // 'video' | 'thumbnail'

  // Fetch topics and details if in edit mode
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Tải danh mục chủ đề trước
        const topicsRes = await api.get('/videos/topics');
        setTopics(topicsRes.data);

        if (isEditMode) {
          const lessonRes = await api.get(`/videos/lesson/${id}`);
          const lesson = lessonRes.data;
          
          setTopicId(lesson.topicId?._id || lesson.topicId || '');
          setTitle(lesson.title);
          setSlug(lesson.slug || '');
          setVideoType(lesson.videoType || 'youtube');
          setAspectRatio(lesson.aspectRatio || '16:9');
          setVideoUrl(lesson.videoUrl || '');
          setThumbnail(lesson.thumbnail || '');
          setOrder(lesson.order || 0);
          setStatus(lesson.status || 'draft');
        } else {
          // Gán mặc định chủ đề đầu tiên nếu có
          if (topicsRes.data.length > 0) {
            setTopicId(topicsRes.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Lỗi khi tải thông tin bài học video:', err);
        setError('Không thể tải dữ liệu cấu hình bài học video.');
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, [id, isEditMode]);

  // Upload Handler
  const handleFileUpload = async (e, target) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setUploadTarget(target);
    try {
      const res = await api.post('/videos/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const uploadedUrl = res.data.url;
      
      if (target === 'thumbnail') {
        setThumbnail(uploadedUrl);
      } else if (target === 'video') {
        setVideoUrl(uploadedUrl);
      }
    } catch (err) {
      console.error('Lỗi tải tệp lên:', err);
      alert('Không thể tải tệp lên Cloudinary.');
    } finally {
      setIsUploading(false);
      setUploadTarget('');
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topicId) {
      setError('Vui lòng chọn chủ đề cho bài học video này.');
      return;
    }
    if (!title.trim() || !videoUrl.trim()) {
      setError('Tiêu đề và đường dẫn video là các trường bắt buộc.');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        topicId,
        title,
        slug: slug.trim() || undefined,
        videoType,
        aspectRatio,
        videoUrl,
        thumbnail,
        order: Number(order) || 0,
        status
      };

      if (isEditMode) {
        await api.put(`/videos/admin/lessons/${id}`, payload);
      } else {
        await api.post('/videos/admin/lessons', payload);
      }

      navigate('/admin/videos');
    } catch (err) {
      console.error('Lỗi lưu bài học video:', err);
      setError(err.response?.data?.message || 'Lỗi khi lưu thông tin bài học video.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-left font-sans">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
          <span className="text-xs font-semibold text-gray-500">Đang tải cấu hình bài học video...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left font-sans w-full">
      {/* Header Breadcrumbs */}
      <div className="flex items-center justify-between border-b border-gray-150 pb-5">
        <div className="space-y-1">
          <Link to="/admin/videos" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-brand-green transition">
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Quản lý video</span>
          </Link>
          <h2 className="text-2xl font-black text-gray-900">
            {isEditMode ? 'Biên soạn bài giảng video' : 'Tạo bài giảng video mới'}
          </h2>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving || isUploading}
          className="flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-dark transition text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Lưu bài học</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-xs font-semibold">{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Column 1: General Info */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-5 text-xs font-bold text-gray-700">
          <h3 className="text-sm font-black text-brand-green border-b border-gray-50 pb-3 flex items-center gap-2 uppercase tracking-wider">
            <FileText className="w-5 h-5" />
            Thông tin bài học
          </h3>

          {/* Topic Selector */}
          <div className="space-y-1.5">
            <label className="text-gray-500">Thuộc chủ đề *</label>
            <select
              required
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-green bg-white shadow-sm"
            >
              <option value="">-- Chọn chủ đề video --</option>
              {topics.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-gray-500">Tiêu đề bài giảng *</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Luyện phát âm nguyên âm ngắn"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-green shadow-sm bg-gray-55/20"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <label className="text-gray-500">Đường dẫn tĩnh (Slug) - Tự sinh nếu để trống</label>
            <input
              type="text"
              placeholder="Ví dụ: phat-am-nguyen-am-ngan"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-green shadow-sm"
            />
          </div>

          {/* Order */}
          <div className="space-y-1.5">
            <label className="text-gray-500">Thứ tự sắp xếp *</label>
            <input
              type="number"
              required
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-green shadow-sm"
            />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-gray-500">Trạng thái bài học *</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('draft')}
                className={`flex items-center justify-center gap-1.5 py-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  status === 'draft'
                    ? 'bg-gray-100 border-gray-300 text-gray-700 shadow-sm'
                    : 'bg-white border-gray-200 text-gray-400 hover:text-gray-600'
                }`}
              >
                <EyeOff className="w-4 h-4" />
                <span>Bản nháp (Draft)</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus('published')}
                className={`flex items-center justify-center gap-1.5 py-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  status === 'published'
                    ? 'bg-green-50 border-green-200 text-green-700 shadow-sm'
                    : 'bg-white border-gray-200 text-gray-400 hover:text-green-600'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Xuất bản</span>
              </button>
            </div>
          </div>
        </div>

        {/* Column 2: Media Config */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-5 text-xs font-bold text-gray-700">
          <h3 className="text-sm font-black text-brand-green border-b border-gray-50 pb-3 flex items-center gap-2 uppercase tracking-wider">
            <Video className="w-5 h-5" />
            Cấu hình Media
          </h3>

          {/* Video Type */}
          <div className="space-y-1.5">
            <label className="text-gray-500">Nguồn video phát *</label>
            <select
              required
              value={videoType}
              onChange={(e) => {
                const type = e.target.value;
                setVideoType(type);
                setVideoUrl('');
                setAspectRatio(type === 'tiktok' ? '9:16' : '16:9');
              }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-green bg-white shadow-sm"
            >
              <option value="youtube">YouTube (Embed Link / Shorts)</option>
              <option value="tiktok">TikTok Video Link</option>
              <option value="upload">Upload Video File (MP4 to Cloudinary)</option>
            </select>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-1.5">
            <label className="text-gray-500">Tỷ lệ khung hình hiển thị *</label>
            <select
              required
              disabled={videoType === 'tiktok'}
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-green bg-white shadow-sm disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <option value="16:9">Ngang (Landscape - 16:9)</option>
              <option value="9:16">Dọc (Portrait - 9:16)</option>
            </select>
            {videoType === 'tiktok' && (
              <p className="text-[10px] text-gray-400 mt-1">Khóa tỷ lệ dọc 9:16 cho TikTok.</p>
            )}
          </div>

          {/* Video Url */}
          <div className="space-y-1.5">
            <label className="text-gray-500">
              {videoType === 'upload' ? 'Đường dẫn Video MP4 (Dán URL hoặc Tải lên)' : 'Liên kết chia sẻ Video *'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder={
                  videoType === 'youtube'
                    ? 'Ví dụ: https://www.youtube.com/watch?v=...'
                    : videoType === 'tiktok'
                    ? 'Ví dụ: https://www.tiktok.com/@user/video/...'
                    : 'Ví dụ: https://res.cloudinary.com/...'
                }
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="flex-grow border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-green shadow-sm"
              />
              {videoType === 'upload' && (
                <label className="bg-brand-light text-brand-green border border-brand-green/20 hover:bg-brand-green hover:text-white px-4 py-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center shrink-0 min-w-[90px] h-11">
                  {isUploading && uploadTarget === 'video' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Tải video'
                  )}
                  <input
                    type="file"
                    accept="video/mp4,video/*"
                    className="hidden"
                    disabled={isUploading}
                    onChange={(e) => handleFileUpload(e, 'video')}
                  />
                </label>
              )}
            </div>
            {isUploading && uploadTarget === 'video' && (
              <p className="text-[10px] text-brand-green animate-pulse">
                Đang tải tệp MP4 lên Cloudinary... Vui lòng không đóng trang.
              </p>
            )}
          </div>

          {/* Thumbnail URL */}
          <div className="space-y-1.5">
            <label className="text-gray-500">Ảnh đại diện video (Thumbnail URL) - Không bắt buộc</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Dán đường dẫn ảnh hoặc tải lên"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="flex-grow border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-green shadow-sm"
              />
              <label className="bg-brand-light text-brand-green border border-brand-green/20 hover:bg-brand-green hover:text-white px-4 py-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center shrink-0 min-w-[90px] h-11">
                {isUploading && uploadTarget === 'thumbnail' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Chọn ảnh'
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                  onChange={(e) => handleFileUpload(e, 'thumbnail')}
                />
              </label>
            </div>
            {isUploading && uploadTarget === 'thumbnail' && (
              <p className="text-[10px] text-brand-green animate-pulse">Đang tải ảnh thumbnail...</p>
            )}
          </div>
        </div>

        {/* Footer controls */}
        <div className="md:col-span-2 flex items-center justify-end gap-3 pt-6 border-t border-gray-150">
          <Link
            to="/admin/videos"
            className="px-6 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold text-xs bg-white hover:bg-gray-50 transition"
          >
            Hủy bỏ
          </Link>
          
          <button
            type="submit"
            disabled={isSaving || isUploading}
            className="flex items-center gap-2 bg-brand-green hover:bg-brand-dark text-white px-8 py-3 rounded-2xl font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Lưu tất cả thay đổi</span>
          </button>
        </div>
      </form>
    </div>
  );
}
