import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Loader2, Calendar, ChevronDown, ChevronUp, Sparkles, ArrowRight, TrendingUp } from 'lucide-react';
import api from '../../services/axios.js';

export default function SmartAbcTab() {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAttemptId, setExpandedAttemptId] = useState(null);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await api.get('/alphabet/my/attempts');
        setAttempts(res.data);
      } catch (err) {
        console.error('Error fetching alphabet attempts:', err);
        setError('Có lỗi xảy ra khi tải lịch sử SmartABC của bé.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  const toggleExpand = (id) => {
    setExpandedAttemptId(expandedAttemptId === id ? null : id);
  };

  const getScoreColorClass = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-100';
    return 'text-red-600 bg-red-50 border-red-100';
  };

  const getProgressColorClass = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
      </div>
    );
  }

  const totalAttempts = attempts.length;
  const highestScore = totalAttempts > 0 
    ? Math.max(...attempts.map((a) => a.averageScore)) 
    : 0;

  return (
    <div className="space-y-6 font-sans text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-brand-dark flex items-center gap-2">
            <Sparkles className="w-5.5 h-5.5 text-brand-green fill-brand-green/20" />
            Lịch Sử Luyện Tập SmartABC
          </h2>
          <p className="text-xs text-gray-500 mt-1">Lịch sử chi tiết các lượt học chữ cái và từ vựng cùng AI của bé.</p>
        </div>
        <button
          onClick={() => navigate('/smartabc')}
          className="inline-flex items-center gap-1.5 bg-brand-green hover:bg-brand-dark transition text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-md cursor-pointer self-start sm:self-center"
        >
          <span>Luyện chữ cái SmartABC</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-150 text-red-800 p-4 rounded-2xl text-xs font-bold">
          {error}
        </div>
      )}

      {/* Stats Board */}
      {totalAttempts > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 bg-brand-light text-brand-green rounded-2xl flex items-center justify-center text-xl shrink-0">
              📊
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tổng số lượt làm lại</p>
              <p className="text-lg font-black text-gray-800 mt-0.5">{totalAttempts} lượt</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-xl shrink-0">
              ⭐
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Điểm số cao nhất</p>
              <p className="text-lg font-black text-gray-800 mt-0.5">{highestScore} điểm</p>
            </div>
          </div>
        </div>
      )}

      {/* Timeline of Attempts */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-brand-green" />
          <span>Tiến trình luyện tập qua các mốc thời gian</span>
        </h3>

        {totalAttempts === 0 ? (
          <div className="bg-white p-10 rounded-[2rem] border border-gray-100 text-center text-xs text-gray-500 shadow-sm space-y-4 max-w-md mx-auto">
            <div className="text-4xl">🔤</div>
            <p className="font-semibold text-gray-600">Bé chưa thực hiện bài luyện tập nào.</p>
            <p className="text-gray-400 leading-relaxed">Hãy cùng bé mở SmartABC để học bảng chữ cái Tiếng Anh chuẩn phát âm cùng AI nhé!</p>
            <button
              onClick={() => navigate('/smartabc')}
              className="bg-brand-green hover:bg-brand-dark text-white px-6 py-2.5 rounded-full font-bold text-xs shadow-md transition cursor-pointer"
            >
              Học bảng chữ cái SmartABC
            </button>
          </div>
        ) : (
          <div className="relative border-l-2 border-gray-100 pl-6 ml-3.5 space-y-6">
            {attempts.map((attempt) => {
              const isExpanded = expandedAttemptId === attempt._id;
              const lesson = attempt.alphabetLessonId;
              const dateObj = new Date(attempt.createdAt);
              const formattedDate = dateObj.toLocaleDateString('vi-VN');
              const formattedTime = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={attempt._id} className="relative">
                  {/* Timeline bullet node */}
                  <span className="absolute -left-[35px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white border-3 border-brand-green shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-green"></span>
                  </span>

                  {/* Card Container */}
                  <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden hover:shadow-md transition duration-200">
                    <div 
                      onClick={() => toggleExpand(attempt._id)}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-light/35 flex items-center justify-center text-brand-green text-lg font-black shrink-0 border border-brand-green/10">
                          {lesson?.letter || '?'}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-800 text-xs sm:text-sm">
                            Học chữ cái: {lesson?.letter || '?'}
                          </h4>
                          <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formattedDate} lúc {formattedTime}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        {/* Score Indicator */}
                        <div className={`px-3 py-1.5 rounded-2xl border text-center min-w-[72px] ${getScoreColorClass(attempt.averageScore)}`}>
                          <span className="text-sm font-black">{attempt.averageScore}%</span>
                          <span className="text-[7px] font-bold block uppercase tracking-wide">Điểm AI</span>
                        </div>

                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Word-by-word Breakdown details */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 border-t border-gray-50 bg-[#FAFBF8]/50 space-y-3.5 animate-in fade-in duration-150">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chi tiết điểm từ vựng:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {attempt.wordScores?.map((ws, index) => (
                            <div 
                              key={index}
                              className="bg-white p-3 rounded-2xl border border-gray-100 shadow-inner flex items-center justify-between gap-3"
                            >
                              <span className="text-xs font-extrabold text-gray-700 capitalize">{ws.word}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-100 h-1.5 rounded-full overflow-hidden shadow-inner border border-gray-50/50">
                                  <div 
                                    className={`h-full rounded-full ${getProgressColorClass(ws.score)}`}
                                    style={{ width: `${ws.score}%` }}
                                  />
                                </div>
                                <span className={`text-[10px] font-black w-8 text-right ${getScoreColorClass(ws.score).split(' ')[0]}`}>
                                  {ws.score}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
