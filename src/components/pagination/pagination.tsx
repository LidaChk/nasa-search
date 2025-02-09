import React, { useCallback } from 'react';

import './pagination.css';
import { useNavigate, useParams } from 'react-router';

interface PaginationProps {
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages }) => {
  const { searchTerm = '', currentPage = '1' } = useParams<{
    searchTerm: string;
    currentPage: string;
  }>();

  const navigate = useNavigate();

  const onPageChange = useCallback(
    (page: number) => {
      navigate(`/search/${searchTerm}/${page}`);
    },
    [navigate, searchTerm]
  );

  const numCurrentPage = parseInt(currentPage, 10);
  return (
    <div className="pagination">
      <button
        className="pagination__button"
        onClick={() => onPageChange(numCurrentPage - 1)}
        disabled={numCurrentPage <= 1}
      >
        Previous
      </button>
      <span className="pagination__info">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="pagination__button"
        onClick={() => onPageChange(numCurrentPage + 1)}
        disabled={numCurrentPage >= totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
