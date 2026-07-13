import React, { useState, useEffect } from 'react';

export function optimizeCloudinaryUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    if (!url.includes('f_auto') && !url.includes('q_auto')) {
      return url.replace('/upload/', '/upload/f_auto,q_auto/');
    }
  }
  return url;
}

const SafeImage = ({ 
  src, 
  alt, 
  className, 
  width,
  height,
  loading = "lazy",
  fetchPriority,
  fallbackSrc = "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2098&auto=format&fit=crop",
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img 
      src={optimizeCloudinaryUrl(imgSrc)} 
      alt={alt} 
      className={className} 
      width={width}
      height={height}
      loading={loading}
      fetchPriority={fetchPriority}
      onError={handleError} 
      {...rest}
    />
  );
};

export default SafeImage;
