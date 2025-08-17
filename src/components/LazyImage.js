import React from 'react';
import useLazyLoad from '../hooks/useLazyLoad';

const LazyImage = ({ src, alt, className, onError, placeholder = '/placeholder-poster.jpg' }) => {
  const { ref, isInView, isLoaded, handleLoad } = useLazyLoad();

  return (
    <div ref={ref} className={`lazy-image-container ${className || ''}`}>
      {isInView && (
        <>
          <img
            src={src}
            alt={alt}
            className={`lazy-image ${isLoaded ? 'loaded' : 'loading'} ${className || ''}`}
            onLoad={handleLoad}
            onError={(e) => {
              e.target.src = placeholder;
              handleLoad();
              if (onError) onError(e);
            }}
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          />
          {!isLoaded && (
            <div className="lazy-image-skeleton">
              <div className="skeleton-poster"></div>
            </div>
          )}
        </>
      )}
      {!isInView && (
        <div className="lazy-image-skeleton">
          <div className="skeleton-poster"></div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;