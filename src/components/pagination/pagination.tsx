import React, { useCallback, useEffect, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';

import './pagination.css';
import { useNavigate, useParams } from 'react-router';

interface PaginationProps {
  totalPages: number;
}

const defaultInputWidth = 3;

const Pagination: React.FC<PaginationProps> = ({ totalPages }) => {
  const {
    searchTerm = '',
    currentPage = '1',
    nasaId,
  } = useParams<{
    searchTerm: string;
    currentPage: string;
    nasaId?: string;
  }>();

  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState<string>(currentPage.toString());
  const [inputWidth, setInputWidth] = useState<number>(
    currentPage.toString().length
  );

  const debouncedInputValue = useDebounce(inputValue, 1000);

  const onPageChange = useCallback(
    (page: number) => {
      navigate(`/${searchTerm}/${page}${nasaId ? `/details/${nasaId}` : ''}`);
    },
    [navigate, searchTerm, nasaId]
  );

  useEffect(() => {
    if (!debouncedInputValue || debouncedInputValue === currentPage) {
      return;
    }
    const numValue = parseInt(debouncedInputValue, 10);
    onPageChange(numValue);
  }, [debouncedInputValue, onPageChange, currentPage]);

  useEffect(() => {
    setInputValue(currentPage.toString());
    setInputWidth(currentPage.toString().length);
  }, [currentPage]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0 && numValue <= totalPages) {
      setInputWidth(value.length);
      setInputValue(value);
    }
  };

  const inputStyle = {
    width: `${inputWidth < 1 ? defaultInputWidth : inputWidth + 2}em`,
  };

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
        Page{' '}
        <input
          type="number"
          value={inputValue}
          onChange={handleInput}
          style={inputStyle}
          min={1}
          max={totalPages}
        />{' '}
        of {totalPages}
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
