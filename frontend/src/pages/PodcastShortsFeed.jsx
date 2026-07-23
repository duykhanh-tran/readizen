import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, Play, ChevronLeft, Tv } from 'lucide-react';
import api from '../services/axios.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import AdaptivePlayerEngine from '../components/podcast/AdaptivePlayerEngine.jsx';

export default function PodcastShortsFeed() {
  const navigate = useNavigate();
  const [shorts, setShorts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShorts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.get('/podcasts/shorts?limit=20');
        setShorts(res.data.shorts || []);
      } catch (err) {
        console.error('Lỗi khi tải danh sách Shorts:', err);
        setError('Không thể kết nối đến máy chủ.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShorts();
  }, []);

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans antialiased flex flex-col pt-20 lg:pt-24 text-left">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-6 w-full flex flex-col items-center">
        {/* Navigation back header */}
        <div className="w-full flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/podcasts')}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Quay lại Podcast Hub</span>
          </button>
          <span className="text-xs font-black text-brand-yellow uppercase tracking-widest flex items-center gap-1.5">
            <Tv className="w-4 h-4" /> Readizen Shorts Feed (9:16)
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-28">
            <Loader2 className="w-10 h-10 animate-spin text-brand-yellow" />
            <p className="mt-4 text-xs font-bold text-gray-400">Đang tải luồng Video Shorts...</p>
          </div>
        ) : error ? (
          <div className="max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center shadow-lg my-12">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-xs font-bold text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-brand-green hover:bg-brand-dark text-white rounded-full text-xs font-bold transition"
            >
              Thử lại
            </button>
          </div>
        ) : shorts.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-sm font-bold">Chưa có Video Shorts nào được xuất bản.</p>
          </div>
        ) : (
          <div className="w-full space-y-12 flex flex-col items-center">
            {shorts.map((short) => (
              <div key={short._id} className="w-full max-w-[340px] flex flex-col space-y-3">
                <AdaptivePlayerEngine
                  mediaSource={short.mediaSource}
                  videoUrl={short.videoUrl}
                  externalVideoId={short.externalVideoId}
                  aspectRatio="9:16"
                  thumbnail={short.thumbnailAsset?.assetUrl}
                  title={short.title}
                />

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-1 text-left">
                  <span className="text-[10px] font-black text-brand-yellow uppercase">
                    {short.seriesId?.title || 'Readizen Podcast'}
                  </span>
                  <h3 className="text-sm font-black text-white leading-snug">
                    {short.title}
                  </h3>
                  {short.summary && (
                    <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                      {short.summary}
                    </p>
                  )}
                  <Link
                    to={`/podcasts/${short.seriesId?.slug || 'readizen'}/${short.slug}`}
                    className="inline-block pt-2 text-[11px] font-bold text-brand-green hover:underline"
                  >
                    Xem chi tiết tập & Lời thoại →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
