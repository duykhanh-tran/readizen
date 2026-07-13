import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/axios.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import SafeImage from '../components/shared/SafeImage.jsx';
import SharedPagination from '../components/shared/SharedPagination.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Star, Loader2, Award, BookOpen, AlertCircle, Sparkles, Search, ArrowRight } from 'lucide-react';

export default function AlphabetBoard() {
  const { isAuthenticated } = useAuth();
  const [letters, setLetters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlphabetList = async () => {
      try {
        const response = await api.get('/alphabet');
        setLetters(response.data);
      } catch (err) {
        console.error('Error fetching alphabet board:', err);
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải bảng chữ cái.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlphabetList();
  }, []);

  // Reset page on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const getStars = (avgScore) => {
    if (avgScore === null || avgScore === undefined) return 0;
    if (avgScore >= 80) return 3;
    if (avgScore >= 50) return 2;
    return 1;
  };

  const getStarColor = (starIndex, count) => {
    if (starIndex < count) {
      return 'text-yellow-400 fill-yellow-400';
    }
    return 'text-gray-200 fill-gray-200';
  };

  // Filter letters based on search query (either letter or vocabulary words)
  const filteredLetters = letters.filter(item => {
    const query = searchQuery.toLowerCase();
    const matchLetter = item.letter.toLowerCase().includes(query);
    const matchVocab = item.vocabularies?.some(v => v.word.toLowerCase().includes(query));
    return matchLetter || matchVocab;
  });

  const totalPages = Math.ceil(filteredLetters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLetters = filteredLetters.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="font-sans text-gray-800 bg-brand-cream min-h-screen selection:bg-brand-light/40 overflow-x-hidden">
      <Header />

      {/* ================= HERO SECTION (style theo Library.jsx / Tech.jsx) ================= */}
      <header className="relative w-full py-16 lg:py-20 min-h-[680px] flex items-center overflow-hidden font-sans">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <SafeImage
            src="/assets/ABC-01_compressed.jpg"
            alt="Bảng chữ cái Readizen"
            className="w-full h-full object-cover"
            width={1280}
            height={720}
            loading="eager"
            fetchPriority="high"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-brand-green/20 text-brand-green text-sm font-bold mb-4 shadow-sm uppercase tracking-wider">
              <Sparkles className="w-4 h-4 fill-brand-green" />
              Alphabet Learning Module
            </div>

            <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-5 tracking-tight">
              Khám Phá Bảng Chữ Cái Tiếng Anh
            </h1>

            <p className="text-base lg:text-xl text-gray-700 leading-relaxed font-medium max-w-xl">
              Cùng bé bắt đầu hành trình nhận diện 26 chữ cái cơ bản kèm hình ảnh sinh động, học phát âm chuẩn bản xứ và nhận điểm thưởng AI của Readizen.
            </p>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-6 py-10 w-full text-left">
        {/* Search bar & filter controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-black text-gray-900">Bảng Chữ Cái (A-Z)</h2>
            <p className="text-xs text-gray-500 mt-1">Bé hãy chọn một chữ cái để bắt đầu luyện đọc nhé!</p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Tìm chữ cái hoặc từ vựng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-light focus:outline-none transition text-xs font-semibold"
            />
          </div>
        </div>

        {!isAuthenticated && (
          <div className="mb-8 bg-brand-light/35 border border-brand-green/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">✨</span>
              <p className="text-xs sm:text-sm text-gray-700 font-bold">
                Đăng nhập hoặc đăng ký tài khoản để hệ thống lưu lại điểm số và huy chương luyện tập của bé nhé!
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link to="/login" className="px-4 py-2 bg-white hover:bg-gray-50 border border-brand-green/20 rounded-xl text-xs font-bold text-brand-green shadow-sm transition">Đăng nhập</Link>
              <Link to="/register" className="px-4 py-2 bg-brand-green hover:bg-brand-dark rounded-xl text-xs font-bold text-white shadow-sm transition">Đăng ký</Link>
            </div>
          </div>
        )}

        {/* Content list */}
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-10 h-10 text-brand-green animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 p-6 text-center max-w-sm mx-auto" role="alert">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-5 ring-1 ring-red-100">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-gray-800 text-lg">Lỗi tải dữ liệu</h3>
            <p className="text-sm text-gray-500 mt-2 mb-7 leading-relaxed">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-brand-green hover:bg-brand-dark text-white rounded-full font-bold text-sm shadow-md transition"
            >
              Thử lại
            </button>
          </div>
        ) : filteredLetters.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-gray-150 p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 bg-brand-light text-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-gray-800">Không tìm thấy chữ cái</h3>
            <p className="text-xs text-gray-550 mt-1">Không tìm thấy bài học hoặc từ vựng nào khớp với từ khóa của bạn.</p>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedLetters.map((item) => {
                const starsCount = getStars(item.averageScore);
                return (
                  <article
                    key={item._id}
                    className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-soft hover:border-brand-green/30 transition duration-300 flex flex-col group relative"
                  >


                    {/* Image block */}
                    <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden flex items-center justify-center border-b border-gray-100">
                      <img
                        src={item.thumbnail || 'https://placehold.co/300x200?text=' + item.letter}
                        alt={item.letter}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500 select-none"
                        onError={(e) => { e.target.src = 'https://placehold.co/300x200?text=' + item.letter }}
                      />
                    </div>

                    {/* Details */}
                    <div className="p-5 flex-grow flex flex-col justify-between text-center items-center">
                      <div className="w-full flex flex-col items-center">
                        {/* Title */}
                        <h3 className="font-black text-gray-900 text-xl leading-snug group-hover:text-brand-green transition truncate w-full">
                          {item.letter}
                        </h3>

                        {/* Vocabs Count info */}
                        <p className="text-[10px] text-gray-400 font-bold mt-2.5 flex items-center justify-center gap-1.5 w-full">
                          <BookOpen className="w-3.5 h-3.5 text-brand-green" />
                          <span>{item.vocabularies?.length || 0} từ vựng liên quan</span>
                        </p>

                        {/* Stars Rating */}
                        <div className="flex items-center justify-center gap-0.5 mt-2 w-full">
                          {Array.from({ length: 3 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={`w-3.5 h-3.5 ${getStarColor(idx, starsCount)} transition-colors duration-300`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Bottom Info / Button */}
                      <div className="w-full">
                        <button
                          onClick={() => navigate(`/smartabc/${item.letter.toLowerCase()}`)}
                          className="mt-6 w-full bg-brand-green hover:bg-brand-dark text-white py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm group-hover:shadow-md"
                        >
                          <span>Luyện tập ngay</span>
                          <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination Controls */}
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
