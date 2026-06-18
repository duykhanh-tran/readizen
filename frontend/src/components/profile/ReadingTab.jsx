import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/axios.js';
import { Award, Loader2, Calendar, ArrowRight } from 'lucide-react';

export default function ReadingTab() {
  const navigate = useNavigate();
  const [completedScores, setCompletedScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scoresRes = await api.get('/user/my-scores');
        setCompletedScores(scoresRes.data);
      } catch (err) {
        console.error(err);
        setError('Có lỗi xảy ra khi tải dữ liệu học tập.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getProgressColor = (score) => {
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

  // Calculate overall student stats
  const totalCompleted = completedScores.length;
  const overallAverage = totalCompleted > 0 
    ? Math.round(completedScores.reduce((sum, item) => sum + item.averageScore, 0) / totalCompleted) 
    : 0;

  return (
    <div className="space-y-8 font-sans">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-brand-dark">Kết Quả Luyện Đọc AI</h2>
          <p className="text-xs text-gray-500 mt-1">Theo dõi tiến độ phát âm và điểm số đánh giá từ AI của bé.</p>
        </div>
        <button
          onClick={() => navigate('/library')}
          className="inline-flex items-center gap-1.5 bg-brand-green hover:bg-brand-dark transition text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-md cursor-pointer self-start sm:self-center"
        >
          <span>Vào thư viện luyện đọc</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-150 text-red-800 p-4 rounded-2xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Stats Summary Panel */}
      {totalCompleted > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-brand-green text-white p-6 rounded-[2rem] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">
              🏆
            </div>
            <div>
              <p className="text-[10px] text-brand-light font-bold uppercase tracking-wider">Bài đọc hoàn thành</p>
              <p className="text-2xl font-black mt-0.5">{totalCompleted} câu chuyện</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-light text-brand-green rounded-2xl flex items-center justify-center text-2xl">
              🎯
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Điểm phát âm trung bình</p>
              <p className="text-2xl font-black text-brand-dark mt-0.5">{overallAverage} điểm</p>
            </div>
          </div>
        </div>
      )}

      {/* Completed Lessons & Progress List */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-brand-green" />
          <span>Bài học đã hoàn thành ({totalCompleted})</span>
        </h3>

        {totalCompleted === 0 ? (
          <div className="bg-white p-10 rounded-[2rem] border border-gray-100 text-center text-xs text-gray-500 shadow-sm space-y-4 max-w-md mx-auto">
            <div className="text-4xl">📚</div>
            <p className="font-semibold text-gray-600">Bé chưa hoàn thành bài luyện đọc nào.</p>
            <p className="text-gray-400 leading-relaxed">Hãy mở Thư viện học tập của Readizen để chọn một cuốn sách và bắt đầu luyện phát âm cùng AI nhé!</p>
            <button
              onClick={() => navigate('/library')}
              className="bg-brand-green hover:bg-brand-dark text-white px-6 py-2.5 rounded-full font-bold text-xs shadow-md transition cursor-pointer"
            >
              Xem thư viện sách
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {completedScores.map((record) => (
              <div 
                key={record._id}
                className="bg-white p-5 rounded-[2rem] border border-gray-150 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition duration-200"
              >
                {/* Book info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={record.lessonId?.coverImage} 
                      alt={record.lessonId?.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://placehold.co/150x200?text=Book' }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 text-xs truncate">{record.lessonId?.title || 'Bài học đã xóa'}</h4>
                    <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Hoàn thành vào: {new Date(record.completedAt).toLocaleDateString('vi-VN')}</span>
                    </p>
                  </div>
                </div>

                {/* Score & Progress bar */}
                <div className="flex items-center gap-6 flex-shrink-0">
                  <div className="w-36 md:w-48 space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400 font-semibold">Độ chính xác:</span>
                      <span className="font-bold text-gray-800">{record.averageScore}%</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden shadow-inner border border-gray-50">
                      <div 
                        className={`h-full rounded-full transition-all ${getProgressColor(record.averageScore)}`}
                        style={{ width: `${record.averageScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Score badge */}
                  <div className={`px-4 py-2 rounded-2xl border text-center min-w-[60px] ${getScoreColor(record.averageScore)}`}>
                    <div className="text-lg font-black">{record.averageScore}</div>
                    <div className="text-[7px] font-black uppercase tracking-wide">Điểm AI</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
