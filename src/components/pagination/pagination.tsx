import React from 'react';
import './pagination.css';
import { PaginationInfo } from '../../types/types';

interface PaginationProps extends PaginationInfo {
  onPageChange: (page: number) => void;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="pagination">
      <button
        className="pagination__button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Previous
      </button>
      <span className="pagination__info">
        Page&nbsp;
        <input
          type="text"
          value={currentPage}
          onChange={(event) => onPageChange(Number(event.target.value))}
        />
        &nbsp;of {totalPages}
      </span>
      <button
        className="pagination__button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
