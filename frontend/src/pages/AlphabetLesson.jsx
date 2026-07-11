import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/axios.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import useAudioRecorder from '../hooks/useAudioRecorder.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Volume2, Mic, Square, Loader2, ArrowLeft, ChevronLeft,
  ChevronRight, AlertCircle
} from 'lucide-react';

export default function AlphabetLesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vocabulary Carousel Index
  const [wordIndex, setWordIndex] = useState(0);

  const [vocabList, setVocabList] = useState([]);
  const [vocabScores, setVocabScores] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Custom hook for recording & AI evaluation
  const {
    recordingIndex,
    evaluatingIndex,
    startRecording,
    stopRecording,
    evaluateAudio,
    playSpeechText,
    clearFeedback,
    isEvaluating
  } = useAudioRecorder();

  useEffect(() => {
    const fetchLessonDetail = async () => {
      try {
        const response = await api.get(`/alphabet/${id}`);
        const data = response.data;
        setLesson(data);
        const combinedList = [
          { word: data.letter, imageUrl: data.thumbnail },
          ...(data.vocabularies || [])
        ];
        setVocabList(combinedList);
        setVocabScores(new Array(combinedList.length).fill(null));
      } catch (err) {
        console.error('Error fetching alphabet lesson:', err);
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải bài học.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonDetail();
  }, [id]);

  const goPrev = () => {
    if (isEvaluating || vocabList.length === 0) return;
    clearFeedback();
    setWordIndex(prev => (prev === 0 ? vocabList.length - 1 : prev - 1));
  };

  const goNext = () => {
    if (isEvaluating || vocabList.length === 0) return;
    clearFeedback();
    setWordIndex(prev => (prev === vocabList.length - 1 ? 0 : prev + 1));
  };

  const handleStopRecord = async () => {
    if (vocabList.length === 0) return;
    const targetWord = vocabList[wordIndex].word;
    const audioBlob = await stopRecording();
    if (audioBlob) {
      const result = await evaluateAudio(targetWord, audioBlob, wordIndex);
      if (result) {
        const updated = [...vocabScores];
        updated[wordIndex] = {
          score: result.score,
          feedback: result
        };
        setVocabScores(updated);
      }
    }
  };

  const handleStartRecord = () => {
    if (isEvaluating) return;
    startRecording(wordIndex, handleStopRecord);
  };

  const handleSaveResult = async () => {
    setIsSubmitting(true);
    try {
      if (isAuthenticated) {
        const payload = {
          alphabetLessonId: lesson._id,
          scores: vocabList.map((v, idx) => ({
            word: v.word,
            score: vocabScores[idx] ? vocabScores[idx].score : 0
          }))
        };
        await api.post('/alphabet/score', payload);
      }
      setIsFinished(true);
    } catch (err) {
      console.error('Error saving alphabet scores:', err);
      alert('Không thể lưu kết quả học tập. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColorClass = (score) => {
    if (score === null || score === undefined) return 'text-gray-400 border-gray-200 bg-gray-50';
    if (score >= 80) return 'text-green-600 border-green-200 bg-green-50';
    if (score >= 50) return 'text-yellow-600 border-yellow-200 bg-yellow-50';
    return 'text-red-600 border-red-200 bg-red-50';
  };

  const renderWordWithFeedback = (word, scoreObj) => {
    if (!scoreObj || !scoreObj.feedback) {
      return (
        <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-800 tracking-wide font-sans uppercase">
          <span className="text-brand-green">{word[0]}</span>{word.slice(1)}
        </span>
      );
    }

    const { transcript } = scoreObj.feedback;
    const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanTranscript = (transcript || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    if (cleanWord === cleanTranscript) {
      return (
        <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-green-600 tracking-wide font-sans uppercase">
          {word}
        </span>
      );
    }

    const transcriptLower = (transcript || '').toLowerCase();

    return (
      <span className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-wide font-sans uppercase">
        {word.split('').map((char, idx) => {
          const charLower = char.toLowerCase();
          const isMatch = transcriptLower[idx] === charLower;
          const colorClass = isMatch ? 'text-green-600' : 'text-red-500';
          return (
            <span key={idx} className={colorClass}>
              {char}
            </span>
          );
        })}
      </span>
    );
  };

  if (isLoading || vocabList.length === 0) {
    return (
      <div className="min-h-screen bg-brand-cream/30 flex flex-col font-sans pt-16 lg:pt-[72px]">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-brand-green animate-spin" strokeWidth={2.5} />
          <p className="text-sm text-gray-500 font-semibold">Đang chuẩn bị chữ cái...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-brand-cream/30 flex flex-col font-sans pt-16 lg:pt-[72px]">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-5 ring-1 ring-red-100">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-gray-800 text-lg">Bài học không khả dụng</h3>
          <p className="text-sm text-gray-500 mt-2 mb-7 leading-relaxed">{error || 'Không tìm thấy chữ cái này.'}</p>
          <Link
            to="/smartabc"
            className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-dark text-white px-7 py-2.5 rounded-full text-sm font-bold shadow-md transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại bảng chữ cái
          </Link>
        </div>
      </div>
    );
  }

  const activeVocab = vocabList[wordIndex];
  const activeScore = vocabScores[wordIndex];
  const completedCount = vocabScores.filter(s => s !== null).length;
  const totalCount = vocabList.length;
  const isAllCompleted = completedCount === totalCount;
  const averageScore = completedCount > 0
    ? Math.round(vocabScores.reduce((sum, s) => sum + (s ? s.score : 0), 0) / completedCount)
    : 0;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(68,166,92,0.12),transparent_32%),linear-gradient(180deg,#FFFDF3_0%,#F8FAF1_48%,#FFFDF3_100%)] flex flex-col font-sans antialiased text-gray-800 pt-20 lg:pt-24">
      <Header />

      {!isFinished ? (
        <main className="flex-grow max-w-2xl mx-auto px-4 sm:px-6 py-6 w-full flex flex-col justify-center">
          {/* Back button */}
          <div className="mb-4">
            <Link
              to="/smartabc"
              className="inline-flex items-center gap-2 rounded-full border border-brand-green/10 bg-white/80 px-4 py-2 text-xs font-extrabold text-gray-500 shadow-sm backdrop-blur hover:border-brand-green/25 hover:bg-brand-light/50 hover:text-brand-green transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Quay lại Bảng Chữ Cái
            </Link>
          </div>

          {/* Card Outer Container */}
          <div className="relative w-full overflow-visible rounded-[32px] border border-brand-green/10 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)] flex flex-col group transition-all duration-500 hover:border-brand-green/20 hover:shadow-[0_28px_70px_rgba(15,23,42,0.12)]">
            <div className="pointer-events-none absolute -inset-1 -z-10 rounded-[36px] bg-gradient-to-br from-brand-green/15 via-white to-brand-yellow/15 opacity-60 blur-xl transition-opacity duration-500 group-hover:opacity-90" />

            {/* Floating Left Arrow Button */}
            <button
              onClick={goPrev}
              disabled={isEvaluating}
              className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-brand-light border border-brand-green/15 flex items-center justify-center text-gray-700 hover:text-brand-green shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed cursor-pointer backdrop-blur"
              aria-label="Từ trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Floating Right Arrow Button */}
            <button
              onClick={goNext}
              disabled={isEvaluating}
              className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-brand-light border border-brand-green/15 flex items-center justify-center text-gray-700 hover:text-brand-green shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed cursor-pointer backdrop-blur"
              aria-label="Từ sau"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="w-full rounded-t-[32px] border-b border-brand-green/10 bg-white/90 px-5 py-4 sm:px-6 flex items-center justify-between backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-green text-white flex items-center justify-center font-black text-xl shadow-sm border-2 border-white select-none">
                  {lesson.letter}
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-black text-gray-900 tracking-tight">Luyện đọc chữ cái {lesson.letter}</h2>
                  <p className="text-[9px] sm:text-[10px] font-extrabold text-brand-green uppercase tracking-[0.2em] mt-0.5">
                    Từ vựng {wordIndex + 1} / {totalCount}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-gray-500 shrink-0 select-none">
                  {completedCount}/{totalCount}
                </span>
                <div className="w-20 sm:w-28 h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-205 shadow-inner">
                  <div
                    className="h-full bg-brand-green rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(68,166,92,0.3)]"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Main Word Carousel Slide Area - Stretches image to left/right boundaries */}
            <div className="relative w-full min-h-[280px] sm:min-h-[340px] lg:min-h-[380px] overflow-hidden border-b border-brand-green/10 bg-gradient-to-br from-brand-light/45 via-white to-[#F6FBF3] flex items-center justify-center p-4">
              <div className="pointer-events-none absolute -top-20 -right-20 h-52 w-52 rounded-full bg-brand-green/5 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-brand-yellow/10 blur-2xl" />

              {/* Target Letter background watermark */}
              <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-[0.03]">
                <span className="text-[200px] sm:text-[240px] lg:text-[285px] font-black text-brand-green tracking-wide leading-none">{lesson.letter}</span>
              </div>

              <img
                src={activeVocab.imageUrl || 'https://placehold.co/500x300?text=' + activeVocab.word}
                alt={activeVocab.word}
                className="relative z-10 h-full max-h-[240px] sm:max-h-[300px] lg:max-h-[340px] w-auto max-w-full object-contain select-none drop-shadow-[0_12px_24px_rgba(15,23,42,0.1)] transition-all duration-700 ease-out group-hover:scale-[1.03]"
                onError={(e) => { e.target.src = 'https://placehold.co/500x300?text=' + activeVocab.word }}
              />

              {/* Score badge absolute positioning */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
                <div className={`w-14 h-14 sm:w-15 sm:h-15 rounded-2xl border-2 flex flex-col items-center justify-center font-black shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-all duration-300 bg-white/90 backdrop-blur ${getScoreColorClass(activeScore ? activeScore.score : null)}`}>
                  {evaluatingIndex === wordIndex ? (
                    <Loader2 className="w-6 h-6 text-brand-green animate-spin" />
                  ) : activeScore ? (
                    <>
                      <span className="text-base font-black leading-none">{activeScore.score}</span>
                      <span className="text-[8px] uppercase font-bold mt-0.5 opacity-70">Điểm</span>
                    </>
                  ) : (
                    <>
                      <span className="text-base font-black leading-none">—</span>
                      <span className="text-[8px] uppercase font-bold mt-0.5 opacity-70">AI</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Word details / buttons area below the image */}
            <div className="w-full px-5 py-7 sm:px-8 lg:px-10 lg:py-9 flex flex-col items-center gap-7 text-center bg-white rounded-b-[36px]">

              {/* Word display with alignment coloring */}
              <div className="text-center select-none">
                {renderWordWithFeedback(activeVocab.word, activeScore)}
              </div>

              {/* Buttons controller */}
              <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center gap-4 mt-1">

                {/* Play Native audio */}
                <button
                  onClick={() => playSpeechText(activeVocab.word)}
                  disabled={isEvaluating}
                  className="w-full sm:flex-1 min-h-[56px] py-4 px-6 rounded-2xl bg-brand-light hover:bg-brand-light/75 text-brand-green border border-brand-green/15 font-extrabold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Nghe phát âm</span>
                </button>

                {/* Record voice button */}
                {recordingIndex === wordIndex ? (
                  <button
                    onClick={handleStopRecord}
                    className="w-full sm:flex-1 min-h-[56px] py-4 px-6 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-extrabold flex items-center justify-center gap-2 transition-all duration-300 animate-pulse cursor-pointer shadow-md shadow-red-200 active:scale-[0.98]"
                  >
                    <Square className="w-5 h-5 fill-white" />
                    <span>Đang thu (Dừng)</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStartRecord}
                    disabled={isEvaluating}
                    className="w-full sm:flex-1 min-h-[56px] py-4 px-6 rounded-2xl bg-brand-green hover:bg-brand-dark text-white font-extrabold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-[0_12px_24px_rgba(68,166,92,0.25)] hover:shadow-[0_16px_32px_rgba(68,166,92,0.34)] active:scale-[0.98]"
                  >
                    <Mic className="w-5 h-5" />
                    <span>Bắt đầu thu âm</span>
                  </button>
                )}
              </div>

              {/* Save result / Completed indicator */}
              {isAllCompleted && (
                <div className="w-full border-t border-gray-100 pt-6 mt-3 flex justify-center">
                  <button
                    onClick={handleSaveResult}
                    disabled={isSubmitting}
                    className="py-4 px-10 rounded-full bg-brand-yellow hover:bg-yellow-400 text-brand-darker font-black text-xs uppercase tracking-widest shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-40 active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang lưu...
                      </span>
                    ) : (
                      'Lưu kết quả & Hoàn thành'
                    )}
                  </button>
                </div>
              )}

            </div>

          </div>
        </main>
      ) : (
        /* Finished Splash Screen dashboard */
        <main className="flex-grow max-w-md mx-auto px-4 py-16 w-full flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-brand-light rounded-full border-4 border-white shadow flex items-center justify-center text-5xl mb-6 animate-bounce">
            🎉
          </div>

          <span className="inline-flex px-3 py-1 rounded-full bg-brand-light text-brand-green text-xs font-black uppercase tracking-wider mb-2">
            Học hoàn thành
          </span>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Tuyệt vời lắm bé ơi!</h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-sm mb-8 font-semibold">
            Bé đã hoàn thành luyện đọc toàn bộ từ vựng của chữ cái <strong className="text-brand-green">{lesson.letter}</strong>!
          </p>

          {/* Results Score Box */}
          <div className="w-full bg-white rounded-3xl border-2 border-gray-150 p-6 shadow-sm mb-8 flex items-center justify-around">
            <div>
              <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Số từ đã hoàn thành</p>
              <p className="text-2xl font-black text-gray-800">{completedCount} / {totalCount}</p>
            </div>
            <div className="w-[2px] h-10 bg-gray-100"></div>
            <div>
              <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Điểm trung bình</p>
              <p className="text-3xl font-black text-brand-green">{averageScore}</p>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="w-full bg-brand-light/35 border border-brand-green/10 rounded-2xl p-4.5 text-left flex items-start gap-3 mb-6">
              <span className="text-xl">💡</span>
              <div>
                <p className="text-xs text-gray-700 font-bold leading-relaxed">
                  Bé học rất giỏi! Hãy Đăng nhập hoặc Đăng ký tài khoản để lưu lại thành tích học tập và xem tiến trình của bé nhé!
                </p>
                <div className="flex gap-4 mt-2">
                  <Link to="/login" className="text-xs font-black text-brand-green hover:underline">Đăng nhập</Link>
                  <Link to="/register" className="text-xs font-black text-brand-green hover:underline">Đăng ký</Link>
                </div>
              </div>
            </div>
          )}

          <div className="w-full flex flex-col gap-3">
            <button
              onClick={() => navigate('/smartabc')}
              className="w-full py-3.5 rounded-full bg-brand-green hover:bg-brand-dark text-white font-extrabold text-sm shadow transition"
            >
              Tiếp tục học chữ cái khác
            </button>

            <button
              onClick={() => {
                setIsFinished(false);
                setWordIndex(0);
                setVocabScores(new Array(vocabList.length).fill(null));
                clearFeedback();
              }}
              className="w-full py-3.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-sm transition"
            >
              Luyện đọc lại chữ cái này
            </button>
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
}
