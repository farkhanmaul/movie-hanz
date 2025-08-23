import React from 'react';

const TrailerModal = ({ trailerVideo, isOpen, onClose }) => {
  if (!isOpen || !trailerVideo) return null;

  return (
    <div className="trailer-modal-overlay" onClick={onClose}>
      <div className="trailer-modal" onClick={(e) => e.stopPropagation()}>
        <button className="trailer-close-btn" onClick={onClose}>×</button>
        <iframe
          src={`https://www.youtube.com/embed/${trailerVideo.key}?autoplay=1&rel=0&modestbranding=1`}
          title="Trailer"
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="trailer-iframe"
        />
      </div>
    </div>
  );
};

export default TrailerModal;