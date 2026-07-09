import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/axios.js';
import { 
  ArrowLeft, Save, Plus, Trash2, Image as ImageIcon, Loader2, 
  AlertCircle, Check, Eye, EyeOff, Sparkles 
} from 'lucide-react';

export default function EditAlphabetLesson() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form Fields State
  const [letter, setLetter] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [status, setStatus] = useState('draft');
  const [vocabularies, setVocabularies] = useState([]);

  // Upload States
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [uploadingImageIndex, setUploadingImageIndex] = useState(null);

  useEffect(() => {
    const fetchLessonDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/alphabet/admin/${id}`);
        const data = response.data;
        setLetter(data.letter);
        setThumbnail(data.thumbnail || '');
        setStatus(data.status || 'draft');
        setVocabularies(data.vocabularies || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Không thể lấy thông tin chi tiết bài học chữ cái.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLessonDetails();
  }, [id]);

  const handleThumbnailUpload = async (file) => {
    if (!file) return;
    setIsUploadingThumbnail(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setThumbnail(response.data.url);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Không thể tải ảnh thumbnail.');
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  const handleVocabImageUpload = async (file, index) => {
    if (!file) return;
    setUploadingImageIndex(index);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const updated = [...vocabularies];
      updated[index].imageUrl = response.data.url;
      setVocabularies(updated);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || `Không thể tải ảnh từ vựng #${index + 1}`);
    } finally {
      setUploadingImageIndex(null);
    }
  };

  const handleVocabChange = (index, field, value) => {
    const updated = [...vocabularies];
    updated[index][field] = value;
    setVocabularies(updated);
  };

  const handleAddVocabRow = () => {
    setVocabularies([...vocabularies, { word: '', imageUrl: '' }]);
  };

  const handleRemoveVocabRow = (index) => {
    setVocabularies(vocabularies.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!thumbnail.trim()) {
      setError('Vui lòng chọn hoặc điền link ảnh Thumbnail cho chữ cái.');
      return;
    }

    // Validation: if status is published, let's make sure vocabularies are completely filled
    const hasEmptyField = vocabularies.some(v => !v.word.trim() || !v.imageUrl.trim());
    if (hasEmptyField) {
      setError('Vui lòng nhập đầy đủ từ vựng và chọn hình ảnh cho toàn bộ từ vựng.');
      return;
    }

    setIsSaving(true);
    const payload = {
      letter,
      thumbnail,
      status,
      vocabularies
    };

    try {
      await api.put(`/alphabet/admin/${id}`, payload);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/admin/alphabet');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật chữ cái.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-green border-t-transparent"></div>
      </div>
    );
  }

  const isAnyUploading = isUploadingThumbnail || uploadingImageIndex !== null;

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-left font-sans pb-16">
      
      {/* Top Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-150 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/alphabet')}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition text-gray-600 shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex w-7 h-7 rounded-lg bg-brand-light font-black text-brand-green items-center justify-center text-sm border border-brand-green/10">
                {letter}
              </span>
              <h2 className="text-xl font-black text-gray-900">Biên soạn chữ cái {letter}</h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">Cấu hình từ vựng đính kèm và hình ảnh đại diện cho chữ cái {letter}.</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving || isAnyUploading}
          className="flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-dark transition text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-md cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Lưu thay đổi</span>
        </button>
      </div>

      {/* Success/Error Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-xs font-semibold">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in">
          <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
          <span className="text-xs font-bold">Cập nhật bài học chữ cái {letter} thành công! Đang chuyển trang...</span>
        </div>
      )}

      {/* Two Column Layout Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Basic Letter Config */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm space-y-5">
            <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-green" />
              <span>Thiết lập chung</span>
            </h3>

            {/* Letter input (Read-only since it's preseeded A-Z) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Chữ cái</label>
              <input
                type="text"
                disabled
                value={letter}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs bg-gray-50 font-black text-center text-lg text-gray-800 shadow-sm"
              />
            </div>

            {/* Status input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Trạng thái bài học</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('draft')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
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
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
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

            {/* Thumbnail upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Ảnh Thumbnail đại diện</label>
              
              {/* Thumbnail Preview */}
              <div className="w-full h-40 bg-gray-55 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden relative group">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt="Thumbnail"
                    className="max-w-full max-h-full object-contain p-2"
                  />
                ) : (
                  <div className="text-center text-gray-400 p-4">
                    <ImageIcon className="w-10 h-10 mx-auto opacity-40 mb-1" />
                    <span className="text-[10px] font-bold">Chưa tải ảnh minh họa lên</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Link ảnh minh họa"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="flex-grow border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-green shadow-sm"
                />
                <label className="bg-brand-light text-brand-green border border-brand-green/20 hover:bg-brand-green hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center shrink-0 min-w-[85px]">
                  {isUploadingThumbnail ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Tải File'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploadingThumbnail}
                    onChange={(e) => handleThumbnailUpload(e.target.files[0])}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Vocabularies config list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
                <ImageIcon className="w-4.5 h-4.5 text-brand-green" />
                <span>Từ vựng liên quan ({vocabularies.length})</span>
              </h3>
              
              <button
                type="button"
                onClick={handleAddVocabRow}
                className="flex items-center gap-1 bg-brand-light text-brand-green border border-brand-green/20 hover:bg-brand-green hover:text-white px-3.5 py-2 rounded-xl text-[11px] font-black transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm từ vựng</span>
              </button>
            </div>

            {/* List vocab cards */}
            {vocabularies.length === 0 ? (
              <div className="bg-gray-55 border border-dashed border-gray-200 p-8 rounded-2xl text-center text-gray-400">
                <ImageIcon className="w-10 h-10 mx-auto opacity-35 mb-2" />
                <p className="text-xs font-bold">Chưa có từ vựng nào.</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Nhấp nút "Thêm từ vựng" để tạo danh sách học cho bé.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {vocabularies.map((vocab, index) => {
                  const isImageUploading = uploadingImageIndex === index;

                  return (
                    <div key={index} className="bg-gray-50/70 p-4 rounded-2xl border border-gray-150 space-y-3 relative group hover:border-gray-250 transition duration-200">
                      
                      {/* Vocab row header */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-brand-green uppercase tracking-widest">Từ vựng #{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveVocabRow(index)}
                          className="text-red-500 hover:text-red-750 p-1 rounded-lg hover:bg-red-50 transition"
                          title="Xóa từ vựng này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Config row */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                        
                        {/* Word Input */}
                        <div className="md:col-span-5 space-y-1.5">
                          <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Từ Tiếng Anh</label>
                          <input
                            type="text"
                            required
                            placeholder="Ví dụ: Apple"
                            value={vocab.word}
                            onChange={(e) => handleVocabChange(index, 'word', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-green bg-white shadow-sm font-semibold"
                          />
                        </div>

                        {/* Image link & Upload */}
                        <div className="md:col-span-7 space-y-1.5">
                          <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Link Ảnh Minh Họa</label>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              required
                              placeholder="URL ảnh"
                              value={vocab.imageUrl}
                              onChange={(e) => handleVocabChange(index, 'imageUrl', e.target.value)}
                              className="flex-grow border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-green bg-white shadow-sm"
                            />
                            
                            <label className="bg-brand-light text-brand-green border border-brand-green/20 hover:bg-brand-green hover:text-white px-3.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center shrink-0">
                              {isImageUploading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <span>Tải ảnh</span>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={isImageUploading}
                                onChange={(e) => handleVocabImageUpload(e.target.files[0], index)}
                              />
                            </label>
                          </div>
                        </div>

                        {/* Live Image Preview (Full Width if populated) */}
                        {vocab.imageUrl && (
                          <div className="md:col-span-12 flex gap-2 items-center bg-white p-2 rounded-xl border border-gray-150">
                            <img
                              src={vocab.imageUrl}
                              alt="Vocab illustration"
                              className="w-10 h-10 object-contain bg-gray-55 rounded border border-gray-100 p-0.5"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <div className="text-[9px] text-gray-400 font-medium truncate max-w-md">
                              Preview: {vocab.imageUrl}
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </form>
    </div>
  );
}
