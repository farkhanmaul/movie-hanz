import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorState = ({ 
  title = "Something went wrong", 
  message = "We couldn't load the content you requested.", 
  type = "general",
  onRetry = null 
}) => {
  const navigate = useNavigate();

  const getErrorIcon = () => {
    switch (type) {
      case 'movie':
        return '🎬';
      case 'tv':
        return '📺';
      case 'person':
        return '👤';
      case 'network':
        return '📡';
      default:
        return '⚠️';
    }
  };

  const getErrorImage = () => {
    return (
      <div className="error-icon-container">
        <div className="error-icon-circle">
          <span className="error-icon">{getErrorIcon()}</span>
        </div>
        <div className="error-icon-overlay"></div>
      </div>
    );
  };

  return (
    <div className="error-state-container">
      <div className="error-state-content">
        {getErrorImage()}
        
        <div className="error-text-content">
          <h1 className="error-title">{title}</h1>
          <p className="error-message">{message}</p>
          
          <div className="error-suggestions">
            <p className="error-suggestion-title">Here's what you can try:</p>
            <ul className="error-suggestion-list">
              <li>Check your internet connection</li>
              <li>Refresh the page or try again later</li>
              <li>Go back to browse other content</li>
            </ul>
          </div>
        </div>
        
        <div className="error-actions">
          {onRetry && (
            <button 
              className="error-action-btn retry-btn"
              onClick={onRetry}
            >
              🔄 Try Again
            </button>
          )}
          
          <button 
            className="error-action-btn back-btn"
            onClick={() => navigate(-1)}
          >
            ← Go Back
          </button>
          
          <button 
            className="error-action-btn home-btn"
            onClick={() => navigate('/')}
          >
            🏠 Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;