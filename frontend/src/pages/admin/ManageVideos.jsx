import React, { useState, useEffect } from 'react';
import api from '../../services/axios.js';
import { 
  Plus, Edit, Trash2, Loader2, AlertCircle, Check, 
  Video, Folder, Upload, Link as LinkIcon, Clock, Eye 
} from 'lucide-react';

export default function ManageVideos() {
  const [activeTab, setActiveTab] = useState('lessons'); // 'topics' or 'lessons'
  
  // List States
  const [topics, setTopics] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Selected filter
  const [selectedTopicFilter, setSelectedTopicFilter] = useState('all');

  // Form States (Topic)
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [topicForm, setTopicForm] = useState({
    title: '',
    slug: '',
    thumbnail: '',
    description: '',
    order: 0
  });

  // Form States (Lesson)
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    topicId: '',
    title: '',
    slug: '',
    videoType: 'youtube',
    aspectRatio: '16:9',
    videoUrl: '',
    thumbnail: '',
    duration: '05:00',
    order: 0
  });

  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTarget, setUploadTarget] = useState(''); // 'topicThumbnail', 'lessonThumbnail', 'lessonVideo'

  // Fetch Data
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const topicsRes = await api.get('/videos/topics');
      setTopics(topicsRes.data);
      
      // If we have topics and haven't fetched lessons yet
      // Fetch all lessons under admin. Let's make an API call to populate all lessons
      // Since we don't have a direct "getAllLessonsAdmin" endpoint, we can fetch all lessons by querying each topic,
      // or we can query them dynamically or create a backend route if needed.
      // Wait, in our backend videoRoute.js, we registered:
      // None of the endpoints directly fetches all lessons, but we can query lessons for the selected topic filter!
      // This is even better! We only fetch lessons for the selected topic filter.
      // If selectedTopicFilter is 'all', we can either fetch for each topic or just display the topics.
      // Wait, let's check: does it make sense to query lessons of the selected topic? Yes!
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu video:', err);
      setError('Không thể tải danh sách chủ đề hoặc bài học.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch lessons when selected topic filter changes
  useEffect(() => {
    const fetchLessonsForFilter = async () => {
      if (selectedTopicFilter === 'all') {
        // Fetch lessons of the first topic or combine lessons of all topics
        if (topics.length > 0) {
          try {
            const allLessons = [];
            for (const topic of topics) {
              const res = await api.get(`/videos/topics/${topic.slug}`);
              if (res.data.lessons) {
                allLessons.push(...res.data.lessons.map(l => ({ ...l, topicTitle: topic.title })));
              }
            }
            setLessons(allLessons);
          } catch (err) {
            console.error('Lỗi khi tải bài học:', err);
          }
        } else {
          setLessons([]);
        }
      } else {
        const selectedTopicObj = topics.find(t => t._id === selectedTopicFilter);
        if (selectedTopicObj) {
          try {
            const res = await api.get(`/videos/topics/${selectedTopicObj.slug}`);
            setLessons(res.data.lessons?.map(l => ({ ...l, topicTitle: selectedTopicObj.title })) || []);
          } catch (err) {
            console.error('Lỗi khi tải bài học cho chủ đề:', err);
          }
        }
      }
    };
    if (topics.length > 0) {
      fetchLessonsForFilter();
    }
  }, [selectedTopicFilter, topics]);

  // Handle Media Upload to Cloudinary
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
      
      if (target === 'topicThumbnail') {
        setTopicForm(prev => ({ ...prev, thumbnail: uploadedUrl }));
      } else if (target === 'lessonThumbnail') {
        setLessonForm(prev => ({ ...prev, thumbnail: uploadedUrl }));
      } else if (target === 'lessonVideo') {
        setLessonForm(prev => ({ ...prev, videoUrl: uploadedUrl }));
      }
    } catch (err) {
      console.error('Lỗi tải tệp lên Cloudinary:', err);
      alert('Không thể tải tệp lên Cloudinary. Vui lòng cấu hình Cloudinary credentials hoặc kiểm tra lại định dạng.');
    } finally {
      setIsUploading(false);
      setUploadTarget('');
    }
  };

  // --- TOPIC ACTIONS ---
  const handleOpenTopicModal = (topic = null) => {
    if (topic) {
      setEditingTopic(topic);
      setTopicForm({
        title: topic.title,
        slug: topic.slug || '',
        thumbnail: topic.thumbnail,
        description: topic.description || '',
        order: topic.order || 0
      });
    } else {
      setEditingTopic(null);
      setTopicForm({
        title: '',
        slug: '',
        thumbnail: '',
        description: '',
        order: topics.length
      });
    }
    setIsTopicModalOpen(true);
  };

  const handleTopicSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTopic) {
        await api.put(`/videos/admin/topics/${editingTopic._id}`, topicForm);
      } else {
        await api.post('/videos/admin/topics', topicForm);
      }
      setIsTopicModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Lỗi lưu chủ đề:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra.');
    }
  };

  const handleTopicDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chủ đề này? Tất cả các video bài giảng liên quan sẽ bị xóa!')) return;
    try {
      await api.delete(`/videos/admin/topics/${id}`);
      fetchData();
      if (selectedTopicFilter === id) {
        setSelectedTopicFilter('all');
      }
    } catch (err) {
      console.error('Lỗi xóa chủ đề:', err);
      alert('Không thể xóa chủ đề này.');
    }
  };

  // --- LESSON ACTIONS ---
  const handleOpenLessonModal = (lesson = null) => {
    if (lesson) {
      setEditingLesson(lesson);
      setLessonForm({
        topicId: lesson.topicId?._id || lesson.topicId || '',
        title: lesson.title,
        slug: lesson.slug || '',
        videoType: lesson.videoType,
        aspectRatio: lesson.aspectRatio || '16:9',
        videoUrl: lesson.videoUrl,
        thumbnail: lesson.thumbnail || '',
        duration: lesson.duration || '05:00',
        order: lesson.order || 0
      });
    } else {
      setEditingLesson(null);
      setLessonForm({
        topicId: selectedTopicFilter !== 'all' ? selectedTopicFilter : (topics[0]?._id || ''),
        title: '',
        slug: '',
        videoType: 'youtube',
        aspectRatio: '16:9',
        videoUrl: '',
        thumbnail: '',
        duration: '05:00',
        order: lessons.length
      });
    }
    setIsLessonModalOpen(true);
  };

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    if (!lessonForm.topicId) {
      alert('Vui lòng chọn chủ đề cho bài học này.');
      return;
    }
    try {
      if (editingLesson) {
        await api.put(`/videos/admin/lessons/${editingLesson._id}`, lessonForm);
      } else {
        await api.post('/videos/admin/lessons', lessonForm);
      }
      setIsLessonModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Lỗi lưu bài học video:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra.');
    }
  };

  const handleLessonDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài học video này?')) return;
    try {
      await api.delete(`/videos/admin/lessons/${id}`);
      fetchData();
    } catch (err) {
      console.error('Lỗi xóa bài học video:', err);
      alert('Không thể xóa bài học video.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Quản lý Video bài giảng</h1>
          <p className="text-xs text-gray-500 font-semibold mt-1">Cấu hình các chủ đề học tập qua video và bài giảng đa nguồn phát cho học sinh</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenTopicModal()}
            className="flex items-center gap-1.5 bg-brand-light text-brand-green hover:bg-brand-green hover:text-white border border-brand-green/20 px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm chủ đề</span>
          </button>
          <button
            disabled={topics.length === 0}
            onClick={() => handleOpenLessonModal()}
            className="flex items-center gap-1.5 bg-brand-green text-white hover:bg-brand-dark px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm bài giảng</span>
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('lessons')}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'lessons'
              ? 'border-brand-green text-brand-green'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Video className="w-4 h-4" />
          Bài giảng Video
        </button>
        <button
          onClick={() => setActiveTab('topics')}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'topics'
              ? 'border-brand-green text-brand-green'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Folder className="w-4 h-4" />
          Chủ đề học tập
        </button>
      </div>

      {/* Filter Options (For Lessons view) */}
      {activeTab === 'lessons' && (
        <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-black text-gray-500">Lọc theo chủ đề:</span>
          <select
            value={selectedTopicFilter}
            onChange={(e) => setSelectedTopicFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 rounded-xl px-3 py-2 outline-none focus:border-brand-green/50 cursor-pointer"
          >
            <option value="all">Tất cả chủ đề</option>
            {topics.map(t => (
              <option key={t._id} value={t._id}>{t.title}</option>
            ))}
          </select>
        </div>
      )}

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
          <p className="text-xs text-gray-500 font-bold mt-3">Đang tải danh sách dữ liệu...</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-xs">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      ) : activeTab === 'topics' ? (
        /* TOPICS TAB CONTENT */
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Thứ tự</th>
                  <th className="py-4 px-6">Ảnh đại diện</th>
                  <th className="py-4 px-6">Tiêu đề</th>
                  <th className="py-4 px-6">Slug</th>
                  <th className="py-4 px-6">Mô tả</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                {topics.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-400 italic">Chưa có chủ đề nào</td>
                  </tr>
                ) : (
                  topics.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50/50 transition">
                      <td className="py-4.5 px-6 font-bold">{t.order}</td>
                      <td className="py-4.5 px-6">
                        <img
                          src={t.thumbnail}
                          alt={t.title}
                          className="w-12 h-12 object-cover bg-gray-50 rounded-xl border border-gray-100 p-0.5"
                          onError={(e) => { e.target.src = 'https://placehold.co/100?text=' + t.title }}
                        />
                      </td>
                      <td className="py-4.5 px-6 font-extrabold text-gray-900">{t.title}</td>
                      <td className="py-4.5 px-6 text-gray-500 font-mono">{t.slug}</td>
                      <td className="py-4.5 px-6 text-gray-400 line-clamp-1 max-w-xs">{t.description || '-'}</td>
                      <td className="py-4.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenTopicModal(t)}
                            className="p-2 text-gray-600 hover:text-brand-green hover:bg-brand-light/50 rounded-lg transition cursor-pointer"
                            title="Sửa chủ đề"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleTopicDelete(t._id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Xóa chủ đề"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* LESSONS TAB CONTENT */
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Thứ tự</th>
                  <th className="py-4 px-6">Ảnh thu nhỏ</th>
                  <th className="py-4 px-6">Bài giảng</th>
                  <th className="py-4 px-6">Slug</th>
                  <th className="py-4 px-6">Chủ đề</th>
                  <th className="py-4 px-6">Nguồn video</th>
                  <th className="py-4 px-6">Tỷ lệ</th>
                  <th className="py-4 px-6">Độ dài</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                {lessons.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-10 text-gray-400 italic">Không tìm thấy bài giảng video nào</td>
                  </tr>
                ) : (
                  lessons.map((l) => (
                    <tr key={l._id} className="hover:bg-gray-50/50 transition">
                      <td className="py-4.5 px-6 font-bold">{l.order}</td>
                      <td className="py-4.5 px-6">
                        <img
                          src={l.thumbnail || 'https://placehold.co/100?text=Video'}
                          alt={l.title}
                          className="w-16 h-9 object-cover bg-gray-50 rounded-lg border border-gray-100"
                          onError={(e) => { e.target.src = 'https://placehold.co/100?text=Video' }}
                        />
                      </td>
                      <td className="py-4.5 px-6 font-extrabold text-gray-900 max-w-xs truncate">{l.title}</td>
                      <td className="py-4.5 px-6 text-gray-500 font-mono">{l.slug}</td>
                      <td className="py-4.5 px-6"><span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold">{l.topicTitle || 'Chủ đề'}</span></td>
                      <td className="py-4.5 px-6 font-bold">
                        {l.videoType === 'youtube' && <span className="text-red-600">YouTube</span>}
                        {l.videoType === 'tiktok' && <span className="text-zinc-800">TikTok</span>}
                        {l.videoType === 'upload' && <span className="text-blue-600">File tải lên</span>}
                      </td>
                      <td className="py-4.5 px-6 text-gray-500 font-bold">{l.aspectRatio || '16:9'}</td>
                      <td className="py-4.5 px-6 text-gray-400">{l.duration}</td>
                      <td className="py-4.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenLessonModal(l)}
                            className="p-2 text-gray-600 hover:text-brand-green hover:bg-brand-light/50 rounded-lg transition cursor-pointer"
                            title="Sửa bài giảng"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleLessonDelete(l._id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Xóa bài giảng"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TOPIC DRAWER */}
      {isTopicModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsTopicModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-355">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-base font-black text-gray-800">
                  {editingTopic ? 'Biên soạn chủ đề video' : 'Tạo chủ đề video mới'}
                </h2>
                <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Điền các thông tin của chủ đề video</p>
              </div>
              <button 
                onClick={() => setIsTopicModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-150 text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleTopicSubmit} className="flex-grow overflow-y-auto p-6 space-y-5 text-xs font-semibold text-gray-600">
              {/* Title */}
              <div>
                <label className="block mb-1.5 text-gray-500">Tiêu đề chủ đề *</label>
                <input
                  type="text"
                  required
                  value={topicForm.title}
                  onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                  placeholder="Ví dụ: Học chữ cái ABC"
                  className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4.5 py-3 outline-none focus:border-brand-green/50 text-gray-800 font-bold"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block mb-1.5 text-gray-500">Đường dẫn tĩnh (Slug) - tự sinh nếu để trống</label>
                <input
                  type="text"
                  value={topicForm.slug}
                  onChange={(e) => setTopicForm({ ...topicForm, slug: e.target.value })}
                  placeholder="Ví dụ: hoc-chu-cai-abc"
                  className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4.5 py-3 outline-none focus:border-brand-green/50 text-gray-800 font-bold"
                />
              </div>

              {/* Thumbnail URL / Upload */}
              <div>
                <label className="block mb-1.5 text-gray-500">Ảnh đại diện (Thumbnail URL) *</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    required
                    value={topicForm.thumbnail}
                    onChange={(e) => setTopicForm({ ...topicForm, thumbnail: e.target.value })}
                    placeholder="Dán đường dẫn ảnh hoặc tải lên"
                    className="flex-grow bg-gray-50 border border-gray-250 rounded-xl px-4.5 py-3 outline-none focus:border-brand-green/50 text-gray-800 font-bold"
                  />
                  <label className="bg-gray-100 hover:bg-gray-200 border border-gray-250 hover:border-gray-300 rounded-xl px-4 flex items-center justify-center gap-1.5 cursor-pointer text-gray-600 transition h-11 shrink-0 font-bold">
                    <Upload className="w-4 h-4" />
                    <span>Tải lên</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'topicThumbnail')}
                    />
                  </label>
                </div>
                {isUploading && uploadTarget === 'topicThumbnail' && (
                  <div className="text-[10px] text-brand-green flex items-center gap-1 font-bold">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang tải ảnh lên Cloudinary...</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1.5 text-gray-500">Mô tả ngắn</label>
                <textarea
                  value={topicForm.description}
                  onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                  placeholder="Mô tả tóm tắt nội dung chủ đề"
                  className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4.5 py-3 outline-none focus:border-brand-green/50 text-gray-800 font-bold h-20 resize-none"
                />
              </div>

              {/* Order */}
              <div>
                <label className="block mb-1.5 text-gray-500">Thứ tự hiển thị</label>
                <input
                  type="number"
                  value={topicForm.order}
                  onChange={(e) => setTopicForm({ ...topicForm, order: parseInt(e.target.value) || 0 })}
                  className="w-24 bg-gray-50 border border-gray-250 rounded-xl px-4.5 py-3 outline-none focus:border-brand-green/50 text-gray-800 font-bold"
                />
              </div>
            </form>

            {/* Actions */}
            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-2 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setIsTopicModalOpen(false)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold cursor-pointer transition text-xs"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleTopicSubmit}
                disabled={isUploading}
                className="px-5 py-2.5 bg-brand-green hover:bg-brand-dark text-white rounded-xl font-bold cursor-pointer transition disabled:opacity-50 text-xs"
              >
                Lưu chủ đề
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LESSON DRAWER */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsLessonModalOpen(false)} />
          <div className="relative w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-355">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-base font-black text-gray-800">
                  {editingLesson ? 'Biên soạn bài giảng video' : 'Tạo bài giảng video mới'}
                </h2>
                <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Biên soạn thông tin và cấu hình tài nguyên media cho bài giảng</p>
              </div>
              <button 
                onClick={() => setIsLessonModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-150 text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>
            </div>

            {/* Body (Form Grid) */}
            <form onSubmit={handleLessonSubmit} className="flex-grow overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-semibold text-gray-600">
              {/* Column 1: General Info */}
              <div className="space-y-5">
                <h3 className="font-extrabold text-sm text-brand-green border-b pb-2 mb-3">Thông Tin Chung</h3>
                
                {/* Topic Select */}
                <div>
                  <label className="block mb-1.5 text-gray-500">Thuộc chủ đề *</label>
                  <select
                    required
                    value={lessonForm.topicId}
                    onChange={(e) => setLessonForm({ ...lessonForm, topicId: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-3 outline-none focus:border-brand-green/50 text-gray-800 font-bold cursor-pointer"
                  >
                    <option value="">-- Chọn chủ đề video --</option>
                    {topics.map(t => (
                      <option key={t._id} value={t._id}>{t.title}</option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block mb-1.5 text-gray-500">Tiêu đề bài giảng *</label>
                  <input
                    type="text"
                    required
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    placeholder="Ví dụ: Luyện đọc nguyên âm đơn"
                    className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4.5 py-3 outline-none focus:border-brand-green/50 text-gray-800 font-bold"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block mb-1.5 text-gray-500">Đường dẫn tĩnh (Slug) - tự sinh từ tiêu đề nếu để trống</label>
                  <input
                    type="text"
                    value={lessonForm.slug}
                    onChange={(e) => setLessonForm({ ...lessonForm, slug: e.target.value })}
                    placeholder="Ví dụ: luyen-doc-nguyen-am-don hoặc a"
                    className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4.5 py-3 outline-none focus:border-brand-green/50 text-gray-800 font-bold"
                  />
                </div>

                {/* Row: Duration & Order */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1.5 text-gray-500">Thời lượng (ví dụ: 05:30) *</label>
                    <input
                      type="text"
                      required
                      value={lessonForm.duration}
                      onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                      placeholder="05:30"
                      className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4.5 py-3 outline-none focus:border-brand-green/50 text-gray-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-gray-500">Thứ tự sắp xếp *</label>
                    <input
                      type="number"
                      required
                      value={lessonForm.order}
                      onChange={(e) => setLessonForm({ ...lessonForm, order: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4.5 py-3 outline-none focus:border-brand-green/50 text-gray-800 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Column 2: Media & Configuration */}
              <div className="space-y-5">
                <h3 className="font-extrabold text-sm text-brand-green border-b pb-2 mb-3">Cấu Hình Media & Tỷ Lệ</h3>

                {/* Video Type Select */}
                <div>
                  <label className="block mb-1.5 text-gray-500">Nguồn video phát *</label>
                  <select
                    required
                    value={lessonForm.videoType}
                    onChange={(e) => {
                      const type = e.target.value;
                      setLessonForm({
                        ...lessonForm,
                        videoType: type,
                        videoUrl: '',
                        aspectRatio: type === 'tiktok' ? '9:16' : '16:9'
                      });
                    }}
                    className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-3 outline-none focus:border-brand-green/50 text-gray-800 font-bold cursor-pointer"
                  >
                    <option value="youtube">YouTube (Embed Link / Shorts)</option>
                    <option value="tiktok">TikTok Video Link</option>
                    <option value="upload">Upload Video File (MP4 to Cloudinary)</option>
                  </select>
                </div>

                {/* Aspect Ratio Selector */}
                <div>
                  <label className="block mb-1.5 text-gray-500">Tỷ lệ khung hình hiển thị *</label>
                  <select
                    required
                    disabled={lessonForm.videoType === 'tiktok'}
                    value={lessonForm.aspectRatio}
                    onChange={(e) => setLessonForm({ ...lessonForm, aspectRatio: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-3 outline-none focus:border-brand-green/50 text-gray-800 font-bold cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <option value="16:9">Ngang (Landscape - 16:9)</option>
                    <option value="9:16">Dọc (Portrait - 9:16)</option>
                  </select>
                  {lessonForm.videoType === 'tiktok' && (
                    <p className="text-[10px] text-gray-400 mt-1 font-bold">Đã tự động khóa tỷ lệ dọc 9:16 cho TikTok.</p>
                  )}
                </div>

                {/* Video URL Input / File Upload */}
                <div>
                  <label className="block mb-1.5 text-gray-500">
                    {lessonForm.videoType === 'upload' ? 'Đường dẫn Video MP4 (Tải lên hoặc dán URL)' : 'Liên kết chia sẻ Video *'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={lessonForm.videoUrl}
                      onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                      placeholder={
                        lessonForm.videoType === 'youtube'
                          ? 'Ví dụ: https://www.youtube.com/watch?v=...'
                          : lessonForm.videoType === 'tiktok'
                          ? 'Ví dụ: https://www.tiktok.com/@user/video/...'
                          : 'Ví dụ: https://res.cloudinary.com/...'
                      }
                      className="flex-grow bg-gray-50 border border-gray-250 rounded-xl px-4.5 py-3 outline-none focus:border-brand-green/50 text-gray-800 font-bold"
                    />
                    {lessonForm.videoType === 'upload' && (
                      <label className="bg-gray-100 hover:bg-gray-200 border border-gray-250 hover:border-gray-300 rounded-xl px-4 flex items-center justify-center gap-1.5 cursor-pointer text-gray-600 transition font-bold shrink-0 h-11">
                        <Upload className="w-4 h-4" />
                        <span>Tải lên</span>
                        <input
                          type="file"
                          accept="video/mp4,video/x-m4v,video/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'lessonVideo')}
                        />
                      </label>
                    )}
                  </div>
                  {isUploading && uploadTarget === 'lessonVideo' && (
                    <div className="text-[10px] text-brand-green flex items-center gap-1 font-bold mt-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang tải tệp Video MP4 lên Cloudinary (Quá trình này mất khoảng vài phút)...</span>
                    </div>
                  )}
                </div>

                {/* Lesson Thumbnail URL / Upload (Optional) */}
                <div>
                  <label className="block mb-1.5 text-gray-500">Ảnh đại diện video (Thumbnail URL) - Không bắt buộc</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={lessonForm.thumbnail}
                      onChange={(e) => setLessonForm({ ...lessonForm, thumbnail: e.target.value })}
                      placeholder="Dán đường dẫn ảnh hoặc tải lên"
                      className="flex-grow bg-gray-50 border border-gray-250 rounded-xl px-4.5 py-3 outline-none focus:border-brand-green/50 text-gray-800 font-bold"
                    />
                    <label className="bg-gray-100 hover:bg-gray-200 border border-gray-250 hover:border-gray-300 rounded-xl px-4 flex items-center justify-center gap-1.5 cursor-pointer text-gray-600 transition font-bold shrink-0 h-11">
                      <Upload className="w-4 h-4" />
                      <span>Tải lên</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'lessonThumbnail')}
                      />
                    </label>
                  </div>
                  {isUploading && uploadTarget === 'lessonThumbnail' && (
                    <div className="text-[10px] text-brand-green flex items-center gap-1 font-bold mt-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang tải ảnh thumbnail lên Cloudinary...</span>
                    </div>
                  )}
                </div>
              </div>
            </form>

            {/* Actions */}
            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-2 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setIsLessonModalOpen(false)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold cursor-pointer transition text-xs"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleLessonSubmit}
                disabled={isUploading}
                className="px-5 py-2.5 bg-brand-green hover:bg-brand-dark text-white rounded-xl font-bold cursor-pointer transition disabled:opacity-50 text-xs"
              >
                Lưu bài giảng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
