import React, { useCallback, useEffect, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';

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
  const [inputValue, setInputValue] = useState<string>(currentPage.toString());
  const [inputWidth, setInputWidth] = useState<number>(
    currentPage.toString().length
  );

  const debouncedInputValue = useDebounce(inputValue, 1000);

  const onPageChange = useCallback(
    (page: number) => {
      navigate(`/${searchTerm}/${page}`);
    },
    [navigate, searchTerm]
  );

  useEffect(() => {
    const numValue = parseInt(debouncedInputValue);
    onPageChange(numValue);
  }, [debouncedInputValue, onPageChange, totalPages]);

  useEffect(() => {
    setInputValue(currentPage.toString());
    setInputWidth(currentPage.toString().length);
  }, [currentPage]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0 && numValue <= totalPages) {
      setInputWidth(value.length);
      setInputValue(value);
    }
  };

  const inputStyle = { width: `${inputWidth < 1 ? 3 : inputWidth + 2}em` };

  const numCurrentPage = parseInt(currentPage);
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
        Page&nbsp;
        <input
          type="number"
          value={inputValue}
          onChange={handleInput}
          style={inputStyle}
          min={1}
          max={totalPages}
        />
        &nbsp;of {totalPages}
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
