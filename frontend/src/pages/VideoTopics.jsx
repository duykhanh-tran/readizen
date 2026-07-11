import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axios.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import SharedPagination from '../components/shared/SharedPagination.jsx';
import { Loader2, AlertCircle, Play, BookOpen, Star, ArrowRight, Search } from 'lucide-react';

export default function VideoTopics() {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Show up to 9 topics per page
  const navigate = useNavigate();

  // Background image for Hero section
  const heroBgImage = '/assets/m1.jpg';

  useEffect(() => {
    const fetchTopics = async () => {
      setIsLoading(true);
      try {
        // Fetch all topics to support client-side search and client-side pagination
        const response = await api.get('/videos/topics');
        // Handle if response is paginated or not
        if (response.data.topics) {
          setTopics(response.data.topics);
        } else {
          setTopics(response.data);
        }
      } catch (err) {
        console.error('Lỗi khi tải danh sách chủ đề video:', err);
        setError(err.response?.data?.message || 'Không thể kết nối đến máy chủ.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopics();
  }, []);

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Client-side search filtering
  const filteredTopics = topics.filter(topic => {
    const query = searchQuery.toLowerCase();
    return (
      topic.title.toLowerCase().includes(query) ||
      (topic.description && topic.description.toLowerCase().includes(query))
    );
  });

  const totalPages = Math.ceil(filteredTopics.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTopics = filteredTopics.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans antialiased selection:bg-brand-light/40 overflow-x-hidden flex flex-col">
      <Header />

      {/* ================= SECTION 1: HERO (Matching Homepage Style) ================= */}
      <header className="relative w-full py-20 lg:py-32 min-h-[600px] flex items-center overflow-hidden font-sans">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBgImage}
            alt="Video Hero Background"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay to make text readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/98 via-white/85 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent z-10"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full mt-10 md:mt-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white/85 backdrop-blur-sm border border-brand-green/20 text-brand-green text-sm font-bold mb-4 shadow-sm">
              <Star className="w-4 h-4 fill-brand-green text-brand-green" />
              <span>Góc bài giảng sinh động, kích thích sáng tạo</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
              Góc học tập <br />
              qua Video trực quan
            </h1>

            <p className="text-lg lg:text-xl text-gray-800 mb-8 max-w-2xl leading-relaxed font-semibold">
              Khám phá các video bài giảng hấp dẫn, vui vẻ giúp các bé tiếp thu tiếng Anh một cách tự nhiên, ghi nhớ từ vựng nhanh và tăng niềm say mê đọc sách.
            </p>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main id="topics-list" className="flex-grow max-w-7xl mx-auto px-6 py-16 w-full scroll-mt-20">
        {/* Search bar & filter controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-black text-gray-900">Chủ đề Video Học Tập</h2>
            <p className="text-xs text-gray-500 mt-1">Bố mẹ hãy lựa chọn chủ đề học tập dưới đây để bé bắt đầu học nhé!</p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm chủ đề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-light focus:outline-none transition text-xs font-semibold"
            />
          </div>
        </div>

        {/* Loading / Error States */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-brand-green" />
            <p className="text-sm text-gray-500 font-bold mt-4">Đang tải các chủ đề học tập...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-red-100 p-8 text-center shadow-lg my-12">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-gray-800 text-lg">Không thể tải dữ liệu</h3>
            <p className="text-xs text-gray-500 mt-2 mb-6 leading-relaxed">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-brand-green hover:bg-brand-dark text-white rounded-full text-xs font-bold transition shadow-md"
            >
              Thử lại
            </button>
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[32px] border border-gray-100 shadow-sm max-w-xl mx-auto">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-bold text-gray-800 text-base">Không tìm thấy chủ đề nào</h3>
            <p className="text-xs text-gray-500 mt-1">Bố mẹ thử nhập từ khóa khác xem sao nhé!</p>
          </div>
        ) : (
          /* Grid of Topics */
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
              {paginatedTopics.map((topic) => (
                <article
                  key={topic._id}
                  onClick={() => navigate(`/videos/${topic.slug}`)}
                  className="group relative flex flex-col bg-white rounded-[32px] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Topic Image Container */}
                  <div className="aspect-[4/3] w-full overflow-hidden bg-gray-550 relative">
                    <img
                      src={topic.thumbnail || 'https://placehold.co/600x400?text=' + topic.title}
                      alt={topic.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=' + topic.title }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm text-brand-green flex items-center justify-center shadow-lg scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Play className="w-6 h-6 fill-brand-green ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Topic Details */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-lg text-gray-800 group-hover:text-brand-green transition-colors duration-200 line-clamp-1">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium mt-2 line-clamp-2 leading-relaxed">
                        {topic.description || 'Không có mô tả cho chủ đề này.'}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-brand-green">
                      <span>Xem danh sách bài học</span>
                      <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            <SharedPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
