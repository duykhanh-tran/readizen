import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/axios.js';
import { Plus, Edit, BookOpen, Save, X, AlertCircle, ArrowLeft, ArrowRight, FileText, Image, Loader2, Trash2 } from 'lucide-react';

export default function AdminLessons() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Modal State (Used ONLY for creating a new lesson)
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State (For creating a new lesson)
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState('A');
  const [coverImage, setCoverImage] = useState('');
  const [pdfFile, setPdfFile] = useState('');
  const [status, setStatus] = useState('active');

  // Trường mới tách biệt độc lập thay cho pages
  const [ebookImages, setEbookImages] = useState(['']);
  const [practiceSentences, setPracticeSentences] = useState([{ text: '' }]);

  // Tách riêng biệt trạng thái upload của các trường
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [uploadingImageIndex, setUploadingImageIndex] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch Lessons
  const fetchLessons = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/admin/lessons?page=${page}&limit=6`);
      setLessons(response.data.lessons);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách bài học.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons(currentPage);
  }, [currentPage]);

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
      setError(err.response?.data?.message || 'Không thể tải file PDF lên.');
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
      setError(err.response?.data?.message || 'Không thể tải ảnh Ebook lên.');
    } finally {
      setUploadingImageIndex(null);
    }
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setTitle('');
    setLevel('A');
    setCoverImage('');
    setPdfFile('');
    setStatus('active');
    setEbookImages(['']);
    setPracticeSentences([{ text: '' }]);
    setIsModalOpen(true);
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

  // Delete Lesson Handler
  const handleDeleteLesson = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài học này?')) return;
    try {
      await api.delete(`/admin/lessons/${id}`);
      setLessons(prev => prev.filter(lesson => lesson._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Không thể xóa bài học.');
    }
  };

  // Form Submit Handler (Submit via FormData)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Simple Client-side Validation
    if (!title.trim() || !coverImage.trim() || !pdfFile.trim()) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    const hasEmptyImage = ebookImages.some(img => !img.trim());
    if (hasEmptyImage) {
      setError('Vui lòng nhập hoặc tải đầy đủ URL cho các hình ảnh Ebook.');
      return;
    }

    const hasEmptySentence = practiceSentences.some(s => !s.text.trim());
    if (hasEmptySentence) {
      setError('Vui lòng nhập đầy đủ văn bản các câu luyện đọc.');
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('level', level);
      formData.append('coverImage', coverImage);
      formData.append('pdfFile', pdfFile);
      formData.append('status', status);
      formData.append('ebookImages', JSON.stringify(ebookImages));
      formData.append('practiceSentences', JSON.stringify(practiceSentences));

      await api.post('/admin/lessons', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setIsModalOpen(false);
      fetchLessons(currentPage);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu bài học mới.');
    } finally {
      setIsSaving(false);
    }
  };

  const isAnyUploading = isUploadingCover || isUploadingPdf || uploadingImageIndex !== null;

  return (
    <div className="space-y-8 text-left font-sans">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Quản lý bài học luyện đọc AI</h2>
          <p className="text-sm text-gray-500 mt-1">Tạo, cập nhật và thiết lập các trang nội dung luyện đọc cho học viên.</p>
        </div>
        
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-dark transition text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-md cursor-pointer hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm bài học mới</span>
        </button>
      </div>

      {/* Error alert */}
      {error && !isModalOpen && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-xs font-semibold">{error}</span>
        </div>
      )}

      {/* Lesson Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-green border-t-transparent"></div>
        </div>
      ) : lessons.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-green">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-gray-800">Chưa có bài học nào</h3>
          <p className="text-xs text-gray-500 mt-1">Hãy nhấp vào nút "Thêm bài học mới" phía trên để tạo bài học đầu tiên.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => {
              const totalSentences = lesson.practiceSentences?.length || 0;
              const totalImages = lesson.ebookImages?.length || 0;

              return (
                <div 
                  key={lesson._id} 
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition duration-300"
                >
                  <div className="h-44 bg-gray-100 relative overflow-hidden flex-shrink-0">
                    <img 
                      src={lesson.coverImage} 
                      alt={lesson.title} 
                      className="w-full h-full object-cover" 
                      onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=No+Cover' }}
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-white text-gray-800 border border-gray-200 shadow-sm">
                        Level {lesson.level || 'A'}
                      </span>
                      {lesson.smartCode && (
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-amber-500 text-white shadow-sm">
                          Code: {lesson.smartCode}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 line-clamp-1 text-sm">{lesson.title}</h3>
                      <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1.5 font-medium">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{totalImages} ảnh Ebook ({totalSentences} câu luyện đọc)</span>
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                      <button
                        onClick={() => navigate(`/admin/lessons/edit/${lesson._id}`)}
                        className="flex items-center gap-1 text-xs text-brand-green hover:text-brand-dark font-black transition cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Chỉnh sửa</span>
                      </button>

                      <button
                        onClick={() => handleDeleteLesson(lesson._id)}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-750 font-black transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Navigation */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-55 transition shadow-sm disabled:opacity-40 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-gray-600" />
              </button>
              
              <span className="text-xs font-bold text-gray-600 px-3">
                Trang {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-55 transition shadow-sm disabled:opacity-40 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add New Lesson Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-250">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-gray-900">
                Thêm bài học luyện đọc mới
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-55 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="flex-grow p-6 overflow-y-auto space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold">{error}</span>
                </div>
              )}

              {/* Main Fields Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-wider">Tiêu đề bài học *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Nhập tiêu đề ví dụ: The Little Bear's Day Out"
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/35 shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-wider">Level bài học *</label>
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
                    <option value="active">Kích hoạt (Hiển thị)</option>
                    <option value="draft">Bản nháp (Ẩn)</option>
                  </select>
                </div>

                {/* Cover Image Upload & Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-wider">Ảnh bìa (Cover Image) *</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      required 
                      placeholder="https://example.com/cover.jpg"
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

                {/* PDF File Upload & Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-wider">File PDF bài học *</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      required 
                      placeholder="https://example.com/lesson.pdf"
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

              {/* KHU VỰC 1: QUẢN LÝ ẢNH EBOOK */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-gray-900 flex items-center gap-1">
                    <Image className="w-4 h-4 text-brand-green" />
                    <span>Quản lý Ảnh Ebook ({ebookImages.length})</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddEbookImage}
                    className="flex items-center gap-1 bg-brand-light text-brand-green border border-brand-green/20 hover:bg-brand-green hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-black transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm ảnh Ebook</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-[25vh] overflow-y-auto pr-2">
                  {ebookImages.map((imageUrl, index) => {
                    const isImageUploading = uploadingImageIndex === index;

                    return (
                      <div key={index} className="flex gap-2 items-center bg-gray-55 p-2 rounded-xl border border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 shrink-0 w-6">#{index + 1}</span>
                        <input 
                          type="text" 
                          placeholder="https://example.com/page.jpg"
                          value={imageUrl} 
                          onChange={(e) => handleEbookImageChange(index, e.target.value)}
                          className="flex-grow border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-green bg-white shadow-sm"
                        />
                        <label className="bg-brand-light text-brand-green border border-brand-green/20 hover:bg-brand-green hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center shrink-0">
                          {isImageUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Tải'}
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
                            className="p-1 text-red-500 hover:text-red-750 transition"
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
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-gray-900 flex items-center gap-1">
                    <FileText className="w-4 h-4 text-brand-green" />
                    <span>Quản lý Câu Luyện Đọc ({practiceSentences.length})</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddPracticeSentence}
                    className="flex items-center gap-1 bg-brand-light text-brand-green border border-brand-green/20 hover:bg-brand-green hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-black transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm câu</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-[25vh] overflow-y-auto pr-2">
                  {practiceSentences.map((sentence, index) => (
                    <div key={index} className="flex gap-2 items-center bg-gray-55 p-2 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 shrink-0 w-6">#{index + 1}</span>
                      <input 
                        type="text" 
                        required 
                        placeholder="Nhập câu tiếng Anh..."
                        value={sentence.text} 
                        onChange={(e) => handlePracticeSentenceTextChange(index, e.target.value)}
                        className="flex-grow border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-green bg-white shadow-sm"
                      />
                      {practiceSentences.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePracticeSentence(index)}
                          className="p-1 text-red-500 hover:text-red-750 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs bg-white hover:bg-gray-55 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving || isAnyUploading}
                className="flex items-center gap-2 bg-brand-green hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Lưu thông tin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
