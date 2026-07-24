import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Headphones, Sparkles, Play, Tv, Film, ChevronLeft, ChevronRight, Loader2, AlertCircle, Search, X, Star, ArrowRight, ListVideo, Clock, Heart } from 'lucide-react';
import api from '../services/axios.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const formatDate = (dateString) => {
  if (!dateString) return 'Mới đăng';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Mới đăng';
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export default function PodcastHub() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentView = searchParams.get('view') || 'all'; // 'all' | 'long' | 'short' | 'playlist'
  const currentQuery = searchParams.get('q') || '';

  const [searchInput, setSearchInput] = useState(currentQuery);
  const [hubData, setHubData] = useState({
    featuredSeries: [],
    latestShorts: [],
    latestEpisodes: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Horizontal Scroll Refs
  const longVideosScrollRef = useRef(null);
  const shortsScrollRef = useRef(null);

  const heroBgImage = '/assets/podcast_1.jpeg';

  const handleScroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Sync search input if URL query changes
  useEffect(() => {
    setSearchInput(currentQuery);
  }, [currentQuery]);

  // Debounced search sync to URL
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== currentQuery) {
        setSearchParams(prev => {
          const updated = new URLSearchParams(prev);
          if (searchInput.trim()) {
            updated.set('q', searchInput.trim());
          } else {
            updated.delete('q');
          }
          return updated;
        }, { replace: true });
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput, currentQuery, setSearchParams]);

  // Fetch hub data
  useEffect(() => {
    const fetchHubData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const queryParam = currentQuery ? `&q=${encodeURIComponent(currentQuery)}` : '';
        const res = await api.get(`/podcasts/hub?view=${currentView}${queryParam}`);
        setHubData(res.data);
      } catch (err) {
        console.error('Lỗi khi tải Podcast Hub:', err);
        setError('Không thể kết nối đến máy chủ.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHubData();
  }, [currentView, currentQuery]);

  const setView = (view) => {
    setSearchParams(prev => {
      const updated = new URLSearchParams(prev);
      updated.set('view', view);
      return updated;
    }, { replace: true });
  };

  const { featuredSeries, latestShorts, latestEpisodes } = hubData;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-gray-900 font-sans antialiased selection:bg-brand-light/40 overflow-x-hidden flex flex-col">
      <Header />

      {/* ================= SECTION 1: HERO (Đồng bộ font & layout trang Videos, Library) ================= */}
      <header className="relative w-full py-20 lg:py-32 min-h-[520px] flex items-center overflow-hidden font-sans">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBgImage}
            alt="Podcast Readizen Hero Background"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/98 via-white/85 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent z-10"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full mt-10 md:mt-6 text-left">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white/85 backdrop-blur-sm border border-brand-green/20 text-brand-green text-xs sm:text-sm font-bold mb-4 shadow-sm">
              <Star className="w-4 h-4 fill-brand-green text-brand-green" />
              <span>Góc Podcast Readizen dành cho Ba Mẹ & Học Sinh</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
              Luyện đọc tiếng Anh <br />
              <span className="text-brand-green">Cùng con ngay tại nhà</span>
            </h1>

            <p className="text-base lg:text-xl text-gray-700 mb-8 max-w-2xl leading-relaxed font-semibold">
              Tổng hợp các bài học âm thanh, video chia sẻ phương pháp luyện đọc chuẩn bản ngữ, hướng dẫn thực hành 30s và truyện ngắn truyền cảm hứng đọc sách cho trẻ.
            </p>
          </div>
        </div>
      </header>

      {/* ================= SECTION 2: BỐ CỤC KHUNG TABS (Home | Videos | Shorts | Podcasts | 🔍) ================= */}
      <main id="podcast-content" className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left font-sans">
        
        {/* Top Horizontal Bar matching user prototype layout */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-3 mb-8">
          
          {/* Horizontal Navigation Links */}
          <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto hide-scrollbar text-sm sm:text-base font-bold">
            <button
              type="button"
              onClick={() => setView('all')}
              className={`pb-2.5 transition relative whitespace-nowrap cursor-pointer text-sm sm:text-base ${currentView === 'all' ? 'text-gray-900 font-extrabold border-b-2 border-brand-green' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => setView('long')}
              className={`pb-2.5 transition relative whitespace-nowrap cursor-pointer text-sm sm:text-base ${currentView === 'long' ? 'text-gray-900 font-extrabold border-b-2 border-brand-green' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Videos 
            </button>
            <button
              type="button"
              onClick={() => setView('short')}
              className={`pb-2.5 transition relative whitespace-nowrap cursor-pointer text-sm sm:text-base ${currentView === 'short' ? 'text-gray-900 font-extrabold border-b-2 border-brand-green' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Shorts 
            </button>
            <button
              type="button"
              onClick={() => setView('playlist')}
              className={`pb-2.5 transition relative whitespace-nowrap cursor-pointer text-sm sm:text-base ${currentView === 'playlist' ? 'text-gray-900 font-extrabold border-b-2 border-brand-green' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Playlist
            </button>
          </div>

          {/* Search Bar Input with Search Icon 🔍 */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm kiếm tập podcast..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-semibold focus:border-brand-green focus:outline-none transition shadow-sm"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Loading / Error States */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Loader2 className="w-10 h-10 animate-spin text-brand-green" />
            <p className="text-xs text-gray-500 font-bold mt-3">Đang tải góc Podcast Readizen...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-red-100 p-8 text-center shadow-lg my-8">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 text-base">Không thể tải Podcast</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-brand-green hover:bg-brand-dark text-white rounded-full text-xs font-bold transition shadow-md cursor-pointer"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div className="space-y-14">
            
            {/* ================= TẦNG 1 (TRÊN CÙNG): VIDEO DÀI (16:9) VỚI NÚT LƯỚT SANG PHẢI / TRÁI ================= */}
            {(currentView === 'all' || currentView === 'long') && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                      <Film className="w-5 h-5 text-brand-green" />
                      Podcasts
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 font-semibold">Tập bài học chất lượng cao, chữ hiển thị rõ ràng ngay phía dưới video</p>
                  </div>

                  {/* Navigation Arrows for Left / Right Scrolling */}
                  {latestEpisodes.length > 0 && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleScroll(longVideosScrollRef, 'left')}
                        className="w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-brand-green hover:text-white hover:border-brand-green transition flex items-center justify-center shadow-xs cursor-pointer"
                        title="Lướt sang trái"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleScroll(longVideosScrollRef, 'right')}
                        className="w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-brand-green hover:text-white hover:border-brand-green transition flex items-center justify-center shadow-xs cursor-pointer"
                        title="Lướt sang phải"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {latestEpisodes.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 text-gray-400">
                    <p className="text-xs font-semibold">Không tìm thấy video dài nào phù hợp.</p>
                  </div>
                ) : (
                  <div
                    ref={longVideosScrollRef}
                    className="flex gap-5 overflow-x-auto hide-scrollbar pb-4 pt-1 snap-x scroll-smooth"
                  >
                    {latestEpisodes.map((ep) => (
                      <Link
                        key={ep._id}
                        to={`/podcasts/${ep.seriesId?.slug || 'single'}/${ep.slug}`}
                        className="group shrink-0 w-72 sm:w-80 md:w-88 flex flex-col cursor-pointer snap-start"
                      >
                        {/* 16:9 Rectangle Thumbnail Container */}
                        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-900 relative shadow-sm border border-gray-200/90 group-hover:shadow-md transition">
                          <img
                            src={ep.thumbnailAsset?.assetUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=500&auto=format&fit=crop'}
                            alt={ep.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=500&auto=format&fit=crop'; }}
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="w-11 h-11 rounded-full bg-black/65 backdrop-blur-sm text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            </span>
                          </div>
                        </div>

                        {/* Title, Publication Time and Heart Likes Count strictly below 16:9 Thumbnail */}
                        <div className="mt-2.5 text-left">
                          <h3 className="text-sm font-extrabold text-gray-900 group-hover:text-brand-green transition line-clamp-2 leading-snug">
                            {ep.title}
                          </h3>
                          <p className="text-[11px] text-gray-400 font-semibold mt-1 flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              <span>{formatDate(ep.publishedAt || ep.createdAt)}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-red-500 font-bold">
                              <Heart className="w-3.5 h-3.5 fill-current text-red-500" />
                              <span>{ep.likesCount || 0}</span>
                            </span>
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ================= TẦNG 2 (GIỮA): VIDEO SHORTS DỌC (9:16) CHỮ PHÍA DƯỚI ================= */}
            {(currentView === 'all' || currentView === 'short') && latestShorts.length > 0 && (
              <section className="space-y-4 bg-purple-50/40 p-6 rounded-3xl border border-purple-100 shadow-soft">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Video Ngắn 30s</span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1 flex items-center gap-2">
                      <Tv className="w-5 h-5 text-purple-600" />
                      Podcasts Shorts
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleScroll(shortsScrollRef, 'left')}
                      className="w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition flex items-center justify-center shadow-xs cursor-pointer"
                      title="Lướt sang trái"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScroll(shortsScrollRef, 'right')}
                      className="w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition flex items-center justify-center shadow-xs cursor-pointer"
                      title="Lướt sang phải"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Shorts List Horizontal Row */}
                <div
                  ref={shortsScrollRef}
                  className="flex gap-4 overflow-x-auto hide-scrollbar pb-3 pt-1 snap-x scroll-smooth"
                >
                  {latestShorts.map((short) => (
                    <Link
                      key={short._id}
                      to={`/podcasts/${short.seriesId?.slug || 'readizen'}/${short.slug}`}
                      className="group shrink-0 w-36 sm:w-44 flex flex-col cursor-pointer snap-start"
                    >
                      {/* 9:16 Vertical Thumbnail Container */}
                      <div className="aspect-[9/16] w-full rounded-2xl overflow-hidden bg-gray-900 relative shadow-sm border border-gray-200 group-hover:shadow-md transition">
                        <img
                          src={short.thumbnailAsset?.assetUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=300&auto=format&fit=crop'}
                          alt={short.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=300&auto=format&fit=crop'; }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </span>
                        </div>
                      </div>

                      {/* Title, Publication Time and Heart Likes Count strictly below 9:16 Thumbnail */}
                      <div className="mt-2.5 text-left">
                        <h4 className="text-xs font-extrabold text-gray-900 group-hover:text-purple-700 transition line-clamp-2 leading-snug">
                          {short.title}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-semibold mt-1 flex items-center gap-1.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span>{formatDate(short.publishedAt || short.createdAt)}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-red-500 font-bold">
                            <Heart className="w-3 h-3 fill-current text-red-500" />
                            <span>{short.likesCount || 0}</span>
                          </span>
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ================= TẦNG 3 (DƯỚI CÙNG): DANH MỤC PODCAST SERIES DẠNG TỆP (STACKED FILES) ================= */}
            {(currentView === 'all' || currentView === 'playlist') && featuredSeries.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                      <ListVideo className="w-5.5 h-5.5 text-brand-green" />
                      Danh Mục Podcast Series
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 font-semibold">Các album chủ đề được xếp dạng tệp bài học (Stacked Cards)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
                  {featuredSeries.map((series) => (
                    <Link
                      key={series._id}
                      to={`/podcasts/${series.slug}`}
                      className="group flex flex-col cursor-pointer"
                    >
                      {/* STACKED FILE LAYERS WRAPPER (Enhanced 3D Depth Card Deck) */}
                      <div className="relative pt-4.5 pb-0.5">
                        {/* Layer 3 (Deepest Back Stack Edge with 3D shadow & elevation) */}
                        <div className="absolute top-0.5 inset-x-7 h-4 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 rounded-t-2xl border-t border-x border-gray-300/80 shadow-xs transition-all duration-300 ease-out group-hover:-top-2 group-hover:inset-x-8 group-hover:shadow-md" />
                        
                        {/* Layer 2 (Middle Back Stack Edge with 3D depth) */}
                        <div className="absolute top-2.5 inset-x-3.5 h-4 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 rounded-t-2xl border-t border-x border-gray-300 shadow-sm transition-all duration-300 ease-out group-hover:top-0 group-hover:inset-x-4 group-hover:shadow-lg" />

                        {/* Layer 1 (Main Front Card Container with intense 3D drop shadow & tilt elevation) */}
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-900 shadow-[0_12px_28px_-6px_rgba(0,0,0,0.18),0_4px_12px_-2px_rgba(0,0,0,0.12)] border border-gray-200/80 group-hover:shadow-[0_24px_45px_-8px_rgba(0,0,0,0.35),0_10px_18px_-4px_rgba(0,0,0,0.22)] group-hover:-translate-y-1.5 transition-all duration-300 ease-out">
                          <img
                            src={series.coverAsset?.assetUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop'}
                            alt={series.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop'; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                          
                          {/* Bottom Right Badge (Podcast Series) */}
                          <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-white text-[10px] font-extrabold flex items-center gap-1.5 border border-white/20 shadow-md">
                            <ListVideo className="w-3.5 h-3.5 text-brand-yellow" />
                            <span>Podcast Series</span>
                          </div>
                        </div>
                      </div>

                      {/* Title & Metadata Text STRICTLY BELOW the Stacked File Card */}
                      <div className="mt-3.5 text-left px-1">
                        <h3 className="text-base font-extrabold text-gray-900 group-hover:text-brand-green transition line-clamp-1">
                          {series.title}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium mt-1 line-clamp-2 leading-relaxed">
                          {series.host || 'Readizen Podcast'} • {series.description || 'Chuỗi bài học Podcast chia sẻ phương pháp luyện đọc tiếng Anh'}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
