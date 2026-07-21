import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/axios.js';
import {
  Edit, AlertCircle, BookOpen, Check, EyeOff, Sparkles, RefreshCw
} from 'lucide-react';

export default function ManageAlphabet() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchLessons = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/alphabet/admin/all');
      setLessons(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách chữ cái.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const totalPages = Math.ceil(lessons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLessons = lessons.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-8 text-left font-sans">

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Quản lý Bảng Chữ Cái (A-Z)</h2>
          <p className="text-sm text-gray-500 mt-1">Biên soạn 26 chữ cái kèm hình ảnh minh họa và các từ vựng liên quan.</p>
        </div>

        <button
          onClick={fetchLessons}
          className="flex items-center justify-center gap-2 bg-brand-light text-brand-green border border-brand-green/20 hover:bg-brand-green hover:text-white transition px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Tải lại</span>
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-xs font-semibold">{error}</span>
        </div>
      )}

      {/* Main content grid */}
      {isLoading && lessons.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-green border-t-transparent"></div>
        </div>
      ) : lessons.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-green">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-gray-800">Không tìm thấy chữ cái nào</h3>
          <p className="text-xs text-gray-500 mt-1">Vui lòng khởi động lại Server Backend để hệ thống tự động khởi tạo dữ liệu A-Z.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="py-4.5 px-6 w-20 text-center">Chữ cái</th>
                  <th className="py-4.5 px-6 w-28">Hình ảnh</th>
                  <th className="py-4.5 px-6">Từ vựng đính kèm</th>
                  <th className="py-4.5 px-6 w-24">Smart Code</th>
                  <th className="py-4.5 px-6 w-32">Trạng thái</th>
                  <th className="py-4.5 px-6 w-32 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-700">
                {paginatedLessons.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4.5 px-6 text-center">
                      <span className="inline-flex w-10 h-10 rounded-xl bg-brand-light font-black text-brand-green items-center justify-center text-lg shadow-sm border border-brand-green/10">
                        {item.letter}
                      </span>
                    </td>
                    <td className="py-4.5 px-6">
                      <img
                        src={item.thumbnail}
                        alt={item.letter}
                        className="w-12 h-12 object-contain bg-gray-55 rounded-xl border border-gray-100 p-1"
                        onError={(e) => { e.target.src = 'https://placehold.co/100?text=' + item.letter }}
                      />
                    </td>
                    <td className="py-4.5 px-6">
                      {item.vocabularies && item.vocabularies.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 max-w-xl">
                          {item.vocabularies.map((v, i) => (
                            <span key={i} className="inline-flex px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium border border-gray-200">
                              {v.word}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 font-medium italic">Chưa cấu hình từ vựng</span>
                      )}
                    </td>
                    <td className="py-4.5 px-6">
                      {item.smartCode ? (
                        <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                          {item.smartCode}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </td>
                    <td className="py-4.5 px-6">
                      {item.status === 'published' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold">
                          <Check className="w-3.5 h-3.5" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200 text-[10px] font-bold">
                          <EyeOff className="w-3.5 h-3.5" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <button
                        onClick={() => navigate(`/admin/alphabet/edit/${item._id}`)}
                        className="inline-flex items-center gap-1 bg-brand-light text-brand-green border border-brand-green/20 hover:bg-brand-green hover:text-white px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Biên soạn</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 bg-white px-6 py-4">
              <div className="text-xs text-gray-500 font-semibold">
                Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, lessons.length)} trên tổng số {lessons.length} chữ cái
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3.5 py-2 bg-white border border-gray-250 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-600 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed cursor-pointer shadow-sm transition"
                >
                  ←
                </button>
                <span className="text-xs font-extrabold text-gray-700 px-2">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-2 bg-white border border-gray-250 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-600 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed cursor-pointer shadow-sm transition"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
