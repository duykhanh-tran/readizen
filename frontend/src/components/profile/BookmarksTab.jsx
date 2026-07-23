import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Loader2, Play, BookOpen, Sparkles, Trash2, ArrowRight, Headphones } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/axios.js';

export default function BookmarksTab() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('lesson'); // 'lesson' | 'video' | 'alphabet' | 'podcast'

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get('/bookmarks/my');
      setBookmarks(res.data || []);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách bookmark:', err);
      setError('Không thể kết nối đến máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBookmark = async (itemType, itemId, e) => {
    e.stopPropagation();
    try {
      const res = await api.post('/bookmarks/toggle', { itemType, itemId });
      if (!res.data.bookmarked) {
        toast.success('Đã xóa khỏi danh sách bài học đã lưu!');
        setBookmarks((prev) =>
          prev.filter((b) => {
            if (itemType === 'lesson') return b.lessonId?._id !== itemId;
            if (itemType === 'video') return b.videoLessonId?._id !== itemId;
            if (itemType === 'alphabet') return b.alphabetLessonId?._id !== itemId;
            if (itemType === 'podcast') return b.podcastEpisodeId?._id !== itemId;
            return true;
          })
        );
      }
    } catch (err) {
      console.error('Lỗi khi xóa bookmark:', err);
      toast.error('Không thể xóa bài học khỏi lưu trữ.');
    }
  };

  const lessonsList = bookmarks.filter((b) => b.itemType === 'lesson');
  const videosList = bookmarks.filter((b) => b.itemType === 'video');
  const alphabetList = bookmarks.filter((b) => b.itemType === 'alphabet');
  const podcastsList = bookmarks.filter((b) => b.itemType === 'podcast');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-left">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-brand-dark flex items-center gap-2">
          <Bookmark className="w-5.5 h-5.5 text-brand-green fill-brand-green/20" />
          Bài Học Đã Lưu
        </h2>
        <p className="text-xs text-gray-500 mt-1">Lưu trữ các bài luyện đọc AI, bài giảng video và tập Podcast bé yêu thích để xem lại bất cứ lúc nào.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-150 text-red-800 p-4 rounded-2xl text-xs font-bold">
          {error}
        </div>
      )}

      {/* Sub-tabs Toggle */}
      <div className="flex flex-wrap border-b border-gray-100 pb-px gap-1">
        <button
          onClick={() => setActiveSubTab('lesson')}
          className={`px-4 sm:px-5 py-2.5 font-extrabold text-xs transition duration-200 border-b-2 -mb-px cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'lesson'
              ? 'border-brand-green text-brand-green'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Bài luyện đọc ({lessonsList.length})
        </button>
        <button
          onClick={() => setActiveSubTab('video')}
          className={`px-4 sm:px-5 py-2.5 font-extrabold text-xs transition duration-200 border-b-2 -mb-px cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'video'
              ? 'border-brand-green text-brand-green'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Play className="w-4 h-4" />
          Bài giảng Video ({videosList.length})
        </button>
        <button
          onClick={() => setActiveSubTab('podcast')}
          className={`px-4 sm:px-5 py-2.5 font-extrabold text-xs transition duration-200 border-b-2 -mb-px cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'podcast'
              ? 'border-brand-green text-brand-green'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Headphones className="w-4 h-4" />
          Podcasts ({podcastsList.length})
        </button>
        <button
          onClick={() => setActiveSubTab('alphabet')}
          className={`px-4 sm:px-5 py-2.5 font-extrabold text-xs transition duration-200 border-b-2 -mb-px cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'alphabet'
              ? 'border-brand-green text-brand-green'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Bảng chữ cái ({alphabetList.length})
        </button>
      </div>

      {/* Content Rendering: 1. Lesson */}
      {activeSubTab === 'lesson' && (
        lessonsList.length === 0 ? (
          <div className="bg-white p-10 rounded-[2rem] border border-gray-100 text-center text-xs text-gray-500 shadow-sm space-y-4 max-w-md mx-auto">
            <div className="text-4xl">🔖</div>
            <p className="font-semibold text-gray-600">Bé chưa lưu bài luyện đọc nào.</p>
            <p className="text-gray-400 leading-relaxed">Khi bé học các bài trong Thư viện, hãy nhấn "Lưu học sau" để lưu vào danh sách này nhé.</p>
            <button
              onClick={() => navigate('/library')}
              className="bg-brand-green hover:bg-brand-dark text-white px-6 py-2.5 rounded-full font-bold text-xs shadow-md transition cursor-pointer"
            >
              Vào thư viện luyện đọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lessonsList.map((bookmark) => {
              const lesson = bookmark.lessonId;
              if (!lesson) return null;

              return (
                <div
                  key={bookmark._id}
                  onClick={() => navigate(`/lessons/${lesson._id}`)}
                  className="bg-white p-4 rounded-[2rem] border border-gray-150 shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                      <img
                        src={lesson.coverImage || 'https://placehold.co/100?text=Readizen'}
                        alt={lesson.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/100?text=Readizen';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="inline-block text-[9px] font-black uppercase text-brand-green bg-brand-light px-2 py-0.5 rounded-full mb-1">
                        {lesson.category || 'Luyện đọc'}
                      </span>
                      <h4 className="font-bold text-gray-900 text-xs truncate group-hover:text-brand-green transition">
                        {lesson.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Cấp độ: {lesson.level || 'Cơ bản'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => handleRemoveBookmark('lesson', lesson._id, e)}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer border border-transparent hover:border-red-100"
                      title="Xóa khỏi lưu trữ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="p-2 rounded-xl bg-brand-light text-brand-green group-hover:bg-brand-green group-hover:text-white transition">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Content Rendering: 2. Video */}
      {activeSubTab === 'video' && (
        videosList.length === 0 ? (
          <div className="bg-white p-10 rounded-[2rem] border border-gray-100 text-center text-xs text-gray-500 shadow-sm space-y-4 max-w-md mx-auto">
            <div className="text-4xl">🎬</div>
            <p className="font-semibold text-gray-600">Bé chưa lưu bài giảng video nào.</p>
            <p className="text-gray-400 leading-relaxed">Hãy khám phá các bài giảng video bổ ích và lưu lại những video bé yêu thích để xem sau nhé!</p>
            <button
              onClick={() => navigate('/videos')}
              className="bg-brand-green hover:bg-brand-dark text-white px-6 py-2.5 rounded-full font-bold text-xs shadow-md transition cursor-pointer"
            >
              Xem danh sách video
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videosList.map((bookmark) => {
              const video = bookmark.videoLessonId;
              if (!video) return null;

              const topicSlug = video.topicId?.slug || 'topic';
              const detailSlug = video.slug;

              return (
                <div
                  key={bookmark._id}
                  onClick={() => navigate(`/videos/${topicSlug}/${detailSlug}`)}
                  className="bg-white p-4 rounded-[2rem] border border-gray-150 shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 relative">
                      <img
                        src={video.thumbnail || 'https://placehold.co/160x120?text=Video'}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/160x120?text=Video';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white fill-white opacity-80" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <span className="inline-block text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mb-1">
                        {video.topicId?.title || 'Video'}
                      </span>
                      <h4 className="font-bold text-gray-900 text-xs truncate group-hover:text-brand-green transition">
                        {video.title}
                      </h4>
                      {video.duration && (
                        <p className="text-[10px] text-gray-400 mt-1 font-medium">Thời lượng: {video.duration}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => handleRemoveBookmark('video', video._id, e)}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer border border-transparent hover:border-red-100"
                      title="Xóa khỏi lưu trữ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="p-2 rounded-xl bg-brand-light text-brand-green group-hover:bg-brand-green group-hover:text-white transition">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Content Rendering: 3. Podcasts */}
      {activeSubTab === 'podcast' && (
        podcastsList.length === 0 ? (
          <div className="bg-white p-10 rounded-[2rem] border border-gray-100 text-center text-xs text-gray-500 shadow-sm space-y-4 max-w-md mx-auto">
            <div className="text-4xl">🎙️</div>
            <p className="font-semibold text-gray-600">Bé chưa lưu tập Podcast nào.</p>
            <p className="text-gray-400 leading-relaxed">Hãy khám phá các tập Podcast phương pháp luyện đọc tiếng Anh và nhấn "Lưu bài học" để xem lại nhé!</p>
            <button
              onClick={() => navigate('/podcasts')}
              className="bg-brand-green hover:bg-brand-dark text-white px-6 py-2.5 rounded-full font-bold text-xs shadow-md transition cursor-pointer"
            >
              Vào góc Podcast Readizen
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {podcastsList.map((bookmark) => {
              const podcast = bookmark.podcastEpisodeId;
              if (!podcast) return null;

              const seriesSlug = podcast.seriesId?.slug || 'readizen';
              const detailSlug = podcast.slug;

              return (
                <div
                  key={bookmark._id}
                  onClick={() => navigate(`/podcasts/${seriesSlug}/${detailSlug}`)}
                  className="bg-white p-4 rounded-[2rem] border border-gray-150 shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 relative">
                      <img
                        src={podcast.thumbnailAsset?.assetUrl || 'https://placehold.co/160x120?text=Podcast'}
                        alt={podcast.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/160x120?text=Podcast';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white fill-white opacity-80" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[9px] font-black uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                          Tập {podcast.episodeNumber}
                        </span>
                        {podcast.smartCode && (
                          <span className="text-[9px] font-bold text-brand-green bg-brand-light px-2 py-0.5 rounded-full">
                            Mã: {podcast.smartCode}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-gray-900 text-xs truncate group-hover:text-brand-green transition">
                        {podcast.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 truncate">{podcast.seriesId?.title || 'Readizen Podcast'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => handleRemoveBookmark('podcast', podcast._id, e)}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer border border-transparent hover:border-red-100"
                      title="Xóa khỏi lưu trữ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="p-2 rounded-xl bg-brand-light text-brand-green group-hover:bg-brand-green group-hover:text-white transition">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Content Rendering: 4. Alphabet */}
      {activeSubTab === 'alphabet' && (
        alphabetList.length === 0 ? (
          <div className="bg-white p-10 rounded-[2rem] border border-gray-100 text-center text-xs text-gray-500 shadow-sm space-y-4 max-w-md mx-auto">
            <div className="text-4xl">🔤</div>
            <p className="font-semibold text-gray-600">Bé chưa lưu chữ cái nào.</p>
            <p className="text-gray-400 leading-relaxed">Hãy cùng bé học Bảng chữ cái SmartABC và lưu lại chữ cái cần rèn luyện nhé!</p>
            <button
              onClick={() => navigate('/smartabc')}
              className="bg-brand-green hover:bg-brand-dark text-white px-6 py-2.5 rounded-full font-bold text-xs shadow-md transition cursor-pointer"
            >
              Học Bảng chữ cái SmartABC
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {alphabetList.map((bookmark) => {
              const item = bookmark.alphabetLessonId;
              if (!item) return null;

              return (
                <div
                  key={bookmark._id}
                  onClick={() => navigate(`/smartabc/${item._id}`)}
                  className="bg-white p-4 rounded-3xl border border-gray-150 shadow-sm hover:shadow-md transition duration-200 text-center cursor-pointer group relative"
                >
                  <button
                    onClick={(e) => handleRemoveBookmark('alphabet', item._id, e)}
                    className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                    title="Xóa khỏi lưu trữ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-light/50 text-brand-green font-black text-2xl flex items-center justify-center mb-2 border border-brand-green/20 group-hover:scale-105 transition-transform">
                    {item.letter}
                  </div>
                  <p className="font-bold text-gray-800 text-xs">Chữ cái {item.letter}</p>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
