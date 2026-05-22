import React, { useState } from 'react';

const SafeImage = ({ 
  src, 
  alt, 
  className, 
  fallbackSrc = "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2098&auto=format&fit=crop" 
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className} 
      onError={handleError} 
    />
  );
};

export default SafeImage;
