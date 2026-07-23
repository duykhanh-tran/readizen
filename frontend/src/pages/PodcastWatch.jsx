import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Sparkles, Headphones, Share2, FileText, ChevronDown, ChevronLeft, ChevronRight, Loader2, AlertCircle, Play, BookOpen, ListVideo, Bookmark } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/axios.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import AdaptivePlayerEngine from '../components/podcast/AdaptivePlayerEngine.jsx';
import { siteSocialLinks } from '../config/siteSocialLinks.js';

// Social Brand SVG Icons
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TiktokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.29-2.65.74-5.32 2.76-7.04 1.58-1.35 3.69-2.03 5.77-1.87.03 1.44.02 2.89.02 4.33-1.27-.13-2.58.22-3.58 1.01-1.02.8-1.57 2.08-1.48 3.35.06 1.14.65 2.21 1.6 2.84.97.64 2.19.82 3.3.52 1.13-.28 2.11-1.08 2.58-2.14.38-.85.5-1.8.48-2.73.02-4.83.01-9.66.01-14.49z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export default function PodcastWatch() {
  const { seriesSlug, episodeSlug } = useParams();
  const navigate = useNavigate();

  const [episode, setEpisode] = useState(null);
  const [seriesPlaylist, setSeriesPlaylist] = useState([]);
  const [relatedEpisodes, setRelatedEpisodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // States
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [isMobilePlaylistOpen, setIsMobilePlaylistOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  // Shared Dynamic Content Panel Tab: 'none' | 'audio' | 'vocab' | 'transcript'
  const [activeTab, setActiveTab] = useState('none');

  useEffect(() => {
    const fetchEpisodeData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.get(`/podcasts/series/${seriesSlug}/episodes/${episodeSlug}`);
        setEpisode(res.data.episode);
        setSeriesPlaylist(res.data.seriesPlaylist || []);
        setRelatedEpisodes(res.data.relatedEpisodes || []);
      } catch (err) {
        console.error('Lỗi khi tải tập Podcast:', err);
        setError(err.response?.data?.message || 'Không thể kết nối đến máy chủ.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEpisodeData();
  }, [seriesSlug, episodeSlug]);

  // Check Bookmark status for this podcast episode
  useEffect(() => {
    if (episode?._id) {
      api.get(`/bookmarks/status?itemType=podcast&itemId=${episode._id}`)
        .then(res => setIsBookmarked(res.data.bookmarked))
        .catch(err => console.error('Lỗi kiểm tra bookmark status:', err));
    }
  }, [episode]);

  const handleToggleBookmark = async () => {
    if (!episode?._id) return;
    try {
      const res = await api.post('/bookmarks/toggle', { itemType: 'podcast', itemId: episode._id });
      setIsBookmarked(res.data.bookmarked);
      if (res.data.bookmarked) {
        toast.success('Đã lưu tập Podcast vào danh sách bài học đã lưu!');
      } else {
        toast('Đã bỏ lưu tập Podcast.', { icon: 'ℹ️' });
      }
    } catch (err) {
      console.error('Lỗi toggle bookmark:', err);
      toast.error('Vui lòng đăng nhập để lưu bài học!');
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
        .then(() => toast.success('Đã sao chép liên kết tập Podcast!'))
        .catch(() => toast.error('Không thể sao chép liên kết.'));
    } else {
      toast.success('Hãy sao chép liên kết trên thanh địa chỉ nhé!');
    }
  };

  const handleToggleTab = (tabName) => {
    setActiveTab(prev => (prev === tabName ? 'none' : tabName));
  };

  // Helper calculation for Previous / Next episode navigation
  const currentIndex = seriesPlaylist.findIndex(item => item.slug === episodeSlug);
  const prevEpisode = currentIndex > 0 ? seriesPlaylist[currentIndex - 1] : null;
  const nextEpisode = currentIndex >= 0 && currentIndex < seriesPlaylist.length - 1 ? seriesPlaylist[currentIndex + 1] : null;

  const handlePrevClick = () => {
    if (prevEpisode) {
      navigate(`/podcasts/${seriesSlug}/${prevEpisode.slug}`);
    }
  };

  const handleNextClick = () => {
    if (nextEpisode) {
      navigate(`/podcasts/${seriesSlug}/${nextEpisode.slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-gray-900 font-sans antialiased overflow-x-hidden flex flex-col pt-20 lg:pt-24 text-left">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-16 w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-28">
            <Loader2 className="w-10 h-10 animate-spin text-brand-green" />
            <p className="mt-4 text-sm font-bold text-gray-500">Đang tải nội dung tập Podcast...</p>
          </div>
        ) : error ? (
          <div className="mx-auto my-12 max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Không thể tải tập Podcast</h3>
            <p className="mb-6 mt-2 text-xs leading-relaxed text-gray-500">{error}</p>
            <button
              type="button"
              onClick={() => navigate('/podcasts')}
              className="rounded-full bg-brand-green px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-brand-dark cursor-pointer"
            >
              Quay lại Podcast Hub
            </button>
          </div>
        ) : episode && (
          <div className="lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-8 lg:pt-6">

            {/* ================= LEFT MAIN CONTENT (8 Columns) ================= */}
            <div className="lg:col-span-8 xl:col-span-8 bg-white lg:bg-transparent">

              {/* ADAPTIVE VIDEO PLAYER ENGINE */}
              <section className="relative">
                <AdaptivePlayerEngine
                  mediaSource={episode.mediaSource}
                  videoUrl={episode.videoUrl}
                  externalVideoId={episode.externalVideoId}
                  aspectRatio={episode.aspectRatio}
                  thumbnail={episode.thumbnailAsset?.assetUrl}
                  title={episode.title}
                />
              </section>

              {/* VIDEO METADATA SECTION */}
              <section className="px-4 sm:px-0 pt-4 pb-4 lg:pt-5 lg:pb-5 border-b border-gray-100 lg:border-none">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-snug tracking-tight">
                  {episode.title}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm text-gray-500 font-semibold">
                  <Link to={`/podcasts/${seriesSlug}`} className="hover:text-brand-green transition underline font-bold">
                    {episode.seriesId?.title || 'Readizen Podcast'}
                  </Link>
                  <span aria-hidden="true">•</span>
                  <span className="font-bold">Tập {episode.episodeNumber}</span>
                  {episode.smartCode && (
                    <>
                      <span aria-hidden="true">•</span>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-brand-green" />
                        <span className="text-gray-600 font-medium">Smart Code:</span>
                        <span className="text-brand-green font-extrabold tracking-wider">{episode.smartCode}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Channel / Host Row */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-brand-green text-white flex items-center justify-center flex-shrink-0 text-xl font-bold shadow-sm">
                      🦉
                    </div>
                    <div className="min-w-0">
                      <p className="font-extrabold text-gray-900 leading-none truncate">
                        {episode.seriesId?.title || 'Readizen Podcast'}
                      </p>
                      <p className="text-xs text-gray-500 font-semibold mt-1 truncate">
                        {episode.seriesId?.host || 'Luyện đọc tiếng Anh tại nhà'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* REDESIGNED ACTION TOOLBAR (Grouping Lesson Tools & Social Channels cleanly) */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-150 shadow-soft">
                  {/* Left Group: Lesson Tools & Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* 0. Lưu bài học Button */}
                    <button
                      type="button"
                      onClick={handleToggleBookmark}
                      className={`h-9 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${isBookmarked ? 'bg-brand-green text-white shadow-sm' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                      <span>{isBookmarked ? 'Đã lưu' : 'Lưu bài học'}</span>
                    </button>

                    {episode.audioAsset?.assetUrl && (
                      <button
                        type="button"
                        onClick={() => handleToggleTab('audio')}
                        className={`h-9 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${activeTab === 'audio' ? 'bg-brand-green text-white shadow-sm' : 'bg-brand-light/80 text-brand-green hover:bg-brand-mint'}`}
                      >
                        <Headphones className="w-3.5 h-3.5" /> Audio MP3
                      </button>
                    )}

                    {episode.relatedVocabulary && episode.relatedVocabulary.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleToggleTab('vocab')}
                        className={`h-9 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${activeTab === 'vocab' ? 'bg-brand-green text-white shadow-sm' : 'bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100'}`}
                      >
                        <BookOpen className="w-3.5 h-3.5" /> Từ mới ({episode.relatedVocabulary.length})
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleToggleTab('transcript')}
                      className={`h-9 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${activeTab === 'transcript' ? 'bg-brand-green text-white shadow-sm' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                      <FileText className="w-3.5 h-3.5" /> Transcript
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="h-9 px-3.5 rounded-xl bg-gray-100 text-gray-800 font-bold text-xs flex items-center gap-1.5 hover:bg-gray-200 transition cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Chia sẻ
                    </button>
                  </div>

                  {/* Right Group: Official Social Brand Channels */}
                  <div className="flex items-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    {siteSocialLinks.youtube && (
                      <a
                        href={siteSocialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-9 px-3 rounded-xl bg-red-50 text-red-600 border border-red-200/60 font-bold text-xs flex items-center gap-1 hover:bg-red-100 transition"
                        title="Kênh YouTube Readizen"
                      >
                        <YoutubeIcon /> <span className="hidden xs:inline">YouTube</span>
                      </a>
                    )}
                    {siteSocialLinks.tiktok && (
                      <a
                        href={siteSocialLinks.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-9 px-3 rounded-xl bg-zinc-900 text-white font-bold text-xs flex items-center gap-1 hover:bg-black transition"
                        title="Kênh TikTok Readizen"
                      >
                        <TiktokIcon /> <span className="hidden xs:inline">TikTok</span>
                      </a>
                    )}
                    {siteSocialLinks.facebook && (
                      <a
                        href={siteSocialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-9 px-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60 font-bold text-xs flex items-center gap-1 hover:bg-blue-100 transition"
                        title="Trang Facebook Readizen"
                      >
                        <FacebookIcon /> <span className="hidden xs:inline">Facebook</span>
                      </a>
                    )}
                  </div>
                </div>
              </section>

              {/* MOBILE & TABLET COLLAPSIBLE PLAYLIST ACCORDION (YouTube Style) */}
              <section className="lg:hidden px-4 sm:px-0 py-2">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
                  <div className="p-4 flex items-center justify-between gap-2 border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => setIsMobilePlaylistOpen(!isMobilePlaylistOpen)}
                      className="flex items-center gap-2 text-left flex-grow min-w-0"
                    >
                      <ListVideo className="w-5 h-5 text-brand-green shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-brand-green uppercase tracking-wider">Playlist Series ({seriesPlaylist.length} tập)</p>
                        <h3 className="text-xs font-extrabold text-gray-900 truncate">{episode.seriesId?.title}</h3>
                      </div>
                    </button>

                    {/* Navigation Buttons: Bài trước & Bài sau */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={handlePrevClick}
                        disabled={!prevEpisode}
                        className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                        title="Bài trước"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextClick}
                        disabled={!nextEpisode}
                        className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                        title="Bài sau"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsMobilePlaylistOpen(!isMobilePlaylistOpen)}
                        className="p-1.5 text-gray-500"
                      >
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isMobilePlaylistOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Playlist Items */}
                  {isMobilePlaylistOpen && (
                    <div className="max-h-72 overflow-y-auto scrollbar-custom divide-y divide-gray-100 bg-gray-50/50">
                      {seriesPlaylist.map((item) => {
                        const isCurrent = item.slug === episodeSlug;
                        return (
                          <Link
                            key={item._id}
                            to={`/podcasts/${seriesSlug}/${item.slug}`}
                            className={`flex gap-3 p-3 transition group ${isCurrent ? 'bg-brand-light/50 border-l-4 border-brand-green' : 'hover:bg-gray-100'}`}
                          >
                            <div className="w-24 aspect-video rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-base shrink-0 relative overflow-hidden">
                              <img
                                src={item.thumbnailAsset?.assetUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=200&auto=format&fit=crop'}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=200&auto=format&fit=crop'; }}
                              />
                              {isCurrent && (
                                <div className="absolute inset-0 bg-brand-green/20 flex items-center justify-center">
                                  <span className="bg-brand-green text-white p-1 rounded-full animate-pulse">
                                    <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex flex-col justify-center">
                              <p className={`text-xs font-bold line-clamp-2 ${isCurrent ? 'text-brand-green' : 'text-gray-900'}`}>
                                Tập {item.episodeNumber}: {item.title}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>

              {/* TÓM TẮT NỘI DUNG TẬP - LUÔN LUÔN HIỂN THỊ */}
              <section className="px-4 sm:px-0 py-3 lg:py-0 lg:mt-1 border-b border-gray-100 lg:border-none">
                <div className="bg-gray-100 rounded-2xl overflow-hidden transition-all duration-300">
                  <button
                    type="button"
                    onClick={() => setIsSummaryOpen(!isSummaryOpen)}
                    className="w-full text-left p-4 lg:p-5 outline-none focus:outline-none flex items-start justify-between gap-3 cursor-pointer"
                  >
                    <div>
                      <p className="text-sm lg:text-base font-extrabold text-gray-900">
                        Tóm tắt nội dung tập
                      </p>
                      <p className="mt-1 text-xs lg:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {episode.summary || 'Chưa có thông tin tóm tắt nội dung cho tập này.'}
                      </p>
                    </div>

                    <div className={`mt-1 text-gray-500 transition-transform duration-300 ${isSummaryOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                </div>
              </section>

              {/* KHUNG NỘI DUNG ĐỘNG DÙNG CHUNG (AUDIO / TỪ MỚI / TRANSCRIPT) */}
              {activeTab !== 'none' && (
                <section className="px-4 sm:px-0 py-4 lg:mt-4 transition-all duration-300">
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-soft space-y-4">
                    {/* Panel Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                        {activeTab === 'audio' && (
                          <>
                            <Headphones className="w-4 h-4 text-brand-green" />
                            Trình phát Audio MP3
                          </>
                        )}
                        {activeTab === 'vocab' && (
                          <>
                            <Sparkles className="w-4 h-4 text-amber-600" />
                            Từ Mới Liên Quan Trong Bài Học
                          </>
                        )}
                        {activeTab === 'transcript' && (
                          <>
                            <FileText className="w-4 h-4 text-brand-green" />
                            Lời Thoại Bài Học (Transcript)
                          </>
                        )}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('none')}
                        className="text-xs font-bold text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        Đóng
                      </button>
                    </div>

                    {/* Panel Body: 1. Audio MP3 */}
                    {activeTab === 'audio' && episode.audioAsset?.assetUrl && (
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-3">Thích hợp dành cho lúc ba mẹ bận rộn không tiện xem video</p>
                        <audio controls preload="metadata" className="w-full">
                          <source src={episode.audioAsset.assetUrl} type="audio/mpeg" />
                          Trình duyệt của bạn không hỗ trợ phát thẻ Audio.
                        </audio>
                      </div>
                    )}

                    {/* Panel Body: 2. Từ Mới Liên Quan */}
                    {activeTab === 'vocab' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {episode.relatedVocabulary && episode.relatedVocabulary.length > 0 ? (
                          episode.relatedVocabulary.map((v, i) => (
                            <div key={i} className="bg-amber-50/50 border border-amber-200/60 p-3 rounded-xl space-y-1">
                              <p className="text-xs font-bold text-amber-900">{v.term}</p>
                              {v.meaning && <p className="text-xs font-semibold text-gray-800">{v.meaning}</p>}
                              {v.note && <p className="text-[11px] font-medium text-gray-500 italic">{v.note}</p>}
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-400 italic">Chưa có danh sách từ mới cho tập này.</p>
                        )}
                      </div>
                    )}

                    {/* Panel Body: 3. Transcript */}
                    {activeTab === 'transcript' && (
                      <div className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto font-sans p-3 bg-gray-50 rounded-xl border border-gray-100">
                        {episode.transcript && episode.transcript.trim() ? (
                          episode.transcript
                        ) : (
                          <p className="text-gray-400 italic">Transcript của tập này đang được cập nhật.</p>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* RELATED EPISODES GRID */}
              <section className="px-4 sm:px-0 py-5 lg:mt-6">
                <h2 className="text-lg lg:text-xl font-extrabold mb-4">Các tập Podcast khác</h2>
                <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
                  {relatedEpisodes.map((rel) => (
                    <Link
                      key={rel._id}
                      to={`/podcasts/${rel.seriesId?.slug || seriesSlug}/${rel.slug}`}
                      className="flex gap-3 bg-white rounded-2xl p-3 border border-gray-150 hover:shadow-soft transition group"
                    >
                      <div className="w-36 lg:w-40 aspect-video rounded-xl bg-gray-200 flex items-center justify-center text-gray-400 text-2xl shrink-0 relative overflow-hidden">
                        <img
                          src={rel.thumbnailAsset?.assetUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=300&auto=format&fit=crop'}
                          alt={rel.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=300&auto=format&fit=crop'; }}
                        />
                        <span className="z-10 text-white group-hover:scale-110 transition-transform bg-black/40 p-2 rounded-full backdrop-blur-sm">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </span>
                      </div>
                      <div className="min-w-0 flex flex-col justify-center">
                        <h3 className="text-xs lg:text-sm font-bold leading-snug line-clamp-2 group-hover:text-brand-green transition">
                          {rel.title}
                        </h3>
                        <p className="mt-1 text-[11px] text-gray-500 font-semibold">{rel.seriesId?.title || 'Readizen Podcast'}</p>
                        <p className="text-[10px] text-brand-green font-bold mt-1">Tập {rel.episodeNumber}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

            </div>

            {/* ================= RIGHT SIDEBAR DESKTOP (4 Columns) ================= */}
            <aside className="hidden lg:block lg:col-span-4 xl:col-span-4">
              <div className="sticky top-28 space-y-5">

                {/* DESKTOP PLAYLIST WIDGET (WITH PREV/NEXT BUTTONS & SCROLLBAR) */}
                <section className="bg-white rounded-3xl border border-gray-200 shadow-soft overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-gray-100">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-grow">
                        <p className="text-[10px] font-bold text-brand-green uppercase tracking-wider">Playlist Series ({seriesPlaylist.length} tập)</p>
                        <h2 className="text-sm sm:text-base font-extrabold leading-snug mt-0.5 text-gray-900 line-clamp-2">
                          {episode.seriesId?.title}
                        </h2>
                      </div>

                      {/* Navigation Controls: Bài trước & Bài sau */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={handlePrevClick}
                          disabled={!prevEpisode}
                          className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                          title={prevEpisode ? `Bài trước: ${prevEpisode.title}` : 'Đã ở tập đầu tiên'}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextClick}
                          disabled={!nextEpisode}
                          className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                          title={nextEpisode ? `Bài sau: ${nextEpisode.title}` : 'Đã ở tập mới nhất'}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Playlist Scrollable Items List */}
                  <div className="max-h-[380px] overflow-y-auto scrollbar-custom divide-y divide-gray-100">
                    {seriesPlaylist.map((item) => {
                      const isCurrent = item.slug === episodeSlug;
                      return (
                        <Link
                          key={item._id}
                          to={`/podcasts/${seriesSlug}/${item.slug}`}
                          className={`flex gap-3 p-3.5 transition group ${isCurrent ? 'bg-brand-light/40 border-l-4 border-brand-green' : 'hover:bg-gray-50'}`}
                        >
                          <div className="w-28 aspect-video rounded-xl bg-gray-200 flex items-center justify-center text-gray-400 text-xl shrink-0 relative overflow-hidden shadow-sm">
                            <img
                              src={item.thumbnailAsset?.assetUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=200&auto=format&fit=crop'}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=200&auto=format&fit=crop'; }}
                            />
                            {isCurrent && (
                              <div className="absolute inset-0 bg-brand-green/20 backdrop-blur-[1px] flex items-center justify-center">
                                <span className="bg-brand-green text-white p-1 rounded-full animate-pulse shadow">
                                  <Play className="w-3 h-3 fill-current ml-0.5" />
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex flex-col justify-center">
                            <p className={`text-xs font-bold line-clamp-2 ${isCurrent ? 'text-brand-green' : 'text-gray-900 group-hover:text-brand-green'}`}>
                              Tập {item.episodeNumber}: {item.title}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>

              </div>
            </aside>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
