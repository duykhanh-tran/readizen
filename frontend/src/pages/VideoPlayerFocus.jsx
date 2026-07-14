import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/axios.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import CustomVideoPlayer from '../components/CustomVideoPlayer.jsx';
import { Loader2, AlertCircle, Tv, Video, Play, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" stroke="none">
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export default function VideoPlayerFocus() {
  const { slug, lessonSlug } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [topic, setTopic] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBackToTopic = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(`/videos/${slug}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const shouldFetchTopic = !topic || topic.slug !== slug;

      if (shouldFetchTopic) {
        setIsLoading(true);
      } else {
        setLessonLoading(true);
      }
      setError(null);

      try {
        if (shouldFetchTopic) {
          // Fetch both current video details and parent topic in parallel
          const [lessonRes, topicRes] = await Promise.all([
            api.get(`/videos/topics/${slug}/lessons/${lessonSlug}`),
            api.get(`/videos/topics/${slug}`)
          ]);
          setLesson(lessonRes.data);
          setTopic(topicRes.data);
          setLessons(topicRes.data.lessons || []);
        } else {
          // Only fetch current video details
          const lessonRes = await api.get(`/videos/topics/${slug}/lessons/${lessonSlug}`);
          setLesson(lessonRes.data);
        }
      } catch (err) {
        console.error('Lỗi khi tải chi tiết video bài học:', err);
        setError(err.response?.data?.message || 'Không thể kết nối đến máy chủ.');
      } finally {
        setIsLoading(false);
        setLessonLoading(false);
      }
    };
    fetchData();
  }, [slug, lessonSlug]);

  const renderSourceBadge = (type) => {
    switch (type) {
      case 'youtube':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-55/5 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-red-650 shadow-sm">
            <YoutubeIcon />
            YouTube
          </span>
        );
      case 'tiktok':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-950 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-white border border-zinc-850 shadow-sm">
            <Tv className="h-2.5 w-2.5" />
            TikTok
          </span>
        );
      case 'upload':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50/40 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-blue-650 shadow-sm">
            <Video className="h-2.5 w-2.5" />
            Trực tiếp
          </span>
        );
      default:
        return null;
    }
  };
  const isPortrait = lesson?.aspectRatio === '9:16';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(68,166,92,0.08),transparent_30%),linear-gradient(180deg,#FFFDF3_0%,#F9FAF4_50%,#FFFDF3_100%)] flex flex-col font-sans antialiased text-gray-800 pt-20 lg:pt-24">
      <Header />

      <main className={`flex-grow mx-auto px-4 sm:px-6 py-8 w-full transition-all duration-300 ${isPortrait ? 'max-w-[760px]' : 'max-w-7xl'}`}>
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-brand-green" />
            <p className="text-sm text-gray-500 font-bold mt-4">Đang tải bài giảng video...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="max-w-md w-full bg-white border border-red-100 rounded-3xl p-8 text-center shadow-lg my-12 mx-auto animate-in fade-in duration-200">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-gray-800 text-lg">Không thể tải video</h3>
            <p className="text-xs text-gray-500 mt-2 mb-6 leading-relaxed">{error}</p>
            <button
              onClick={handleBackToTopic}
              className="inline-flex items-center justify-center bg-brand-green hover:bg-brand-dark text-white px-6 py-2.5 rounded-full text-xs font-bold transition shadow cursor-pointer"
            >
              Quay lại danh sách bài giảng
            </button>
          </div>
        )}         {lesson && !isLoading && !error && (() => {
          const isPortrait = lesson.aspectRatio === '9:16';
          const layoutWidthClass = isPortrait ? 'max-w-[340px] w-full' : 'w-full';
          const currentIndex = lessons.findIndex(item => item.slug === lessonSlug);
          const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
          const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

          return (
            <div className="w-full flex flex-col animate-in fade-in duration-300">
              {/* Top Breadcrumb Navigation */}
              <div className="flex items-center gap-2 mb-6 text-[10px] sm:text-xs font-black uppercase tracking-wider text-gray-400">
                <Link to="/videos" className="hover:text-brand-green transition">Chủ đề Video</Link>
                <span className="text-gray-300">/</span>
                <button
                  onClick={handleBackToTopic}
                  className="hover:text-brand-green transition truncate max-w-[150px] sm:max-w-xs font-black uppercase tracking-wider text-gray-400 bg-transparent border-none p-0 cursor-pointer"
                >
                  {topic?.title || 'Chủ đề'}
                </button>
                <span className="text-gray-300">/</span>
                <span className="text-brand-green truncate max-w-[150px] sm:max-w-xs">{lesson.title}</span>
              </div>

              {/* YouTube-style 2-column Grid */}
              <div className={`grid grid-cols-1 gap-8 items-start ${isPortrait ? 'lg:grid-cols-[340px_1fr]' : 'lg:grid-cols-[1fr_360px]'}`}>

                {/* Left Column: Player & Info */}
                <div className="flex flex-col items-center w-full">
                  {/* Custom Video Player Container */}
                  <div className={`${layoutWidthClass} w-full flex justify-center bg-black/5 rounded-[24px] overflow-hidden p-2 sm:p-4 mb-6 shadow-inner border border-gray-100 relative`}>
                    {lessonLoading && (
                      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm z-10 flex items-center justify-center transition-all duration-200 rounded-[24px]">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                    <CustomVideoPlayer
                      key={lesson._id}
                      videoType={lesson.videoType}
                      videoUrl={lesson.videoUrl}
                      thumbnail={lesson.thumbnail}
                      aspectRatio={lesson.aspectRatio}
                    />
                  </div>

                  {/* Navigation Buttons */}
                  <div className={`${layoutWidthClass} flex items-center justify-between gap-4 mb-6`}>
                    <button
                      onClick={() => {
                        if (prevLesson) {
                          navigate(`/videos/${slug}/${prevLesson.slug}`);
                        }
                      }}
                      disabled={!prevLesson || lessonLoading}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 hover:text-brand-green font-bold text-xs shadow-sm transition-all duration-200 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Bài trước</span>
                    </button>

                    <span className="text-[10px] sm:text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200/50">
                      Bài {currentIndex !== -1 ? currentIndex + 1 : 1} / {lessons.length}
                    </span>

                    <button
                      onClick={() => {
                        if (nextLesson) {
                          navigate(`/videos/${slug}/${nextLesson.slug}`);
                        }
                      }}
                      disabled={!nextLesson || lessonLoading}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 hover:text-brand-green font-bold text-xs shadow-sm transition-all duration-200 cursor-pointer"
                    >
                      <span>Bài sau</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Lesson Title & Description */}
                  <div className={`${layoutWidthClass} text-left bg-white border border-gray-150 rounded-[32px] p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.03)] transition-all duration-350 w-full relative overflow-hidden ${lessonLoading ? 'opacity-50' : 'opacity-100'}`}>
                    {/* Decorative Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-yellow via-brand-green to-blue-400 opacity-90" />

                    <div className="flex flex-wrap items-center gap-2.5 mb-4">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#B28200] bg-brand-yellow/15 px-3 py-1 rounded-full border border-brand-yellow/20">
                        {topic?.title || 'Bài học'}
                      </span>
                      {renderSourceBadge(lesson.videoType)}
                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wide text-brand-green bg-brand-light/30 px-3 py-1 rounded-full border border-brand-green/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                        Đang phát
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-5 tracking-tight">
                      {lesson.title}
                    </h1>

                    {/* Educational Guide Card */}
                    <div className="bg-[#FAFDF6]/60 border border-brand-green/10 rounded-2xl p-4.5 mb-6 space-y-2.5">
                      <h3 className="text-xs font-black text-brand-green uppercase tracking-wider flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-brand-green" />
                        Hướng dẫn học cho Bé
                      </h3>
                      <ul className="space-y-1.5 text-xs font-semibold text-gray-600 list-disc pl-4 leading-relaxed">
                        <li>Lắng nghe thật kỹ cách phát âm và khẩu hình của thầy cô trong video.</li>
                        <li>Nhắc lại thật to chữ cái và từ vựng tương ứng khi video yêu cầu.</li>
                        <li>Sử dụng các nút <strong>Bài trước / Bài sau</strong> để dễ dàng ôn tập và chuyển tiếp bài học.</li>
                      </ul>
                    </div>


                  </div>
                </div>

                {/* Right Column: Playlist Sidebar (YouTube-style) */}
                <div className="w-full lg:sticky lg:top-24 bg-white border border-gray-100 rounded-[28px] p-5 sm:p-6 shadow-sm flex flex-col h-[580px]">
                  {/* Sidebar Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4 shrink-0">
                    <div className="min-w-0">
                      <span className="text-[9px] font-black uppercase tracking-widest text-brand-green">Chủ đề học tập</span>
                      <h3 className="font-extrabold text-xs text-gray-900 truncate mt-0.5">{topic?.title}</h3>
                    </div>
                    <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md shrink-0 ml-2">
                      {lessons.length} bài
                    </span>
                  </div>

                  {/* Scroll Area of other videos */}
                  <div className="flex-grow overflow-y-auto pr-1 space-y-3 scrollbar-thin">
                    {lessons.map((item, idx) => {
                      const isCurrent = item.slug === lessonSlug;
                      return (
                        <div
                          key={item._id}
                          onClick={() => {
                            if (!isCurrent) {
                              navigate(`/videos/${slug}/${item.slug}`);
                            }
                          }}
                          className={`group flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all duration-200 border ${isCurrent
                            ? 'bg-brand-light/30 border-brand-green/20'
                            : 'bg-transparent border-transparent hover:bg-gray-50'
                            }`}
                        >
                          {/* Item Thumbnail */}
                          <div className="w-24 aspect-video rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100 relative shadow-sm">
                            <img
                              src={item.thumbnail || topic?.thumbnail || 'https://placehold.co/160x90?text=Video'}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = 'https://placehold.co/160x90?text=Video' }}
                            />
                            {isCurrent && (
                              <div className="absolute inset-0 bg-brand-green/10 flex items-center justify-center">
                                <span className="bg-brand-green text-white p-1 rounded-full shadow-sm animate-pulse">
                                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Item Metadata */}
                          <div className="min-w-0 flex-grow">
                            <h4 className={`text-xs font-extrabold leading-snug line-clamp-2 transition-colors ${isCurrent ? 'text-brand-green' : 'text-gray-800 group-hover:text-brand-green'
                              }`}>
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-1.5 text-[9px] font-bold text-gray-400">
                              <span className="text-brand-green">Bài {idx + 1}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          );
        })()}
      </main>

      <Footer />
    </div>
  );
}
