import React from 'react';

export default function CustomVideoPlayer({ videoType, videoUrl, thumbnail, aspectRatio = '16:9' }) {
  // Helper to extract YouTube video ID and construct an embed URL
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`;
    }
    return url;
  };

  // Helper to extract TikTok video ID and construct an embed URL
  const getTiktokEmbedUrl = (url) => {
    if (!url) return '';
    const match = url.match(/\/video\/(\d+)/);
    if (match && match[1]) {
      return `https://www.tiktok.com/embed/v2/${match[1]}`;
    }
    if (url.includes('/embed/')) {
      return url;
    }
    return url;
  };

  const isPortrait = aspectRatio === '9:16';

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/5 transition-all duration-300
      ${isPortrait 
        ? 'aspect-[9/16] max-w-[340px] max-h-[75vh]' 
        : 'aspect-video max-w-4xl'
      }`}
    >
      {videoType === 'youtube' && (
        <iframe
          src={getYoutubeEmbedUrl(videoUrl)}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      )}

      {videoType === 'tiktok' && (
        <iframe
          src={getTiktokEmbedUrl(videoUrl)}
          title="TikTok video player"
          frameBorder="0"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      )}

      {videoType === 'upload' && (
        <video
          src={videoUrl}
          controls
          controlsList="nodownload"
          poster={thumbnail}
          className="absolute inset-0 w-full h-full object-contain"
        >
          Trình duyệt của bạn không hỗ trợ thẻ video HTML5.
        </video>
      )}

      {!['youtube', 'tiktok', 'upload'].includes(videoType) && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium p-6 text-center">
          Nguồn phát video không hợp lệ hoặc không được hỗ trợ.
        </div>
      )}
    </div>
  );
}
