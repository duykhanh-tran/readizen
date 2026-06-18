import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/axios.js';
import { ArrowLeft, Save, Plus, Trash2, Image, FileText, Loader2, AlertCircle } from 'lucide-react';

export default function EditLesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Tách biệt trạng thái upload
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [uploadingImageIndex, setUploadingImageIndex] = useState(null); // Lưu index ảnh Ebook đang upload

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('trial');
  const [level, setLevel] = useState('A');
  const [coverImage, setCoverImage] = useState('');
  const [pdfFile, setPdfFile] = useState('');
  const [status, setStatus] = useState('active');

  // Trường mới tách biệt độc lập thay cho pages
  const [ebookImages, setEbookImages] = useState(['']);
  const [practiceSentences, setPracticeSentences] = useState([{ text: '' }]);

  // Fetch lesson details
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await api.get(`/admin/lessons/${lessonId}`);
        const data = response.data;
        
        setTitle(data.title);
        setType(data.type);
        setLevel(data.level || 'A');
        setCoverImage(data.coverImage);
        setPdfFile(data.pdfFile);
        setStatus(data.status || 'active');
        
        // Chuyển đổi dữ liệu cũ sang định dạng phẳng mới nếu cần
        if (data.ebookImages && data.ebookImages.length > 0) {
          setEbookImages(data.ebookImages);
        } else if (data.pages && data.pages.length > 0) {
          const images = data.pages.map(p => p.imageUrl).filter(Boolean);
          setEbookImages(images.length > 0 ? images : ['']);
        } else {
          setEbookImages(['']);
        }

        if (data.practiceSentences && data.practiceSentences.length > 0) {
          setPracticeSentences(data.practiceSentences);
        } else if (data.pages && data.pages.length > 0) {
          const sentences = [];
          data.pages.forEach(p => {
            if (p.sentences && p.sentences.length > 0) {
              p.sentences.forEach(s => sentences.push({ text: s.text }));
            } else if (p.textToRead) {
              sentences.push({ text: p.textToRead });
            }
          });
          setPracticeSentences(sentences.length > 0 ? sentences : [{ text: '' }]);
        } else {
          setPracticeSentences([{ text: '' }]);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin bài học.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  // Upload Cover Image
  const handleCoverUpload = async (file) => {
    if (!file) return;
    setIsUploadingCover(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCoverImage(response.data.url);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Không thể tải ảnh bìa lên.');
    } finally {
      setIsUploadingCover(false);
    }
  };

  // Upload PDF File
  const handlePdfUpload = async (file) => {
    if (!file) return;
    setIsUploadingPdf(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPdfFile(response.data.url);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Không thể tải tệp PDF lên.');
    } finally {
      setIsUploadingPdf(false);
    }
  };

  // Upload Ebook Image
  const handleEbookImageUpload = async (file, index) => {
    if (!file) return;
    setUploadingImageIndex(index);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      handleEbookImageChange(index, response.data.url);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Không thể tải ảnh minh họa lên.');
    } finally {
      setUploadingImageIndex(null);
    }
  };

  // Manage Ebook Images
  const handleAddEbookImage = () => {
    setEbookImages([...ebookImages, '']);
  };

  const handleRemoveEbookImage = (index) => {
    if (ebookImages.length === 1) return;
    setEbookImages(ebookImages.filter((_, i) => i !== index));
  };

  const handleEbookImageChange = (index, value) => {
    const updated = [...ebookImages];
    updated[index] = value;
    setEbookImages(updated);
  };

  // Manage Practice Sentences
  const handleAddPracticeSentence = () => {
    setPracticeSentences([...practiceSentences, { text: '' }]);
  };

  const handleRemovePracticeSentence = (index) => {
    if (practiceSentences.length === 1) return;
    setPracticeSentences(practiceSentences.filter((_, i) => i !== index));
  };

  const handlePracticeSentenceTextChange = (index, value) => {
    const updated = [...practiceSentences];
    updated[index].text = value;
    setPracticeSentences(updated);
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!title.trim() || !coverImage.trim() || !pdfFile.trim()) {
      setError('Vui lòng điền đầy đủ tiêu đề, ảnh bìa và tệp PDF bài học.');
      return;
    }

    const hasEmptyImage = ebookImages.some(img => !img.trim());
    if (hasEmptyImage) {
      setError('Vui lòng nhập hoặc tải đầy đủ URL cho các hình ảnh Ebook.');
      return;
    }

    const hasEmptySentence = practiceSentences.some(s => !s.text.trim());
    if (hasEmptySentence) {
      setError('Nội dung các câu luyện phát âm không được để trống.');
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('type', type);
      formData.append('level', level);
      formData.append('coverImage', coverImage);
      formData.append('pdfFile', pdfFile);
      formData.append('status', status);
      // Gửi riêng biệt 2 mảng phẳng độc lập
      formData.append('ebookImages', JSON.stringify(ebookImages));
      formData.append('practiceSentences', JSON.stringify(practiceSentences));

      await api.put(`/admin/lessons/${lessonId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      navigate('/admin/lessons');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Lỗi khi cập nhật thông tin bài học.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-left">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
          <span className="text-xs font-semibold text-gray-500">Đang tải thông tin bài học...</span>
        </div>
      </div>
    );
  }

  const isAnyUploading = isUploadingCover || isUploadingPdf || uploadingImageIndex !== null;

  return (
    <div className="space-y-8 text-left font-sans max-w-4xl">
      {/* Header breadcrumb */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
        <div className="space-y-1">
          <Link to="/admin/lessons" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-brand-green transition">
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Quản lý bài học</span>
          </Link>
          <h2 className="text-2xl font-black text-gray-900">Cấu hình chi tiết bài học</h2>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving || isAnyUploading}
          className="flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-dark transition text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Lưu thay đổi</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-xs font-semibold">{error}</span>
        </div>
      )}

      {/* Main Configurations Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* THÔNG TIN CHUNG BÀI HỌC */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-50 pb-3">
            Thông tin chung bài học
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider">Tiêu đề bài học *</label>
              <input 
                type="text" 
                required 
                placeholder="Ví dụ: Save the Tree"
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/35 shadow-sm bg-gray-50/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider">Phân loại loại bài học *</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-green shadow-sm bg-white"
              >
                <option value="trial">Học thử (Trial)</option>
                <option value="premium">Trả phí (Premium)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider">Level phân chia (A - E) *</label>
              <select 
                value={level} 
                onChange={(e) => setLevel(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-green shadow-sm bg-white"
              >
                <option value="A">Level A</option>
                <option value="B">Level B</option>
                <option value="C">Level C</option>
                <option value="D">Level D</option>
                <option value="E">Level E</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider">Trạng thái hiển thị *</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-green shadow-sm bg-white"
              >
                <option value="active">Hiển thị (Active)</option>
                <option value="draft">Bản nháp (Draft)</option>
              </select>
            </div>

            {/* Cover image file upload */}
            <div className="space-y-1.5 col-span-1">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider">Ảnh bìa bài học *</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  required 
                  placeholder="Nhập URL hoặc tải file ảnh bìa lên"
                  value={coverImage} 
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="flex-grow border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-green shadow-sm"
                />
                <label className="bg-brand-light text-brand-green border border-brand-green/20 hover:bg-brand-green hover:text-white px-4 py-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center shrink-0 min-w-[100px]">
                  {isUploadingCover ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Chọn File'}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    disabled={isUploadingCover}
                    onChange={(e) => handleCoverUpload(e.target.files[0])} 
                  />
                </label>
              </div>
            </div>

            {/* PDF File upload */}
            <div className="space-y-1.5 col-span-1">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider">Tệp sách PDF tải về *</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  required 
                  placeholder="Nhập URL hoặc tải tệp tài liệu PDF lên"
                  value={pdfFile} 
                  onChange={(e) => setPdfFile(e.target.value)}
                  className="flex-grow border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-green shadow-sm"
                />
                <label className="bg-brand-light text-brand-green border border-brand-green/20 hover:bg-brand-green hover:text-white px-4 py-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center shrink-0 min-w-[100px]">
                  {isUploadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Chọn File'}
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    className="hidden" 
                    disabled={isUploadingPdf}
                    onChange={(e) => handlePdfUpload(e.target.files[0])} 
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* KHU VỰC 1: QUẢN LÝ ẢNH EBOOK */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3">
            <div className="flex items-center gap-2">
              <Image className="w-5 h-5 text-brand-green" />
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                Quản lý Ảnh Ebook ({ebookImages.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={handleAddEbookImage}
              className="flex items-center gap-1.5 bg-brand-light text-brand-green border border-brand-green/20 hover:bg-brand-green hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm ảnh minh họa</span>
            </button>
          </div>

          <div className="space-y-4">
            {ebookImages.map((imageUrl, index) => {
              const isImageUploading = uploadingImageIndex === index;

              return (
                <div key={index} className="flex gap-3 items-center bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 shrink-0 w-8">#{index + 1}</span>
                  
                  <input 
                    type="text" 
                    required 
                    placeholder="Nhập URL ảnh Ebook hoặc nhấn Tải để chọn từ thiết bị..."
                    value={imageUrl} 
                    onChange={(e) => handleEbookImageChange(index, e.target.value)}
                    className="flex-grow border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-green bg-white shadow-sm"
                  />
                  
                  <label className="bg-brand-light text-brand-green border border-brand-green/20 hover:bg-brand-green hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center shrink-0 min-w-[90px]">
                    {isImageUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Tải ảnh'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      disabled={isImageUploading}
                      onChange={(e) => handleEbookImageUpload(e.target.files[0], index)} 
                    />
                  </label>

                  {ebookImages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEbookImage(index)}
                      className="p-2 text-red-500 hover:text-red-750 hover:bg-red-50 rounded-xl transition cursor-pointer"
                      aria-label="Xóa ảnh"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* KHU VỰC 2: QUẢN LÝ CÂU LUYỆN ĐỌC */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-green" />
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                Quản lý Câu Luyện Đọc ({practiceSentences.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={handleAddPracticeSentence}
              className="flex items-center gap-1.5 bg-brand-light text-brand-green border border-brand-green/20 hover:bg-brand-green hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm câu luyện đọc</span>
            </button>
          </div>

          <div className="space-y-4">
            {practiceSentences.map((sentence, index) => (
              <div key={index} className="flex gap-3 items-center bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                <span className="text-xs font-bold text-gray-400 shrink-0 w-8">#{index + 1}</span>
                
                <input 
                  type="text" 
                  required 
                  placeholder="Nhập câu tiếng Anh cho bé tập đọc (Ví dụ: The tree is big.)..."
                  value={sentence.text} 
                  onChange={(e) => handlePracticeSentenceTextChange(index, e.target.value)}
                  className="flex-grow border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-green bg-white shadow-sm"
                />

                {practiceSentences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePracticeSentence(index)}
                    className="p-2 text-red-500 hover:text-red-750 hover:bg-red-50 rounded-xl transition cursor-pointer"
                    aria-label="Xóa câu"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-end gap-3 pt-6">
          <Link
            to="/admin/lessons"
            className="px-6 py-3 rounded-2xl border border-gray-200 text-gray-750 font-bold text-xs bg-white hover:bg-gray-55 transition"
          >
            Hủy bỏ
          </Link>
          
          <button
            type="submit"
            disabled={isSaving || isAnyUploading}
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
