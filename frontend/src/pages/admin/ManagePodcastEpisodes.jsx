import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/axios.js';
import { Plus, Edit, Trash2, Loader2, AlertCircle, Video, Check, EyeOff, Tv, Film } from 'lucide-react';

export default function ManagePodcastEpisodes() {
  const navigate = useNavigate();
  const [episodes, setEpisodes] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [selectedSeriesFilter, setSelectedSeriesFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const seriesRes = await api.get('/podcasts/admin/series');
      setSeriesList(seriesRes.data);

      const filterParam = selectedSeriesFilter !== 'all' ? `?seriesId=${selectedSeriesFilter}` : '';
      const episodesRes = await api.get(`/podcasts/admin/episodes${filterParam}`);
      setEpisodes(episodesRes.data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách tập Podcast:', err);
      setError('Không thể tải danh sách các tập Podcast.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedSeriesFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tập Podcast này?')) return;
    try {
      await api.delete(`/podcasts/admin/episodes/${id}`);
      fetchData();
    } catch (err) {
      console.error('Lỗi khi xóa tập Podcast:', err);
      alert('Không thể xóa tập Podcast này.');
    }
  };

  const renderSourceBadge = (type) => {
    switch (type) {
      case 'youtube':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[9px] font-black uppercase text-red-600">
            YouTube
          </span>
        );
      case 'tiktok':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-2 py-0.5 text-[9px] font-black uppercase text-white">
            TikTok
          </span>
        );
      case 'upload':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase text-blue-600">
            Tải lên
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 text-left font-sans">
      {/* Header Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Quản lý Tập Podcast</h1>
          <p className="text-xs text-gray-500 font-semibold mt-1">Biên soạn và xuất bản các tập Podcast (Bài giảng dài & Video ngắn Shorts)</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin/podcasts/episodes/create')}
            className="flex items-center gap-1.5 bg-brand-green text-white hover:bg-brand-dark px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm tập Podcast mới</span>
          </button>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <span className="text-xs font-black text-gray-500">Lọc theo Series:</span>
        <select
          value={selectedSeriesFilter}
          onChange={(e) => setSelectedSeriesFilter(e.target.value)}
          className="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 rounded-xl px-3 py-2 outline-none focus:border-brand-green/50 cursor-pointer"
        >
          <option value="all">Tất cả các Series</option>
          {seriesList.map(s => (
            <option key={s._id} value={s._id}>{s.title}</option>
          ))}
        </select>
      </div>

      {/* Main Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
          <p className="text-xs text-gray-500 font-bold mt-3">Đang tải danh sách tập Podcast...</p>
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
                  <th className="py-4 px-6">Tập #</th>
                  <th className="py-4 px-6 font-mono text-amber-800">Smart Code</th>
                  <th className="py-4 px-6">Ảnh thu nhỏ</th>
                  <th className="py-4 px-6">Tiêu đề tập</th>
                  <th className="py-4 px-6">Series</th>
                  <th className="py-4 px-6">Định dạng</th>
                  <th className="py-4 px-6">Nguồn phát</th>
                  <th className="py-4 px-6">Trạng thái</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                {episodes.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-10 text-gray-400 italic">Không tìm thấy tập Podcast nào. Nhấn "Thêm tập Podcast mới" để biên soạn.</td>
                  </tr>
                ) : (
                  episodes.map((ep) => (
                    <tr key={ep._id} className="hover:bg-gray-50/50 transition">
                      <td className="py-4.5 px-6 font-extrabold text-brand-green">Tập {ep.episodeNumber}</td>
                      <td className="py-4.5 px-6 font-mono font-bold text-amber-800">
                        {ep.smartCode ? (
                          <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-900 font-extrabold">
                            {ep.smartCode}
                          </span>
                        ) : (
                          <span className="text-gray-400 font-normal">--</span>
                        )}
                      </td>
                      <td className="py-4.5 px-6">
                        <img
                          src={ep.thumbnailAsset?.assetUrl || 'https://placehold.co/100?text=Thumb'}
                          alt={ep.title}
                          className={`object-cover bg-gray-50 rounded-lg border border-gray-100 ${ep.aspectRatio === '9:16' ? 'w-8 h-12' : 'w-16 h-9'}`}
                          onError={(e) => { e.target.src = 'https://placehold.co/100?text=Thumb'; }}
                        />
                      </td>
                      <td className="py-4.5 px-6 font-extrabold text-gray-900 max-w-xs truncate">{ep.title}</td>
                      <td className="py-4.5 px-6 font-bold text-gray-600">{ep.seriesId?.title || 'Series'}</td>
                      <td className="py-4.5 px-6">
                        {ep.contentFormat === 'short' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold text-[10px]">
                            Shorts (9:16)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px]">
                            Dài (16:9)
                          </span>
                        )}
                      </td>
                      <td className="py-4.5 px-6 font-bold">
                        {renderSourceBadge(ep.mediaSource)}
                      </td>
                      <td className="py-4.5 px-6">
                        {ep.status === 'published' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold">
                            <Check className="w-3 h-3" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200 text-[10px] font-bold">
                            <EyeOff className="w-3 h-3" />
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="py-4.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate(`/admin/podcasts/episodes/edit/${ep._id}`)}
                            className="p-2 text-gray-600 hover:text-brand-green hover:bg-brand-light/50 rounded-lg transition cursor-pointer"
                            title="Sửa tập Podcast"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(ep._id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Xóa tập Podcast"
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
