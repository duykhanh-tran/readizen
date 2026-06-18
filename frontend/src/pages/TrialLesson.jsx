import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/axios.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import {
  Play,
  Volume2,
  Mic,
  Square,
  Loader2,
  Download,
  Maximize,
  ChevronLeft,
  ChevronRight,
  X,
  Award,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function TrialLesson() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Lesson state
  const [lesson, setLesson] = useState(null);
  const [flatSentences, setFlatSentences] = useState([]); // flat practice sentences list
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // EBook Carousel State (Sliding ebookImages list)
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // AI Practice State
  const [sentenceScores, setSentenceScores] = useState([]); // array of scores matching flatSentences
  const [recordingIndex, setRecordingIndex] = useState(null); // index in flatSentences
  const [evaluatingIndex, setEvaluatingIndex] = useState(null); // index in flatSentences
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // MediaRecorder refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Fetch Lesson details
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await api.get(`/lessons/${id}`);
        const data = response.data;
        setLesson(data);

        // Map flat practice sentences from DB schema
        const sentences = data.practiceSentences || [];
        setFlatSentences(sentences);
        setSentenceScores(new Array(sentences.length).fill(null));
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải bài học.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLesson();
  }, [id]);

  // Handle Keyboard controls in Fullscreen Modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullscreen || !lesson || !lesson.ebookImages) return;
      if (e.key === 'Escape') setIsFullscreen(false);
      if (e.key === 'ArrowLeft') goPrevPage();
      if (e.key === 'ArrowRight') goNextPage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, carouselIndex, lesson]);

  const goPrevPage = () => {
    if (!lesson || !lesson.ebookImages || lesson.ebookImages.length === 0) return;
    setCarouselIndex(prev => (prev === 0 ? lesson.ebookImages.length - 1 : prev - 1));
  };

  const goNextPage = () => {
    if (!lesson || !lesson.ebookImages || lesson.ebookImages.length === 0) return;
    setCarouselIndex(prev => (prev === lesson.ebookImages.length - 1 ? 0 : prev + 1));
  };

  // Text-To-Speech (Listen helper)
  const handleListenTemplate = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';

      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Trình duyệt của bạn không hỗ trợ tính năng đọc văn bản (TTS).');
    }
  };

  // Start Mic Recording
  const startRecording = async (index) => {
    try {
      if (recordingIndex !== null) return;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await evaluateSentenceAudio(index, audioBlob);
      };

      mediaRecorderRef.current.start();
      setRecordingIndex(index);
    } catch (err) {
      console.error(err);
      alert('Không thể truy cập Microphone. Vui lòng kiểm tra lại quyền của trình duyệt.');
    }
  };

  // Stop Mic Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingIndex !== null) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setRecordingIndex(null);
    }
  };

  // Call Speech scoring API
  const evaluateSentenceAudio = async (index, audioBlob) => {
    setEvaluatingIndex(index);
    try {
      const targetText = flatSentences[index].text;

      const formData = new FormData();
      formData.append('audio', audioBlob, `recording_${index}.webm`);
      formData.append('textToRead', targetText);

      const response = await api.post('/lessons/evaluate-audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const { score } = response.data;
      const updatedScores = [...sentenceScores];
      updatedScores[index] = score;
      setSentenceScores(updatedScores);
    } catch (err) {
      console.error(err);
      alert('Lỗi chấm điểm phát âm. Vui lòng kiểm thử lại.');
    } finally {
      setEvaluatingIndex(null);
    }
  };

  // Submit all scores
  const handleSubmitScores = async () => {
    setIsSubmitting(true);
    try {
      const sentencesScore = flatSentences.map((s, index) => ({
        sentenceText: s.text,
        score: sentenceScores[index] || 0
      }));

      const payload = {
        lessonId: lesson._id,
        sentencesScore,
        averageScore: Math.round(sentenceScores.reduce((sum, s) => sum + (s || 0), 0) / flatSentences.length)
      };

      await api.post('/user/scores', payload);
      setIsFinished(true);
    } catch (err) {
      console.error(err);
      alert('Không thể lưu kết quả học tập. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColorClass = (score) => {
    if (score === null || score === undefined) return 'text-gray-300 bg-gray-50 border-gray-150';
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-100';
    return 'text-red-600 bg-red-50 border-red-100';
  };

  const getScoreTextClass = (score) => {
    if (score === null || score === undefined) return 'text-gray-300';
    if (score >= 80) return 'text-brand-green';
    if (score >= 50) return 'text-brand-yellow';
    return 'text-red-500';
  };

  const handleDownloadPdf = async (e) => {
    e.preventDefault();
    if (!lesson || !lesson.pdfFile) return;

    try {
      const response = await fetch(lesson.pdfFile);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      const filename = `${lesson.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn('Direct PDF download failed, falling back to opening in a new tab:', err);
      window.open(lesson.pdfFile, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-cream/30 flex flex-col font-sans">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center gap-4" role="status" aria-live="polite">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-brand-green/15"></div>
            <Loader2 className="absolute inset-0 w-14 h-14 text-brand-green animate-spin" strokeWidth={2.5} />
          </div>
          <p className="text-sm text-gray-500 font-semibold">Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-brand-cream/30 flex flex-col font-sans">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto" role="alert">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-5 ring-1 ring-red-100">
            <AlertCircle className="w-8 h-8" strokeWidth={2} />
          </div>
          <h3 className="font-bold text-gray-800 text-lg">Bài học không khả dụng</h3>
          <p className="text-sm text-gray-555 mt-2 mb-7 leading-relaxed">{error || 'Bài học này không tìm thấy.'}</p>
          <Link
            to="/library"
            className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-dark text-white px-7 py-3 rounded-full text-sm font-bold shadow-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại Thư viện
          </Link>
        </div>
      </div>
    );
  }

  const completedCount = sentenceScores.filter(s => s !== null).length;
  const totalCount = flatSentences.length;
  const isAllCompleted = completedCount === totalCount;
  const averageScore = completedCount > 0
    ? Math.round(sentenceScores.reduce((sum, s) => sum + (s || 0), 0) / completedCount)
    : 0;

  const totalImages = lesson.ebookImages?.length || 0;
  const currentImageUrl = lesson.ebookImages?.[carouselIndex] || '';

  return (
    <div className="min-h-screen bg-brand-cream/30 flex flex-col font-sans antialiased overflow-x-hidden text-gray-800">
      <Header />

      {!isFinished ? (
        <>
          {/* MAIN COLUMN AREA (EBOOK CAROUSEL) */}
          <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-12 w-full">

            {/* HERO TITLE SECTION */}
            <section className="pb-12 text-left border-b border-gray-100">
              {/* Nút quay lại (Giữ căn trái để chuẩn UX điều hướng) */}
              <Link
                to="/library"
                className="inline-flex items-center gap-2 px-2 py-2 -ml-2 mb-8 text-sm font-medium text-gray-500 transition-colors rounded-full group hover:text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green/40"
              >
                <span className="p-1 transition-colors rounded-full bg-gray-50 group-hover:bg-brand-green/10">
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </span>
                <span>Quay lại Thư viện</span>
              </Link>

              {/* Khối Nội dung chính (Được căn giữa toàn bộ) */}
              <div className="flex flex-col items-center text-center">

                {/* Nhãn bài học (Badge) */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-wide uppercase border rounded-full bg-brand-green/10 border-brand-green/20 text-brand-green">
                    <span className="relative flex w-2 h-2">
                      <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-brand-green"></span>
                      <span className="relative inline-flex w-2 h-2 rounded-full bg-brand-green"></span>
                    </span>
                    Phiếu luyện đọc AI
                  </div>
                  <div className="px-3 py-1 text-xs font-semibold tracking-wide text-gray-600 uppercase bg-gray-100 rounded-full">
                    Level {lesson.level || 'A'}
                  </div>
                </div>

                {/* Tiêu đề bài học */}
                <h1 className="max-w-4xl mb-6 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl leading-tight tracking-tight">
                  {lesson.title}
                </h1>

                {/* Các tag tính năng */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Đọc truyện
                  </span>

                  <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    Luyện âm AI
                  </span>

                  {lesson.pdfFile && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                      Có file PDF
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* EBOOK SECTION */}
            <section id="ebook" className="bg-white rounded-[2rem] border border-[#EAE5D1] shadow-soft overflow-hidden text-left mt-10 scroll-mt-20">
              <div className="px-6 py-5 border-b border-[#EAE5D1] flex flex-wrap items-center justify-between gap-4 bg-[#FFFDF3]">
                <div className="flex items-center gap-3">
                  <span className="hidden sm:flex w-8 h-8 rounded-full bg-brand-green text-white text-xs font-black items-center justify-center shrink-0">1</span>
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wider text-brand-green">Bước 1 · Ebook minh họa</p>
                    <p className="text-sm font-bold text-gray-700 mt-0.5">
                      Trang <span className="text-brand-green">{carouselIndex + 1}</span> / {totalImages}
                    </p>
                  </div>
                </div>

                {totalImages > 0 && (
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-full bg-brand-green text-white text-xs font-extrabold shadow-md hover:bg-brand-dark active:scale-[0.97] transition cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green/40 focus-visible:outline-offset-2"
                    aria-label="Xem toàn màn hình"
                  >
                    <Maximize className="w-3.5 h-3.5" />
                    <span>Xem Toàn Màn Hình</span>
                  </button>
                )}
              </div>

              {/* Carousel Shell */}
              <div className="bg-brand-cream p-4 sm:p-8 flex flex-col items-center justify-center gap-5">
                <div className="relative mx-auto w-full max-w-[700px]">
                  {currentImageUrl ? (
                    <img
                      src={currentImageUrl}
                      alt={`Trang ${carouselIndex + 1}`}
                      className="w-full rounded-3xl shadow-lg border border-white bg-white object-contain aspect-[4/3] select-none"
                      onError={(e) => { e.target.src = 'https://placehold.co/600x450?text=Ebook+Page' }}
                    />
                  ) : (
                    <div className="w-full rounded-3xl shadow-lg border border-white bg-white flex items-center justify-center aspect-[4/3] text-gray-450 font-bold">
                      Không có hình ảnh cho truyện này
                    </div>
                  )}

                  {/* Navigation controls */}
                  {totalImages > 1 && (
                    <>
                      <button
                        onClick={goPrevPage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 border border-gray-150 shadow-md flex items-center justify-center text-brand-green hover:bg-brand-light active:scale-95 transition cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green/40"
                        aria-label="Trang trước"
                      >
                        <ChevronLeft className="w-5 h-5 stroke-[3px]" />
                      </button>

                      <button
                        onClick={goNextPage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 border border-gray-150 shadow-md flex items-center justify-center text-brand-green hover:bg-brand-light active:scale-95 transition cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green/40"
                        aria-label="Trang sau"
                      >
                        <ChevronRight className="w-5 h-5 stroke-[3px]" />
                      </button>
                    </>
                  )}
                </div>

                {/* Page progress dots */}
                {totalImages > 1 && totalImages <= 12 && (
                  <div className="flex items-center gap-1.5" role="tablist" aria-label="Điều hướng trang ebook">
                    {Array.from({ length: totalImages }).map((_, i) => (
                      <span
                        key={i}
                        className={`rounded-full transition-all duration-300 ${i === carouselIndex ? 'w-6 h-2 bg-brand-green' : 'w-2 h-2 bg-brand-green/25'}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* PDF Download footer bar */}
              <div className="px-6 py-5 bg-white flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between border-t border-[#EAE5D1]">
                <p className="text-xs text-gray-555 font-medium leading-relaxed">
                  Đọc trực tiếp trên màn hình hoặc tải file PDF chất lượng cao để in sách giấy cho bé học.
                </p>
                {lesson.pdfFile ? (
                  <button
                    onClick={handleDownloadPdf}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-yellow text-brand-darker font-extrabold shadow-sm hover:shadow-md active:scale-[0.98] transition text-xs cursor-pointer shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-darker/40"
                  >
                    <Download className="w-4 h-4 stroke-[2.5px]" />
                    <span>Tải File PDF</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-gray-400 font-bold uppercase shrink-0">Không có bản PDF tải về</span>
                )}
              </div>
            </section>

            {/* SECTION 4: MORE READING */}
            <section className="bg-white rounded-[2rem] border border-[#EAE5D1] p-6 sm:p-10 shadow-sm text-center mt-10">
              <div className="inline-flex items-center gap-1.5 bg-brand-light text-brand-green text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4">
                Dành cho bạn
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
                Thư viện Luyện đọc AI
              </h3>

              <p className="text-gray-600 mt-3 leading-relaxed max-w-xl mx-auto text-sm font-medium">
                Khám phá thêm các bài đọc Readizen theo cấp độ cho trẻ.
                Tất cả hoàn toàn miễn phí.
              </p>

              {/* Primary CTA */}
              <Link to="/library"
                className="mt-6 inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-brand-green text-white font-extrabold hover:bg-brand-dark active:scale-[0.98] transition shadow-md text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green/40 focus-visible:outline-offset-2">
                Xem thư viện
              </Link>

              {/* Secondary CTA */}
              <div className="mt-4">
                <a href="https://zalo.me/g/readizen_daily"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-brand-green font-bold hover:text-brand-dark transition text-sm">
                  Tham gia nhóm Zalo để nhận bài đọc mỗi ngày
                  <svg className="w-4.5 h-4.5 inline-block ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </section>
          </main>

          {/* AI PRACTICE SECTION (FULL-WIDTH SLATE) */}
          <section id="practice" className="w-full bg-slate-50 py-14 sm:py-20 border-y border-[#EAE5D1] scroll-mt-20 text-left">
            <div className="max-w-5xl mx-auto px-6">

              {/* Section Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-light border border-brand-green/20 text-brand-green text-[10px] font-extrabold mb-4 uppercase tracking-wider">
                  <span className="hidden sm:inline-flex w-4 h-4 rounded-full bg-brand-green text-white items-center justify-center text-[9px]">2</span>
                  <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse sm:hidden"></span>
                  Bước 2 · AI Voice Pronunciation Assessment
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
                  Luyện Phát Âm Từng Câu
                </h2>
                <p className="text-gray-500 font-medium text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
                  Nghe AI đọc mẫu từng câu truyện, bấm nút thu âm và đọc to lại. Hệ thống AI thông minh của Readizen sẽ chấm điểm chi tiết từ 0 - 100 ngay lập tức!
                </p>
              </div>

              {/* Progress bar and score dashboard — đặt đầu section để luôn neo tiến độ */}
              <div className="mb-10 bg-brand-dark rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-lift flex flex-col md:flex-row items-center justify-between gap-7 sm:gap-8 relative overflow-hidden text-white">
                <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-brand-green/40 rounded-full blur-2xl pointer-events-none"></div>

                <div className="relative z-10 flex items-center gap-5 w-full md:w-3/5">
                  <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                    <span className="text-2xl" aria-hidden="true">🏆</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-white font-black text-lg sm:text-xl">Tiến độ bài luyện đọc</h3>
                    <div className="flex items-center justify-between mt-1 mb-2">
                      <p className="text-green-150 text-xs font-semibold">Đã đọc hoàn thành</p>
                      <p className="text-white text-xs font-extrabold">{completedCompletedText(completedCount, totalCount)}</p>
                    </div>
                    {/* Progress bar */}
                    <div
                      className="w-full h-2 bg-black/30 rounded-full overflow-hidden border border-white/5"
                      role="progressbar"
                      aria-valuenow={completedCount}
                      aria-valuemin={0}
                      aria-valuemax={totalCount}
                    >
                      <div
                        className="h-full bg-brand-yellow rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${(completedCount / totalCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 flex flex-col items-center md:items-end justify-center gap-3 shrink-0 w-full md:w-auto">
                  <div className="text-center md:text-right">
                    <p className="text-[9px] font-extrabold text-green-100 uppercase tracking-widest mb-1">Điểm trung bình</p>
                    <p className={`text-4xl sm:text-5xl font-black leading-none tracking-tight ${getScoreTextClass(averageScore)}`} aria-live="polite">
                      {completedCount > 0 ? averageScore : '—'}
                    </p>
                  </div>

                  <button
                    disabled={!isAllCompleted || isSubmitting}
                    onClick={handleSubmitScores}
                    className="w-full md:w-auto bg-brand-yellow hover:bg-yellow-400 text-brand-darker px-8 py-3.5 rounded-full font-black text-xs transition shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang lưu...</span>
                      </span>
                    ) : (
                      <span>Hoàn thành & Lưu kết quả</span>
                    )}
                  </button>
                  {!isAllCompleted && (
                    <p className="text-[10px] text-green-100/70 font-semibold text-center md:text-right">
                      Hoàn thành tất cả câu để lưu kết quả
                    </p>
                  )}
                </div>
              </div>

              {/* Grid of Sentence Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {flatSentences.map((s, index) => {
                  const score = sentenceScores[index];
                  const isRecording = recordingIndex === index;
                  const isEvaluating = evaluatingIndex === index;
                  const isDone = score !== null && score !== undefined;

                  return (
                    <article
                      key={index}
                      className={`relative overflow-hidden bg-white rounded-3xl p-6 shadow-sm border-2 transition-all duration-300 flex flex-col justify-between group ${isRecording
                        ? 'border-red-400 shadow-md ring-2 ring-red-100'
                        : isDone
                          ? 'border-brand-green/30 hover:shadow-md hover:border-brand-green/50'
                          : 'border-[#EAE5D1] hover:shadow-md hover:border-brand-green/40'
                        }`}
                    >
                      {/* Hiệu ứng nền nhấp nháy nhẹ khi đang thu âm (UX Indicator) */}
                      {isRecording && (
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-50 rounded-full blur-3xl animate-pulse pointer-events-none" />
                      )}

                      <div className="flex justify-between items-start gap-4 relative z-10">
                        <div className="space-y-2 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                              Câu luyện đọc #{index + 1}
                            </span>
                            {isRecording && (
                              <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 uppercase tracking-widest animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                Đang thu
                              </span>
                            )}
                            {isDone && !isRecording && !isEvaluating && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-green uppercase tracking-widest">
                                <CheckCircle2 className="w-3 h-3" />
                                Đã đọc
                              </span>
                            )}
                          </div>
                          <p className="text-lg sm:text-xl font-bold text-gray-800 leading-snug group-hover:text-gray-900 transition-colors">
                            {s.text}
                          </p>
                        </div>

                        {/* Cụm hiển thị điểm số */}
                        <div className="flex flex-col items-center shrink-0">
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                            Điểm
                          </span>
                          <div
                            className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-black text-lg shadow-sm transition-all ${isEvaluating ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-100'
                              } ${score !== null && !isEvaluating ? getScoreColorClass(score) : 'text-gray-400'}`}
                            aria-live="polite"
                          >
                            {isEvaluating ? (
                              <Loader2 className="w-5 h-5 text-brand-green animate-spin" />
                            ) : score !== null ? (
                              score
                            ) : (
                              '—'
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Khu vực nút bấm */}
                      <div className="mt-7 flex items-center gap-3 relative z-10">
                        <button
                          onClick={() => handleListenTemplate(s.text)}
                          disabled={isRecording}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-light/50 text-brand-green font-bold hover:bg-brand-light transition-colors text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green/40"
                          aria-label="Nghe câu mẫu"
                        >
                          <Volume2 className="w-4.5 h-4.5" />
                          <span>Nghe</span>
                        </button>

                        {isRecording ? (
                          <button
                            onClick={stopRecording}
                            className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white font-bold shadow-md shadow-red-500/20 hover:bg-red-600 active:scale-[0.98] transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-300"
                            aria-label="Dừng ghi âm"
                          >
                            <Square className="w-4 h-4 fill-white animate-pulse" />
                            <span className="text-sm">Dừng thu âm</span>
                          </button>
                        ) : (
                          <button
                            disabled={recordingIndex !== null || isEvaluating}
                            onClick={() => startRecording(index)}
                            className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-green text-white font-bold shadow-md shadow-brand-green/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:shadow-none cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green/50"
                            aria-label={isDone ? 'Đọc lại câu này' : 'Bắt đầu thu âm'}
                          >
                            <Mic className="w-4.5 h-4.5" />
                            <span className="text-sm">
                              {score !== null ? 'Đọc lại' : 'Bắt đầu đọc'}
                            </span>
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ================= SECTION 5: CÓ THỂ BẠN QUAN TÂM ================= */}
          <section className="bg-gradient-to-br from-brand-green to-brand-dark py-16 pb-24 sm:pb-16 relative overflow-hidden text-white w-full text-left">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
              <div className="mb-10">
                <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 text-brand-yellow text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
                  Có thể bạn quan tâm
                </div>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
                  Tiếp tục khám phá Readizen
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <article className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-[2rem] p-6 sm:p-8 shadow-lg">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-3xl mb-6" aria-hidden="true">
                    🌱
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Hiểu hơn về Readizen
                  </h3>
                  <p className="text-green-100/90 mt-4 leading-relaxed font-medium">
                    Tìm hiểu cách Readizen giúp trẻ đọc tiếng Anh tại nhà thông qua sách, công nghệ luyện đọc và lộ trình học phù hợp.
                  </p>
                  <Link to="/" className="mt-7 inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-white text-brand-green font-extrabold hover:bg-brand-light active:scale-[0.98] transition shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
                    Về trang chủ
                  </Link>
                </article>

                <article className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl text-gray-900">
                  <div className="w-14 h-14 rounded-2xl bg-brand-light flex items-center justify-center text-3xl mb-6" aria-hidden="true">
                    📦
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
                    Readizen Set 1
                  </h3>
                  <p className="text-gray-600 mt-4 leading-relaxed font-medium">
                    Bộ sách đọc tiếng Anh thương mại đầu tiên của Readizen, dành cho trẻ mới bắt đầu luyện đọc có hướng dẫn.
                  </p>
                  <Link to="/library" className="mt-7 inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-brand-yellow text-brand-darker font-extrabold hover:bg-yellow-400 active:scale-[0.98] transition shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-darker/40">
                    Xem thêm Readizen Set 1
                  </Link>
                </article>
              </div>
            </div>
          </section>

          {/* MOBILE STICKY CTA */}
          <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-[#EAE5D1] px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] sm:hidden">
            <div className="max-w-5xl mx-auto flex items-center gap-3">
              <a href="#ebook"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-full border border-[#EAE5D1] bg-white text-brand-green font-extrabold text-xs active:scale-[0.98] transition">
                EBook
              </a>

              <a href="#practice"
                className="flex-[2] inline-flex items-center justify-center gap-2 py-3 rounded-full bg-brand-green text-white font-extrabold shadow-md text-xs active:scale-[0.98] transition">
                Luyện đọc AI
              </a>
            </div>
          </div>
        </>
      ) : (
        /* Completed view */
        <div className="flex-grow max-w-lg mx-auto w-full px-6 flex flex-col justify-center items-center py-20 text-left">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl p-8 sm:p-10 w-full text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-brand-light text-brand-green rounded-full flex items-center justify-center mb-6 shadow-md ring-4 ring-brand-light/40">
              <Award className="w-10 h-10" strokeWidth={2} />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-brand-dark leading-snug">Chúc Mừng Bé Đã Hoàn Thành!</h2>
            <p className="text-sm text-gray-555 mt-2 leading-relaxed">Bé đã hoàn thành xuất sắc tất cả câu truyện luyện đọc AI.</p>

            {/* Overall score box */}
            <div className="mt-8 bg-brand-cream/40 rounded-3xl border border-brand-green/10 p-6 w-full text-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Điểm trung bình bài đọc</span>
              <span className="text-6xl font-black text-brand-green mt-2 block" aria-live="polite">
                {averageScore}
              </span>
              <div className="w-full bg-gray-200 h-2.5 rounded-full mt-4 overflow-hidden shadow-inner">
                <div
                  className="bg-brand-green h-full rounded-full transition-all duration-500"
                  style={{ width: `${averageScore}%` }}
                />
              </div>

              {/* Tóm tắt số câu đọc tốt (>=80đ) — chỉ là hiển thị, không thêm logic mới */}
              <div className="flex items-center justify-center gap-2 mt-5 pt-4 border-t border-brand-green/10">
                <CheckCircle2 className="w-4 h-4 text-brand-green" />
                <p className="text-xs font-bold text-gray-600">
                  {sentenceScores.filter(s => s !== null && s >= 80).length} / {totalCount} câu đạt mức xuất sắc
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/profile')}
              className="mt-10 bg-brand-green hover:bg-brand-dark text-white px-10 py-3.5 rounded-full font-black text-xs shadow-lg transition active:scale-[0.98] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green/40 focus-visible:outline-offset-2"
            >
              Quay lại Trang cá nhân
            </button>
          </div>
        </div>
      )}

      {/* FULL SCREEN MODAL VIEW */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Xem ebook toàn màn hình"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Top Bar inside modal */}
          <div className="absolute top-0 inset-x-0 z-10 px-4 sm:px-6 py-4 flex items-center justify-between text-white bg-gradient-to-b from-black/60 to-transparent">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-white/60">Chế độ toàn màn hình</p>
              <p className="text-xs font-bold mt-0.5">
                Trang <span className="text-brand-yellow">{carouselIndex + 1}</span> / {totalImages}
              </p>
            </div>

            <button
              onClick={() => setIsFullscreen(false)}
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
              aria-label="Đóng ebook"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Book Page Image */}
          {currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt={`Trang ${carouselIndex + 1}`}
              className="rounded-2xl shadow-2xl bg-white object-contain select-none max-h-[85vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => { e.target.src = 'https://placehold.co/600x450?text=Ebook+Page' }}
            />
          ) : (
            <div className="w-full max-w-[600px] aspect-[4/3] bg-white rounded-2xl flex items-center justify-center font-bold text-gray-500">
              Không có hình ảnh
            </div>
          )}

          {/* Navigation Controls */}
          {totalImages > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrevPage(); }}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
                aria-label="Trang trước"
              >
                <ChevronLeft className="w-7 h-7 stroke-[3px]" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); goNextPage(); }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
                aria-label="Trang sau"
              >
                <ChevronRight className="w-7 h-7 stroke-[3px]" />
              </button>

              {/* Progress dots đồng bộ với khu vực ebook */}
              {totalImages <= 12 && (
                <div
                  className="absolute bottom-5 sm:bottom-7 inset-x-0 flex items-center justify-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  {Array.from({ length: totalImages }).map((_, i) => (
                    <span
                      key={i}
                      className={`rounded-full transition-all duration-300 ${i === carouselIndex ? 'w-6 h-2 bg-brand-yellow' : 'w-2 h-2 bg-white/30'}`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
}

// Helper functions
const completedCompletedText = (completed, total) => {
  return `${completed} / ${total} câu`;
};