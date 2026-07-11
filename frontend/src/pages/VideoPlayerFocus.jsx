import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/axios.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import CustomVideoPlayer from '../components/CustomVideoPlayer.jsx';
import { Loader2, AlertCircle, Tv, Video, Play } from 'lucide-react';

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" stroke="none">
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function VideoPlayerFocus() {
  const { slug, lessonSlug } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [topic, setTopic] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch current video lesson details
        const lessonRes = await api.get(`/videos/topics/${slug}/lessons/${lessonSlug}`);
        setLesson(lessonRes.data);
        
        // Fetch the topic and its list of lessons (without limit/page parameters to fetch all)
        const topicRes = await api.get(`/videos/topics/${slug}`);
        setTopic(topicRes.data);
        setLessons(topicRes.data.lessons || []);
      } catch (err) {
        console.error('Lỗi khi tải chi tiết video bài học:', err);
        setError(err.response?.data?.message || 'Không thể kết nối đến máy chủ.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug, lessonSlug]);

  const renderSourceBadge = (type) => {
    switch (type) {
      case 'youtube':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-red-100 bg-red-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-red-650">
            <YoutubeIcon />
            YouTube
          </span>
        );
      case 'tiktok':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
            <Tv className="h-2.5 w-2.5" />
            TikTok
          </span>
        );
      case 'upload':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-blue-650">
            <Video className="h-2.5 w-2.5" />
            Trực tiếp
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(68,166,92,0.08),transparent_30%),linear-gradient(180deg,#FFFDF3_0%,#F9FAF4_50%,#FFFDF3_100%)] flex flex-col font-sans antialiased text-gray-800 pt-20 lg:pt-24">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
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
            <Link
              to={`/videos/${slug}`}
              className="inline-flex items-center justify-center bg-brand-green hover:bg-brand-dark text-white px-6 py-2.5 rounded-full text-xs font-bold transition shadow"
            >
              Quay lại danh sách bài giảng
            </Link>
          </div>
        )}

        {/* Focus Mode Player Screen */}
        {lesson && !isLoading && !error && (() => {
          const isPortrait = lesson.aspectRatio === '9:16';
          const layoutWidthClass = isPortrait ? 'max-w-[340px] w-full' : 'w-full';

          return (
            <div className="w-full flex flex-col animate-in fade-in duration-300">
              {/* Top Breadcrumb Navigation */}
              <div className="flex items-center gap-2 mb-6 text-[10px] sm:text-xs font-black uppercase tracking-wider text-gray-400">
                <Link to="/videos" className="hover:text-brand-green transition">Chủ đề Video</Link>
                <span className="text-gray-300">/</span>
                <Link to={`/videos/${slug}`} className="hover:text-brand-green transition truncate max-w-[150px] sm:max-w-xs">{topic?.title || 'Chủ đề'}</Link>
                <span className="text-gray-300">/</span>
                <span className="text-brand-green truncate max-w-[150px] sm:max-w-xs">{lesson.title}</span>
              </div>

              {/* YouTube-style 2-column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
                
                {/* Left Column: Player & Info */}
                <div className="flex flex-col items-center w-full">
                  {/* Custom Video Player Container */}
                  <div className={`${layoutWidthClass} w-full flex justify-center bg-black/5 rounded-[24px] overflow-hidden p-2 sm:p-4 mb-6 shadow-inner border border-gray-100`}>
                    <CustomVideoPlayer
                      videoType={lesson.videoType}
                      videoUrl={lesson.videoUrl}
                      thumbnail={lesson.thumbnail}
                      aspectRatio={lesson.aspectRatio}
                    />
                  </div>

                  {/* Lesson Title & Description */}
                  <div className={`${layoutWidthClass} text-left bg-white border border-gray-100 rounded-[28px] p-6 sm:p-8 shadow-sm`}>
                    <div className="flex flex-wrap items-center gap-2.5 mb-3">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#D29E0B] bg-brand-yellow/20 px-2.5 py-1 rounded-full border border-brand-yellow/10">
                        {topic?.title || 'Bài học'}
                      </span>
                      {renderSourceBadge(lesson.videoType)}
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                      {lesson.title}
                    </h1>
                    {lesson.duration && (
                      <p className="text-xs text-gray-500 font-bold mt-3">
                        Thời lượng bài học: {lesson.duration}
                      </p>
                    )}
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
                          className={`group flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all duration-200 border ${
                            isCurrent
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
                            <h4 className={`text-xs font-extrabold leading-snug line-clamp-2 transition-colors ${
                              isCurrent ? 'text-brand-green' : 'text-gray-800 group-hover:text-brand-green'
                            }`}>
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-1.5 text-[9px] font-bold text-gray-400">
                              <span className="text-brand-green">Bài {idx + 1}</span>
                              <span>•</span>
                              <span>{item.duration || '--:--'}</span>
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
