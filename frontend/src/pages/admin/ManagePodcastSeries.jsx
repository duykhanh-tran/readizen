import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/axios.js';
import { Plus, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';

export default function ManagePodcastSeries() {
  const navigate = useNavigate();
  const [seriesList, setSeriesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSeries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get('/podcasts/admin/series');
      setSeriesList(res.data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách Podcast Series:', err);
      setError('Không thể tải danh sách Podcast Series.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa Series này? Tất cả các tập Podcast thuộc Series sẽ bị xóa vĩnh viễn!')) return;
    try {
      await api.delete(`/podcasts/admin/series/${id}`);
      fetchSeries();
    } catch (err) {
      console.error('Lỗi khi xóa Series:', err);
      alert('Không thể xóa Series này.');
    }
  };

  return (
    <div className="space-y-6 text-left font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Quản lý Podcast Series</h1>
          <p className="text-xs text-gray-500 font-semibold mt-1">Tạo và biên soạn các danh mục Series bài học âm thanh/video cho phụ huynh</p>
        </div>
        <button
          onClick={() => navigate('/admin/podcasts/series/create')}
          className="flex items-center gap-1.5 bg-brand-green text-white hover:bg-brand-dark px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Series mới</span>
        </button>
      </div>

      {/* Series Grid / Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
          <p className="text-xs text-gray-500 font-bold mt-3">Đang tải danh sách Series...</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-xs font-semibold">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Thứ tự</th>
                  <th className="py-4 px-6">Ảnh bìa</th>
                  <th className="py-4 px-6">Tên Series</th>
                  <th className="py-4 px-6">Slug</th>
                  <th className="py-4 px-6">Host / Đối tượng</th>
                  <th className="py-4 px-6">Trạng thái</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                {seriesList.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-gray-400 italic">Chưa có Podcast Series nào. Nhấn "Thêm Series mới" để khởi tạo.</td>
                  </tr>
                ) : (
                  seriesList.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50/50 transition">
                      <td className="py-4.5 px-6 font-bold">{item.order}</td>
                      <td className="py-4.5 px-6">
                        <img
                          src={item.coverAsset?.assetUrl || 'https://placehold.co/100?text=Cover'}
                          alt={item.title}
                          className="w-12 h-12 object-cover bg-gray-50 rounded-xl border border-gray-100 p-0.5"
                          onError={(e) => { e.target.src = 'https://placehold.co/100?text=Cover'; }}
                        />
                      </td>
                      <td className="py-4.5 px-6 font-extrabold text-gray-900">{item.title}</td>
                      <td className="py-4.5 px-6 text-gray-500 font-mono">{item.slug}</td>
                      <td className="py-4.5 px-6">
                        <div className="text-[11px] font-bold text-gray-800">{item.host}</div>
                        <div className="text-[10px] text-gray-400 font-medium mt-0.5">{item.targetAudience}</div>
                      </td>
                      <td className="py-4.5 px-6">
                        {item.status === 'published' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold">
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200 text-[10px] font-bold">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="py-4.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate(`/admin/podcasts/series/edit/${item._id}`)}
                            className="p-2 text-gray-600 hover:text-brand-green hover:bg-brand-light/50 rounded-lg transition cursor-pointer"
                            title="Sửa Series"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Xóa Series"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
