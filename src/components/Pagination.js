import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, loading = false }) => {
  const maxVisiblePages = 5;
  
  // Calculate which pages to show
  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  
  const handlePageClick = (page) => {
    if (page !== currentPage && !loading && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className={`pagination-btn ${currentPage === 1 || loading ? 'disabled' : ''}`}
        onClick={() => handlePageClick(1)}
        disabled={currentPage === 1 || loading}
      >
        ««
      </button>
      
      <button
        className={`pagination-btn ${currentPage === 1 || loading ? 'disabled' : ''}`}
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1 || loading}
      >
        ‹
      </button>

      {visiblePages[0] > 1 && (
        <>
          <button
            className="pagination-btn"
            onClick={() => handlePageClick(1)}
            disabled={loading}
          >
            1
          </button>
          {visiblePages[0] > 2 && <span className="pagination-ellipsis">...</span>}
        </>
      )}

      {visiblePages.map(page => (
        <button
          key={page}
          className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
          onClick={() => handlePageClick(page)}
          disabled={loading}
        >
          {page}
        </button>
      ))}

      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="pagination-ellipsis">...</span>
          )}
          <button
            className="pagination-btn"
            onClick={() => handlePageClick(totalPages)}
            disabled={loading}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        className={`pagination-btn ${currentPage === totalPages || loading ? 'disabled' : ''}`}
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
      >
        ›
      </button>
      
      <button
        className={`pagination-btn ${currentPage === totalPages || loading ? 'disabled' : ''}`}
        onClick={() => handlePageClick(totalPages)}
        disabled={currentPage === totalPages || loading}
      >
        »»
      </button>

      <div className="pagination-info">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;