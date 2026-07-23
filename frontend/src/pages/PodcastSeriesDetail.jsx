import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Loader2, AlertCircle, ChevronRight, Headphones, Bookmark, Share2, MoreVertical, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/axios.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

export default function PodcastSeriesDetail() {
  const { seriesSlug } = useParams();
  const navigate = useNavigate();

  const [series, setSeries] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('oldest'); // 'oldest' | 'latest'
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchSeriesDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.get(`/podcasts/series/${seriesSlug}`);
        setSeries(res.data.series);
        setEpisodes(res.data.episodes || []);
      } catch (err) {
        console.error('Lỗi khi tải chi tiết Podcast Series:', err);
        setError(err.response?.data?.message || 'Không thể kết nối đến máy chủ.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeriesDetail();
  }, [seriesSlug]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
        .then(() => toast.success('Đã sao chép liên kết Series!'))
        .catch(() => toast.error('Không thể sao chép liên kết.'));
    } else {
      toast.success('Hãy sao chép địa chỉ trang nhé!');
    }
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (!isBookmarked) {
      toast.success('Đã lưu Series vào danh sách yêu thích!');
    } else {
      toast('Đã bỏ lưu Series.', { icon: 'ℹ️' });
    }
  };

  // Sort episodes by episodeNumber
  const sortedEpisodes = [...episodes].sort((a, b) => {
    if (sortOrder === 'latest') {
      return (b.episodeNumber || 0) - (a.episodeNumber || 0);
    }
    return (a.episodeNumber || 0) - (b.episodeNumber || 0);
  });

  const firstEpisodeSlug = sortedEpisodes.length > 0 ? sortedEpisodes[0].slug : null;

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-gray-900 font-sans antialiased flex flex-col pt-20 lg:pt-24 text-left">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-28">
            <Loader2 className="w-10 h-10 animate-spin text-brand-green" />
            <p className="mt-4 text-sm font-bold text-gray-500">Đang tải Series Podcast...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-red-100 p-8 text-center shadow-lg my-12">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-gray-800 text-base">Không tìm thấy Series</h3>
            <p className="text-xs text-gray-500 mt-2 mb-6 leading-relaxed">{error}</p>
            <button
              onClick={() => navigate('/podcasts')}
              className="px-6 py-2.5 bg-brand-green hover:bg-brand-dark text-white rounded-full text-xs font-bold transition shadow-md cursor-pointer"
            >
              Về Podcast Hub
            </button>
          </div>
        ) : series && (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">

            {/* ================= LEFT COLUMN: STICKY PLAYLIST SIDEBAR CARD (4 Columns) ================= */}
            <aside className="lg:col-span-4 xl:col-span-4 lg:sticky lg:top-28">
              <div className="bg-gradient-to-b from-[#0B4A25] via-[#083B1C] to-[#052913] text-white rounded-3xl p-6 shadow-2xl border border-white/10 space-y-5">
                {/* Cover Image */}
                <div className="aspect-square w-full rounded-2xl overflow-hidden shadow-lg border border-white/15 bg-black/40 relative group">
                  <img
                    src={series.coverAsset?.assetUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop'}
                    alt={series.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop'; }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                </div>

                {/* Series Details Info */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-snug tracking-tight">
                    {series.title}
                  </h1>

                  {/* Host / Channel Row */}
                  <div className="mt-3 flex items-center gap-2 text-xs font-bold text-gray-300">
                    <div className="w-6 h-6 rounded-full bg-brand-yellow text-brand-darker flex items-center justify-center text-xs font-black shadow-sm">
                      🦉
                    </div>
                    <span>{series.host || 'Readizen Podcast'}</span>
                  </div>

                  {/* Metadata stats */}
                  <p className="mt-2 text-xs font-semibold text-brand-light/90">
                    Podcast Series • {episodes.length} tập bài học
                  </p>

                  {/* Description with Xem thêm / Thu gọn toggle */}
                  <div className="mt-3">
                    <p className={`text-xs text-gray-200/90 leading-relaxed font-medium whitespace-pre-line ${isExpanded ? '' : 'line-clamp-3'}`}>
                      {series.description || 'Chuỗi bài học Podcast chia sẻ phương pháp luyện đọc và tự học tiếng Anh chuẩn bản ngữ.'}
                    </p>
                    {series.description && series.description.length > 80 && (
                      <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-1.5 text-xs font-bold text-brand-yellow hover:underline cursor-pointer flex items-center gap-1"
                      >
                        {isExpanded ? 'Thu gọn ▲' : '... Xem thêm ▼'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="pt-2 flex items-center gap-3">
                  {/* Play First / Play Latest Button */}
                  {firstEpisodeSlug ? (
                    <Link
                      to={`/podcasts/${seriesSlug}/${firstEpisodeSlug}`}
                      className="flex-grow h-11 px-5 rounded-full bg-white text-gray-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition shadow-lg cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current text-gray-950 ml-0.5" />
                      <span>Phát tất cả</span>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="flex-grow h-11 px-5 rounded-full bg-white/20 text-white/50 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Chưa có tập bài học</span>
                    </button>
                  )}

                  {/* Bookmark / Save button */}
                  <button
                    type="button"
                    onClick={handleToggleBookmark}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition border border-white/10 cursor-pointer ${isBookmarked ? 'bg-brand-green text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                    title={isBookmarked ? 'Đã lưu Series' : 'Lưu Series'}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>

                  {/* Share button */}
                  <button
                    type="button"
                    onClick={handleShare}
                    className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/10 cursor-pointer"
                    title="Chia sẻ Series"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </aside>

            {/* ================= RIGHT COLUMN: EPISODES LIST (8 Columns) ================= */}
            <section className="lg:col-span-8 xl:col-span-8 mt-8 lg:mt-0 space-y-4">
              
              {/* Top Filter Chips Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setSortOrder('oldest')}
                    className={`px-4 py-2 rounded-xl transition cursor-pointer ${sortOrder === 'oldest' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Theo thứ tự (Tập 1...)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortOrder('latest')}
                    className={`px-4 py-2 rounded-xl transition cursor-pointer ${sortOrder === 'latest' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Mới nhất
                  </button>
                </div>

                <span className="text-xs text-gray-500 font-semibold">{sortedEpisodes.length} tập bài học</span>
              </div>

              {/* Episodes List (Horizontal Item Format Stacked Vertically) */}
              {sortedEpisodes.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-150 text-gray-400">
                  <p className="text-xs font-semibold">Series này chưa có tập bài học nào được đăng tải.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedEpisodes.map((ep) => (
                    <Link
                      key={ep._id}
                      to={`/podcasts/${seriesSlug}/${ep.slug}`}
                      className="group flex flex-col sm:flex-row gap-4 bg-white rounded-2xl p-3 sm:p-4 border border-gray-200 hover:border-brand-green/40 hover:shadow-soft transition-all duration-200"
                    >
                      {/* Episode Thumbnail */}
                      <div className="w-full sm:w-48 aspect-video rounded-xl bg-gray-200 flex items-center justify-center text-gray-400 text-2xl shrink-0 relative overflow-hidden shadow-sm">
                        <img
                          src={ep.thumbnailAsset?.assetUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=300&auto=format&fit=crop'}
                          alt={ep.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=300&auto=format&fit=crop'; }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                        <span className="z-10 text-white group-hover:scale-110 transition-transform bg-black/50 p-2.5 rounded-full backdrop-blur-sm shadow">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </span>
                      </div>

                      {/* Episode Info */}
                      <div className="min-w-0 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm sm:text-base font-extrabold text-gray-900 group-hover:text-brand-green transition leading-snug line-clamp-2">
                            Tập {ep.episodeNumber}: {ep.title}
                          </h3>
                          <p className="mt-1 text-xs text-gray-500 font-semibold">{series.host || 'Readizen Podcast'}</p>
                          <p className="mt-1.5 text-xs text-gray-600 line-clamp-2 leading-relaxed font-medium">
                            {ep.summary || 'Bấm để xem nội dung bài học chi tiết...'}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-semibold">
                          <div className="flex items-center gap-2">
                            <span className="text-brand-green font-bold">Tập {ep.episodeNumber}</span>
                          </div>
                          <span className="group-hover:text-brand-green transition flex items-center gap-1 font-bold">
                            Xem ngay <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
