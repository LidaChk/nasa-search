import React, { useCallback } from 'react';

import './pagination.css';
import { useNavigate, useSearchParams } from 'react-router';

interface PaginationProps {
  totalPages: number;
}

const Pagination = ({ totalPages }: PaginationProps): React.JSX.Element => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';
  const currentPage = searchParams.get('page') || '1';

  const navigate = useNavigate();

  const onPageChange = useCallback(
    (page: number) => {
      navigate(`/search?q=${searchTerm}&page=${page}`);
    },
    [navigate, searchTerm]
  );

  const numCurrentPage = parseInt(currentPage, 10);
  return (
    <div className="pagination" data-testid="pagination">
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
