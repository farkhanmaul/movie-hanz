import React, { useState, useEffect } from 'react';
import { getMovieReleaseDates, getTVContentRatings } from '../api';

const ContentRatings = ({ contentId, contentType }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (contentId) {
      loadContentRatings();
    }
  }, [contentId, contentType]);

  const loadContentRatings = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (contentType === 'movie') {
        data = await getMovieReleaseDates(contentId);
        // Extract certifications from release dates
        const certifications = data.results?.map(release => ({
          country: release.iso_3166_1,
          certification: release.release_dates?.[0]?.certification || 'Not Rated',
          region: getCountryName(release.iso_3166_1)
        })).filter(cert => cert.certification && cert.certification !== '') || [];
        setRatings(certifications);
      } else {
        data = await getTVContentRatings(contentId);
        const certifications = data.results?.map(rating => ({
          country: rating.iso_3166_1,
          certification: rating.rating || 'Not Rated',
          region: getCountryName(rating.iso_3166_1)
        })) || [];
        setRatings(certifications);
      }
    } catch (err) {
      setError('Failed to load content ratings');
      console.error('Error loading content ratings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCountryName = (countryCode) => {
    const countries = {
      'US': 'United States',
      'GB': 'United Kingdom', 
      'CA': 'Canada',
      'AU': 'Australia',
      'DE': 'Germany',
      'FR': 'France',
      'JP': 'Japan',
      'KR': 'South Korea',
      'IN': 'India',
      'BR': 'Brazil',
      'ES': 'Spain',
      'IT': 'Italy',
      'NL': 'Netherlands',
      'SE': 'Sweden',
      'NO': 'Norway',
      'DK': 'Denmark',
      'FI': 'Finland',
      'PL': 'Poland',
      'RU': 'Russia',
      'CN': 'China',
      'HK': 'Hong Kong',
      'TW': 'Taiwan',
      'SG': 'Singapore',
      'MY': 'Malaysia',
      'TH': 'Thailand',
      'ID': 'Indonesia',
      'PH': 'Philippines',
      'VN': 'Vietnam',
      'MX': 'Mexico',
      'AR': 'Argentina',
      'CL': 'Chile',
      'CO': 'Colombia',
      'PE': 'Peru',
      'VE': 'Venezuela'
    };
    return countries[countryCode] || countryCode;
  };

  const getRatingInfo = (certification, country) => {
    // US Movie Ratings
    const usMovieRatings = {
      'G': {
        color: '#4ade80',
        description: 'General Audiences - All ages admitted',
        icon: '👶'
      },
      'PG': {
        color: '#fbbf24',
        description: 'Parental Guidance Suggested - Some material may not be suitable for children',
        icon: '👨‍👩‍👧‍👦'
      },
      'PG-13': {
        color: '#f97316',
        description: 'Parents Strongly Cautioned - Some material may be inappropriate for children under 13',
        icon: '⚠️'
      },
      'R': {
        color: '#ef4444',
        description: 'Restricted - Under 17 requires accompanying parent or adult guardian',
        icon: '🔞'
      },
      'NC-17': {
        color: '#dc2626',
        description: 'No One 17 & Under Admitted',
        icon: '🚫'
      }
    };

    // US TV Ratings
    const usTVRatings = {
      'TV-Y': {
        color: '#4ade80',
        description: 'All Children - Appropriate for all children',
        icon: '👶'
      },
      'TV-Y7': {
        color: '#22c55e',
        description: 'Directed to Older Children - Ages 7+',
        icon: '🧒'
      },
      'TV-G': {
        color: '#4ade80',
        description: 'General Audience - Suitable for all ages',
        icon: '👨‍👩‍👧‍👦'
      },
      'TV-PG': {
        color: '#fbbf24',
        description: 'Parental Guidance Suggested',
        icon: '⚠️'
      },
      'TV-14': {
        color: '#f97316',
        description: 'Parents Strongly Cautioned - Ages 14+',
        icon: '🔞'
      },
      'TV-MA': {
        color: '#ef4444',
        description: 'Mature Audience Only - Ages 17+',
        icon: '🔞'
      }
    };

    // International ratings
    const internationalRatings = {
      // UK
      'U': { color: '#4ade80', description: 'Universal - Suitable for all', icon: '👨‍👩‍👧‍👦' },
      'PG': { color: '#fbbf24', description: 'Parental Guidance', icon: '⚠️' },
      '12A': { color: '#f97316', description: 'Ages 12+ (with adult)', icon: '🔞' },
      '12': { color: '#f97316', description: 'Ages 12+', icon: '🔞' },
      '15': { color: '#ef4444', description: 'Ages 15+', icon: '🔞' },
      '18': { color: '#dc2626', description: 'Ages 18+', icon: '🔞' },
      
      // Germany
      'FSK 0': { color: '#4ade80', description: 'All ages', icon: '👨‍👩‍👧‍👦' },
      'FSK 6': { color: '#22c55e', description: 'Ages 6+', icon: '🧒' },
      'FSK 12': { color: '#f97316', description: 'Ages 12+', icon: '🔞' },
      'FSK 16': { color: '#ef4444', description: 'Ages 16+', icon: '🔞' },
      'FSK 18': { color: '#dc2626', description: 'Ages 18+', icon: '🔞' }
    };

    const allRatings = { ...usMovieRatings, ...usTVRatings, ...internationalRatings };
    
    return allRatings[certification] || {
      color: '#6b7280',
      description: `Content rating for ${country}`,
      icon: '📋'
    };
  };

  const getPriorityRatings = () => {
    if (ratings.length === 0) return [];

    // Priority order for countries
    const priorityOrder = ['US', 'GB', 'CA', 'AU', 'DE', 'FR'];
    const priorityRatings = [];
    const otherRatings = [];

    ratings.forEach(rating => {
      if (rating.certification && rating.certification !== 'Not Rated') {
        if (priorityOrder.includes(rating.country)) {
          priorityRatings.push(rating);
        } else {
          otherRatings.push(rating);
        }
      }
    });

    // Sort priority ratings by the priority order
    priorityRatings.sort((a, b) => {
      return priorityOrder.indexOf(a.country) - priorityOrder.indexOf(b.country);
    });

    return [...priorityRatings, ...otherRatings.slice(0, 6)]; // Limit to show max 10 total
  };

  if (loading) {
    return (
      <div className="content-ratings-section">
        <h3>Content Ratings</h3>
        <div className="loading-small">Loading ratings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-ratings-section">
        <h3>Content Ratings</h3>
        <div className="ratings-error">
          <p>{error}</p>
          <button onClick={loadContentRatings} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const displayRatings = getPriorityRatings();

  if (displayRatings.length === 0) {
    return (
      <div className="content-ratings-section">
        <h3>Content Ratings</h3>
        <div className="no-ratings">
          <p>No content ratings available for this {contentType}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-ratings-section">
      <h3>Content Ratings & Certifications</h3>
      <div className="ratings-grid">
        {displayRatings.map((rating, index) => {
          const ratingInfo = getRatingInfo(rating.certification, rating.country);
          return (
            <div key={`${rating.country}-${index}`} className="rating-card">
              <div className="rating-header">
                <div className="rating-country">
                  <span className="country-flag">
                    {rating.country === 'US' ? '🇺🇸' : 
                     rating.country === 'GB' ? '🇬🇧' :
                     rating.country === 'CA' ? '🇨🇦' :
                     rating.country === 'AU' ? '🇦🇺' :
                     rating.country === 'DE' ? '🇩🇪' :
                     rating.country === 'FR' ? '🇫🇷' :
                     rating.country === 'JP' ? '🇯🇵' :
                     rating.country === 'ID' ? '🇮🇩' :
                     '🌍'}
                  </span>
                  <span className="country-name">{rating.region}</span>
                </div>
                <div 
                  className="rating-badge"
                  style={{ 
                    backgroundColor: ratingInfo.color,
                    color: ratingInfo.color === '#fbbf24' ? '#000' : '#fff'
                  }}
                >
                  <span className="rating-icon">{ratingInfo.icon}</span>
                  <span className="rating-text">{rating.certification}</span>
                </div>
              </div>
              <div className="rating-description">
                {ratingInfo.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Parental Guidance Notice */}
      {displayRatings.some(r => ['PG-13', 'R', 'NC-17', 'TV-14', 'TV-MA', '15', '18'].includes(r.certification)) && (
        <div className="parental-notice">
          <div className="notice-icon">⚠️</div>
          <div className="notice-content">
            <h4>Parental Guidance</h4>
            <p>This {contentType} may contain content not suitable for younger audiences. Please check ratings and descriptions before viewing.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentRatings;