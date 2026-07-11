import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  Clock,
  ListVideo,
  Loader2,
  Play,
  Tv,
  Video,
} from 'lucide-react';
import api from '../services/axios.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import SharedPagination from '../components/shared/SharedPagination.jsx';

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" stroke="none">
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export default function TopicVideosList() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchTopicData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get(
          `/videos/topics/${slug}?page=${currentPage}&limit=${itemsPerPage}`,
        );
        setTopic(response.data);
        setTotalPages(response.data.pages || 1);
      } catch (err) {
        console.error('Lỗi khi tải chi tiết chủ đề video:', err);
        setError(err.response?.data?.message || 'Không thể kết nối đến máy chủ.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopicData();
  }, [slug, currentPage]);

  const renderSourceBadge = (type) => {
    switch (type) {
      case 'youtube':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-red-100 bg-red-50 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-red-600">
            <YoutubeIcon />
            YouTube
          </span>
        );
      case 'tiktok':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-white">
            <Tv className="h-2.5 w-2.5" />
            TikTok
          </span>
        );
      case 'upload':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-blue-600">
            <Video className="h-2.5 w-2.5" />
            Trực tiếp
          </span>
        );
      default:
        return null;
    }
  };

  const lessons = topic?.lessons || [];
  const totalLessons = topic?.totalLessons || topic?.total || lessons.length;
  const firstLesson = lessons[0];

  const openLesson = (lesson) => {
    if (!lesson?.slug) return;
    navigate(`/videos/${slug}/${lesson.slug}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8f3] pt-20 font-sans text-gray-800 antialiased lg:pt-24">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-28">
            <Loader2 className="h-10 w-10 animate-spin text-brand-green" />
            <p className="mt-4 text-sm font-bold text-gray-500">
              Đang tải danh sách bài học...
            </p>
          </div>
        ) : error ? (
          <div className="mx-auto my-12 max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Không thể tải dữ liệu</h3>
            <p className="mb-6 mt-2 text-xs leading-relaxed text-gray-500">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full bg-brand-green px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-brand-dark"
            >
              Thử lại
            </button>
          </div>
        ) : !topic ? (
          <div className="mx-auto max-w-md py-20 text-center">
            <h3 className="text-lg font-bold text-gray-800">Không tìm thấy chủ đề</h3>
          </div>
        ) : (
          <>
            <nav className="mb-5 flex items-center gap-2 overflow-hidden text-[10px] font-black uppercase tracking-[0.16em] text-gray-400 sm:text-xs">
              <Link to="/videos" className="shrink-0 transition hover:text-brand-green">
                Chủ đề video
              </Link>
              <span className="text-gray-300">/</span>
              <span className="truncate text-gray-600">{topic.title}</span>
            </nav>

            {/* Playlist hero */}
            <section className="relative mb-10 overflow-hidden rounded-[28px] bg-[#173f2b] text-white shadow-[0_28px_80px_rgba(20,61,40,0.28)] sm:rounded-[36px]">
              {/* Background */}
              <div className="absolute inset-0">
                <img
                  src={
                    topic.thumbnail ||
                    `https://placehold.co/1600x900?text=${topic.title}`
                  }
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full scale-110 object-cover opacity-25 blur-3xl"
                />

                <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(9,38,24,0.99)_0%,rgba(17,66,40,0.94)_55%,rgba(30,96,60,0.78)_100%)]" />

                <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-brand-yellow/20 blur-[90px]" />
                <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-white/5 blur-[100px]" />
              </div>

              <div className="relative grid gap-8 p-5 sm:p-7 md:grid-cols-[minmax(300px,42%)_1fr] md:items-center md:gap-10 lg:p-10 xl:grid-cols-[420px_1fr] xl:gap-14">
                {/* Large topic image */}
                <div className="group relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden rounded-[24px] border border-white/20 bg-white/10 shadow-[0_28px_65px_rgba(0,0,0,0.42)] md:mx-0 md:max-w-none">
                  <img
                    src={
                      topic.thumbnail ||
                      `https://placehold.co/900x900?text=${topic.title}`
                    }
                    alt={topic.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                    onError={(event) => {
                      event.currentTarget.src = `https://placehold.co/900x900?text=${topic.title}`;
                    }}
                  />

                  {/* Image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-white/5" />

                  {/* Lesson count */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white backdrop-blur-xl sm:bottom-5 sm:left-5 sm:text-xs">
                    <ListVideo className="h-3.5 w-3.5" />
                    {totalLessons} bài học
                  </div>

                  {/* Decorative play button */}
                  {firstLesson && (
                    <button
                      type="button"
                      onClick={() => openLesson(firstLesson)}
                      aria-label="Bắt đầu xem"
                      className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand-yellow text-[#173f2b] shadow-[0_12px_30px_rgba(0,0,0,0.3)] transition duration-300 hover:scale-110 hover:brightness-105 sm:bottom-5 sm:right-5 sm:h-14 sm:w-14"
                    >
                      <Play className="ml-0.5 h-4 w-4 fill-current sm:h-5 sm:w-5" />
                    </button>
                  )}
                </div>

                {/* Topic information */}
                <div className="min-w-0 py-2 text-center md:py-5 md:text-left">
                  <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-brand-yellow backdrop-blur-md sm:text-[10px]">
                    Playlist học tập
                  </span>

                  <h1 className="mt-5 text-3xl font-black leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl">
                    {topic.title}
                  </h1>

                  {topic.description && (
                    <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-6 text-white/70 md:mx-0 sm:text-base sm:leading-7">
                      {topic.description}
                    </p>
                  )}

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 text-xs font-bold text-white/60 md:justify-start">
                    <span className="text-white">Readizen</span>

                    <span className="h-1 w-1 rounded-full bg-white/40" />

                    <span>{totalLessons} bài giảng video</span>

                    <span className="h-1 w-1 rounded-full bg-white/40" />

                    <span>Cập nhật thường xuyên</span>
                  </div>

                  {firstLesson && (
                    <div className="mt-8 flex justify-center md:justify-start">
                      <button
                        type="button"
                        onClick={() => openLesson(firstLesson)}
                        className="inline-flex items-center gap-3 rounded-full bg-brand-yellow px-6 py-3.5 text-sm font-black text-[#173f2b] shadow-[0_14px_35px_rgba(247,201,72,0.28)] transition duration-300 hover:-translate-y-1 hover:brightness-105 active:translate-y-0"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173f2b] text-white">
                          <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
                        </span>

                        Bắt đầu xem
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {!lessons.length ? (
              <div className="mx-auto max-w-xl rounded-[28px] border border-gray-100 bg-white py-20 text-center shadow-sm">
                <Play className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <h3 className="text-base font-bold text-gray-800">
                  Hiện chưa có video bài học nào trong chủ đề này
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Quay lại sau để cập nhật bài học mới nhé!
                </p>
              </div>
            ) : (
              <section className="overflow-hidden rounded-[28px] border border-gray-200/80 bg-white shadow-[0_18px_55px_rgba(25,50,36,0.07)] sm:rounded-[32px]">
                <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-5 sm:px-7 sm:py-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-green">
                      Nội dung chủ đề
                    </p>
                    <h2 className="mt-1 text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
                      Danh sách bài học
                    </h2>
                  </div>

                  <div className="flex h-10 shrink-0 items-center rounded-full bg-[#f4f7f1] px-4 text-xs font-extrabold text-gray-500">
                    {totalLessons} video
                  </div>
                </div>

                {/* Spotify-like column header */}
                <div className="hidden grid-cols-[48px_128px_minmax(0,1fr)_150px_92px] items-center gap-4 border-b border-gray-100 px-6 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-gray-400 lg:grid">
                  <div className="text-center">#</div>
                  <div>Video</div>
                  <div>Tiêu đề</div>
                  <div>Nguồn</div>
                  <div className="flex items-center justify-end gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Thời lượng
                  </div>
                </div>

                <div className="divide-y divide-gray-100 px-2 py-2 sm:px-3">
                  {lessons.map((lesson, index) => {
                    const calculatedIndex = (currentPage - 1) * itemsPerPage + index + 1;

                    return (
                      <article
                        key={lesson._id}
                        role="button"
                        tabIndex={0}
                        onClick={() => openLesson(lesson)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            openLesson(lesson);
                          }
                        }}
                        className="group grid cursor-pointer grid-cols-[30px_84px_minmax(0,1fr)] items-center gap-3 rounded-2xl px-2 py-3 outline-none transition duration-200 hover:bg-[#f3f7f1] focus-visible:ring-2 focus-visible:ring-brand-green/40 sm:grid-cols-[38px_110px_minmax(0,1fr)_72px] sm:gap-4 sm:px-3 lg:grid-cols-[48px_128px_minmax(0,1fr)_150px_92px] lg:px-3"
                      >
                        <div className="flex items-center justify-center text-xs font-bold text-gray-400">
                          <span className="group-hover:hidden">{calculatedIndex}</span>
                          <span className="hidden h-7 w-7 items-center justify-center rounded-full bg-brand-green text-white shadow-sm group-hover:flex">
                            <Play className="ml-0.5 h-3 w-3 fill-current" />
                          </span>
                        </div>

                        <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-100 bg-gray-100 shadow-sm">
                          <img
                            src={
                              lesson.thumbnail ||
                              topic.thumbnail ||
                              `https://placehold.co/500x281?text=${lesson.title}`
                            }
                            alt={lesson.title}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            onError={(event) => {
                              event.currentTarget.src = `https://placehold.co/500x281?text=${lesson.title}`;
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                        </div>

                        <div className="min-w-0 py-0.5">
                          <h3 className="truncate text-sm font-extrabold leading-snug text-gray-800 transition group-hover:text-brand-green sm:text-[15px]">
                            {lesson.title}
                          </h3>
                          <div className="mt-1.5 flex min-w-0 items-center gap-2">
                            <span className="shrink-0 text-[9px] font-black uppercase tracking-[0.12em] text-gray-400">
                              Bài học {calculatedIndex}
                            </span>
                            <span className="lg:hidden">
                              {renderSourceBadge(lesson.videoType)}
                            </span>
                          </div>
                        </div>

                        <div className="hidden lg:block">
                          {renderSourceBadge(lesson.videoType)}
                        </div>

                        <div className="hidden items-center justify-end text-xs font-bold tabular-nums text-gray-400 sm:flex">
                          {lesson.duration || '--:--'}
                        </div>
                      </article>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="border-t border-gray-100 px-5 py-5 sm:px-7">
                    <SharedPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}