import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/axios.js';
import { 
  Plus, Edit, Trash2, Loader2, AlertCircle, Check, 
  Video, Folder, Upload, Link as LinkIcon, Clock, Eye 
} from 'lucide-react';
import SlideOverPanel from '../../components/shared/SlideOverPanel.jsx';

export default function ManageVideos() {
  const navigate = useNavigate();
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
      navigate(`/admin/videos/edit/${lesson._id}`);
    } else {
      navigate('/admin/videos/create');
    }
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
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                {lessons.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-10 text-gray-400 italic">Không tìm thấy bài giảng video nào</td>
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
                      <td className="py-4.5 px-6 text-gray-550 font-mono">{l.slug}</td>
                      <td className="py-4.5 px-6"><span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold">{l.topicTitle || 'Chủ đề'}</span></td>
                      <td className="py-4.5 px-6 font-bold">
                        {l.videoType === 'youtube' && <span className="text-red-600">YouTube</span>}
                        {l.videoType === 'tiktok' && <span className="text-zinc-800">TikTok</span>}
                        {l.videoType === 'upload' && <span className="text-blue-600">File tải lên</span>}
                      </td>
                      <td className="py-4.5 px-6 text-gray-500 font-bold">{l.aspectRatio || '16:9'}</td>
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

      {/* TOPIC DRAWER USING SLIDEOVERPANEL */}
      <SlideOverPanel
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        title={editingTopic ? 'Biên soạn chủ đề video' : 'Tạo chủ đề video mới'}
      >
        <form onSubmit={handleTopicSubmit} className="space-y-5 text-xs font-semibold text-gray-600">
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

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-5 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsTopicModalOpen(false)}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold cursor-pointer transition text-xs"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2.5 bg-brand-green hover:bg-brand-dark text-white rounded-xl font-bold cursor-pointer transition disabled:opacity-50 text-xs"
            >
              Lưu chủ đề
            </button>
          </div>
        </form>
      </SlideOverPanel>
    </div>
  );
}
