import React, { useState, useEffect } from 'react';
import { Play, Loader2, Tv, Video } from 'lucide-react';

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" stroke="none">
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export default function AdaptivePlayerEngine({
  mediaSource = 'youtube',
  videoUrl = '',
  externalVideoId = '',
  aspectRatio = '16:9',
  thumbnail = '',
  title = '',
  onEnded = () => {}
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isPortrait = aspectRatio === '9:16';
  const aspectClass = isPortrait ? 'aspect-[9/16] max-w-[340px]' : 'aspect-video w-full';

  // Format YouTube embed URL securely using youtube-nocookie with enablejsapi=1
  const getYouTubeEmbedUrl = () => {
    let id = externalVideoId;
    if (!id && videoUrl) {
      const match = videoUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/);
      if (match && match[2].length === 11) id = match[2];
    }
    return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&enablejsapi=1` : null;
  };

  // Format TikTok embed URL
  const getTikTokEmbedUrl = () => {
    let id = externalVideoId;
    if (!id && videoUrl) {
      const match = videoUrl.match(/\/video\/(\d+)/);
      if (match) id = match[1];
    }
    return id ? `https://www.tiktok.com/embed/v2/${id}` : null;
  };

  // Listen to YouTube postMessage events for video completion (YT.PlayerState.ENDED = 0)
  useEffect(() => {
    if (!isPlaying || mediaSource !== 'youtube') return;

    const handleMessage = (event) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && (data.event === 'onStateChange' || data.info === 0)) {
          if (data.info === 0) { // 0 is YT.PlayerState.ENDED
            if (typeof onEnded === 'function') {
              onEnded();
            }
          }
        }
      } catch (err) {
        // Ignore non-json messages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isPlaying, mediaSource, onEnded]);

  const handlePlayClick = () => {
    setIsLoading(true);
    setIsPlaying(true);
  };

  const handleIframeLoad = (e) => {
    setIsLoading(false);
    try {
      if (e.target && e.target.contentWindow) {
        e.target.contentWindow.postMessage(JSON.stringify({ event: 'listening' }), '*');
      }
    } catch (err) {
      // Ignore iframe cross-origin postMessage errors
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-black shadow-lift mx-auto ${aspectClass}`}>
      {/* FAÇADE PATTERN COVER IMAGE & PLAY BUTTON */}
      {!isPlaying ? (
        <div className="absolute inset-0 group cursor-pointer" onClick={handlePlayClick}>
          {/* Thumbnail image */}
          <img
            src={thumbnail || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop'}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop';
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30 group-hover:bg-black/40 transition duration-300" />

          {/* Play Button */}
          <button
            type="button"
            className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-brand-green flex items-center justify-center shadow-2xl group-hover:scale-110 active:scale-95 transition-transform duration-300 transform-gpu cursor-pointer z-10"
            aria-label="Phát video bài học"
          >
            <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-current" />
          </button>

          {/* Media Source Badge */}
          <div className="absolute top-4 left-4 z-10">
            {mediaSource === 'youtube' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 text-white text-xs font-black backdrop-blur-md border border-white/10">
                <YoutubeIcon />
                YouTube
              </span>
            )}
            {mediaSource === 'tiktok' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 text-white text-xs font-black backdrop-blur-md border border-white/10">
                <Tv className="w-3.5 h-3.5" />
                TikTok
              </span>
            )}
            {mediaSource === 'upload' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/80 text-white text-xs font-black backdrop-blur-md border border-white/10">
                <Video className="w-3.5 h-3.5" />
                Direct Video
              </span>
            )}
          </div>
        </div>
      ) : (
        /* ACTIVE PLAYER HOST CONTAINER */
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center text-white">
              <Loader2 className="w-8 h-8 animate-spin text-brand-yellow" />
            </div>
          )}

          {/* 1. YOUTUBE IFRAME */}
          {mediaSource === 'youtube' && getYouTubeEmbedUrl() && (
            <iframe
              src={getYouTubeEmbedUrl()}
              title={title}
              onLoad={handleIframeLoad}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-none"
            />
          )}

          {/* 2. TIKTOK IFRAME */}
          {mediaSource === 'tiktok' && getTikTokEmbedUrl() && (
            <iframe
              src={getTikTokEmbedUrl()}
              title={title}
              onLoad={() => setIsLoading(false)}
              allow="fullscreen"
              className="w-full h-full border-none"
            />
          )}

          {/* 3. HTML5 DIRECT VIDEO PLAYER */}
          {mediaSource === 'upload' && videoUrl && (
            <video
              src={videoUrl}
              controls
              autoPlay
              onEnded={onEnded}
              onCanPlay={() => setIsLoading(false)}
              className="w-full h-full object-contain"
            >
              Trình duyệt của bạn không hỗ trợ phát video HTML5 trực tiếp.
            </video>
          )}
        </div>
      )}
    </div>
  );
}
