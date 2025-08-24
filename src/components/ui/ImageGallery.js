import React, { useState, useEffect } from 'react';

const ImageGallery = ({ 
  images = [], 
  title = "Images", 
  type = "mixed", // "posters", "backdrops", "stills", "profiles", "mixed"
  showTabs = true,
  maxDisplay = 20,
  onImageClick 
}) => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Organize images by type
  const organizedImages = {
    all: images.slice(0, maxDisplay),
    posters: images.filter(img => img.aspect_ratio && img.aspect_ratio < 1).slice(0, maxDisplay),
    backdrops: images.filter(img => img.aspect_ratio && img.aspect_ratio > 1).slice(0, maxDisplay),
    stills: images.filter(img => img.file_path && !img.aspect_ratio).slice(0, maxDisplay),
    profiles: images.filter(img => img.file_path).slice(0, maxDisplay)
  };

  // Get current images to display
  const currentImages = organizedImages[selectedTab] || organizedImages.all;

  // Tab configuration
  const tabs = [
    { key: 'all', label: 'All', count: organizedImages.all.length },
    { key: 'posters', label: 'Posters', count: organizedImages.posters.length },
    { key: 'backdrops', label: 'Backdrops', count: organizedImages.backdrops.length },
    { key: 'stills', label: 'Stills', count: organizedImages.stills.length }
  ];

  const handleImageClick = (image, index) => {
    if (onImageClick) {
      onImageClick(image, index);
    } else {
      setSelectedImage(image);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  const getImageUrl = (filePath, size = 'w500') => {
    return `https://image.tmdb.org/t/p/${size}${filePath}`;
  };

  const getImageAlt = (image, index) => {
    return `${title} ${index + 1}`;
  };

  if (!images || images.length === 0) {
    return (
      <div className="image-gallery-empty">
        <p>No images available</p>
      </div>
    );
  }

  return (
    <div className="image-gallery">
      <div className="image-gallery-header">
        <h3 className="image-gallery-title">{title}</h3>
        
        {showTabs && tabs.some(tab => tab.count > 0) && (
          <div className="image-gallery-tabs">
            {tabs.map(tab => (
              tab.count > 0 && (
                <button
                  key={tab.key}
                  className={`gallery-tab ${selectedTab === tab.key ? 'active' : ''}`}
                  onClick={() => setSelectedTab(tab.key)}
                >
                  {tab.label} ({tab.count})
                </button>
              )
            ))}
          </div>
        )}
      </div>

      <div className="image-gallery-grid">
        {currentImages.map((image, index) => (
          <div 
            key={index}
            className="gallery-image-container"
            onClick={() => handleImageClick(image, index)}
          >
            <img
              src={getImageUrl(image.file_path)}
              alt={getImageAlt(image, index)}
              className="gallery-image"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="gallery-image-overlay">
              <div className="gallery-image-info">
                <span className="image-resolution">
                  {image.width} × {image.height}
                </span>
                {image.vote_average > 0 && (
                  <span className="image-rating">
                    ⭐ {image.vote_average.toFixed(1)}
                  </span>
                )}
              </div>
              <button className="gallery-expand-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15 3h6v6l-2-2-4 4-1.5-1.5 4-4L15 3zM3 9h6l-2 2 4 4-1.5 1.5-4-4L3 15V9z"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {showModal && selectedImage && (
        <div className="image-modal-overlay" onClick={handleCloseModal}>
          <div className="image-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={handleCloseModal}>
              ×
            </button>
            <img
              src={getImageUrl(selectedImage.file_path, 'original')}
              alt={getImageAlt(selectedImage, 0)}
              className="image-modal-img"
            />
            <div className="image-modal-info">
              <div className="image-modal-details">
                <span>Resolution: {selectedImage.width} × {selectedImage.height}</span>
                {selectedImage.vote_average > 0 && (
                  <span>Rating: ⭐ {selectedImage.vote_average.toFixed(1)}</span>
                )}
                {selectedImage.iso_639_1 && (
                  <span>Language: {selectedImage.iso_639_1.toUpperCase()}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;