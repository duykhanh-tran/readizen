import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/axios.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import SafeImage from '../components/shared/SafeImage.jsx';
import { BookOpen, Search, ArrowRight, Sparkles, Loader2, BookOpenCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import SkeletonCard from '../components/shared/SkeletonCard.jsx';

export default function Library() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const isFirstMount = useRef(true);

  // Pagination State (Synchronized with URL params)
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = 12;

  const setCurrentPage = (newPage) => {
    setSearchParams(prev => {
      const updated = new URLSearchParams(prev);
      const pageVal = typeof newPage === 'function' ? newPage(currentPage) : newPage;
      updated.set('page', String(pageVal));
      return updated;
    }, { replace: true });
  };

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await api.get('/lessons');
        setLessons(response.data);
      } catch (error) {
        console.error('Lỗi khi tải thư viện bài đọc:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLessons();
  }, []);

  // Reset page when search query changes (skipped on mount)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setCurrentPage(1);
  }, [searchQuery]);

  // Filter lessons based on search query
  const filteredLessons = lessons.filter(lesson => {
    return lesson.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
  const paginatedLessons = filteredLessons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="font-sans text-gray-800 bg-brand-cream min-h-screen selection:bg-brand-light/40 overflow-x-hidden">
      <Header />

      {/* ================= HERO SECTION (style theo Tech.jsx) ================= */}
      <header className="relative w-full py-16 lg:py-20 min-h-[680px] flex items-center overflow-hidden font-sans">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <SafeImage
            src="/assets/m4.jpg"
            alt="Thư viện luyện đọc Readizen"
            className="w-full h-full object-cover"
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
              Thư viện Readizen AI
            </div>

            <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-5 tracking-tight">
              Khám Phá Sách Luyện Đọc AI
            </h1>

            <p className="text-base lg:text-xl text-gray-700 leading-relaxed font-medium max-w-xl">
              Cùng bé bước vào hành trình luyện phát âm chuẩn bản ngữ thông qua các câu chuyện thú vị và công nghệ chấm điểm AI thông minh của Readizen.
            </p>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-6 py-10 w-full text-left">
        {/* Search bar & filter controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-black text-gray-900">Thư Viện Sách Luyện Đọc</h2>
            <p className="text-xs text-gray-500 mt-1">Bé hãy chọn một cuốn sách thú vị để bắt đầu luyện đọc nhé!</p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm bài đọc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-light focus:outline-none transition text-xs font-semibold"
            />
          </div>
        </div>

        {/* List Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : filteredLessons.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-gray-150 p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 bg-brand-light text-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-gray-800">Không tìm thấy sách</h3>
            <p className="text-xs text-gray-550 mt-1">Không tìm thấy bài học nào phù hợp với bộ lọc hiện tại.</p>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedLessons.map((lesson) => (
                <article
                  key={lesson._id}
                  className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-soft hover:border-brand-green/30 transition duration-300 flex flex-col group"
                >
                  {/* Image block */}
                  <div className="aspect-[4/3] bg-gray-55 relative overflow-hidden flex items-center justify-center">
                    <SafeImage
                      src={lesson.coverImage}
                      alt={lesson.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      width={300}
                      height={225}
                      loading="lazy"
                      fallbackSrc="https://placehold.co/300x200?text=Book+Cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-black text-gray-900 text-sm leading-snug group-hover:text-brand-green transition truncate">
                        {lesson.title}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-bold mt-1.5 flex items-center gap-1.5">
                        <BookOpenCheck className="w-3.5 h-3.5 text-brand-green" />
                        <span>{lesson.ebookImages?.length || 0} trang minh họa</span>
                      </p>
                    </div>

                    <button
                      onClick={() => navigate(`/lessons/${lesson._id}`)}
                      className="mt-6 w-full bg-brand-green hover:bg-brand-dark text-white py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm group-hover:shadow-md"
                    >
                      <span>Luyện đọc ngay</span>
                      <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12 border-t border-gray-100 pt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-bold text-gray-600 select-none">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}