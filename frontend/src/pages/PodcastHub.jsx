import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Headphones, Sparkles, Play, Tv, Film, ChevronRight, Loader2, AlertCircle, Search, X, Star, ArrowRight } from 'lucide-react';
import api from '../services/axios.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

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

  const heroBgImage = '/assets/m1.jpg';

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
    <div className="min-h-screen bg-white text-gray-800 font-sans antialiased selection:bg-brand-light/40 overflow-x-hidden flex flex-col">
      <Header />

      {/* ================= SECTION 1: HERO (Đồng bộ font & layout trang Videos, Library) ================= */}
      <header className="relative w-full py-20 lg:py-32 min-h-[560px] flex items-center overflow-hidden font-sans">
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
      <main id="podcast-content" className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full text-left font-sans">
        
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
              Podcasts
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
              placeholder="Tìm kiếm tập podcast, từ khóa..."
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
          <div className="space-y-12">
            {/* 1. PLAYLIST / PODCAST SERIES SECTION (Shown on 'all' or 'playlist') */}
            {(currentView === 'all' || currentView === 'playlist') && featuredSeries.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Danh Mục Podcast Series</h2>
                    <p className="text-xs text-gray-500 mt-1 font-semibold">Các chuỗi bài học Podcast được biên soạn theo từng chủ đề cho ba mẹ và học sinh</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredSeries.map((series) => (
                    <Link
                      key={series._id}
                      to={`/podcasts/${series.slug}`}
                      className="group bg-white rounded-3xl border border-gray-150 shadow-soft overflow-hidden hover:shadow-lift transition-all duration-300 flex flex-col"
                    >
                      <div className="aspect-[16/9] w-full bg-gray-100 relative overflow-hidden">
                        <img
                          src={series.coverAsset?.assetUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop'}
                          alt={series.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      <div className="p-5 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-extrabold text-gray-900 group-hover:text-brand-green transition line-clamp-1">
                            {series.title}
                          </h3>
                          <p className="text-xs text-gray-500 font-medium mt-1.5 line-clamp-2 leading-relaxed whitespace-pre-line">
                            {series.description || 'Chưa có mô tả cho series này.'}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-brand-green">
                          <span>Xem Series bài học</span>
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* 2. SHORTS CAROUSEL SHELF (Shown on 'all' or 'short') */}
            {(currentView === 'all' || currentView === 'short') && latestShorts.length > 0 && (
              <section className="space-y-4 bg-gray-50 p-6 rounded-3xl border border-gray-150 shadow-soft">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Video Ngắn 30s</span>
                    <h2 className="text-xl font-extrabold text-gray-900">Readizen Shorts Luyện Đọc Nhanh (9:16)</h2>
                  </div>
                  <Link to="/podcasts/shorts" className="text-xs font-bold text-brand-green hover:underline flex items-center gap-1">
                    <span>Xem tất cả Shorts</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 pt-1">
                  {latestShorts.map((short) => (
                    <Link
                      key={short._id}
                      to={`/podcasts/${short.seriesId?.slug || 'readizen'}/${short.slug}`}
                      className="group shrink-0 w-36 sm:w-44 aspect-[9/16] bg-black rounded-2xl relative overflow-hidden shadow-md hover:scale-105 transition-transform duration-300"
                    >
                      <img
                        src={short.thumbnailAsset?.assetUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=300&auto=format&fit=crop'}
                        alt={short.title}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=300&auto=format&fit=crop'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </span>
                      </div>
                      <div className="absolute bottom-3 inset-x-3 text-white">
                        <p className="text-xs font-extrabold line-clamp-2 leading-snug drop-shadow-sm">
                          {short.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* 3. LONG-FORM EPISODES / VIDEOS GRID (Shown on 'all' or 'long') */}
            {(currentView === 'all' || currentView === 'long') && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                      {currentView === 'long' ? 'Video Bài Học Dài (16:9)' : 'Các Tập Podcast & Video Mới Nhất'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 font-semibold">Cập nhật liên tục các bài học video trực quan và sinh động</p>
                  </div>
                </div>

                {latestEpisodes.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 text-gray-400">
                    <p className="text-xs font-semibold">Không tìm thấy tập Podcast nào phù hợp.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {latestEpisodes.map((ep) => (
                      <Link
                        key={ep._id}
                        to={`/podcasts/${ep.seriesId?.slug || 'readizen'}/${ep.slug}`}
                        className="group bg-white rounded-3xl border border-gray-150 shadow-soft overflow-hidden hover:shadow-lift transition-all duration-300 flex flex-col"
                      >
                        <div className="aspect-video w-full bg-gray-100 relative overflow-hidden">
                          <img
                            src={ep.thumbnailAsset?.assetUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=500&auto=format&fit=crop'}
                            alt={ep.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=500&auto=format&fit=crop'; }}
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm text-brand-green flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-6 h-6 fill-current ml-0.5" />
                            </span>
                          </div>
                        </div>

                        <div className="p-5 flex-grow flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-bold uppercase text-brand-green bg-brand-light px-2 py-0.5 rounded">
                              {ep.seriesId?.title || 'Podcast'}
                            </span>
                            <h3 className="text-sm font-extrabold text-gray-900 mt-2 group-hover:text-brand-green transition line-clamp-2 leading-snug">
                              Tập {ep.episodeNumber}: {ep.title}
                            </h3>
                            <p className="text-xs text-gray-500 font-medium mt-1.5 line-clamp-2 leading-relaxed whitespace-pre-line">
                              {ep.summary || 'Bấm để xem tóm tắt nội dung bài học...'}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-brand-green">
                            <span>Xem tập bài học</span>
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
