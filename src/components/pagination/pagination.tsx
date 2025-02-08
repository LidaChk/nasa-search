import React, { useEffect, useState } from 'react';
import { PaginationInfo } from '../../types/types';
import useDebounce from '../../hooks/useDebounce';

import './pagination.css';

interface PaginationProps extends PaginationInfo {
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [inputValue, setInputValue] = useState<string>(currentPage.toString());
  const [inputWidth, setInputWidth] = useState<number>(
    currentPage.toString().length
  );

  const debouncedInputValue = useDebounce(inputValue, 1000);

  useEffect(() => {
    const numValue = Number(debouncedInputValue);
    onPageChange(numValue);
  }, [debouncedInputValue, onPageChange, totalPages]);

  useEffect(() => {
    setInputValue(currentPage.toString());
    setInputWidth(currentPage.toString().length);
  }, [currentPage]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue > 0 && numValue <= totalPages) {
      setInputWidth(value.length);
      setInputValue(value);
    }
  };

  const inputStyle = { width: `${inputWidth < 1 ? 3 : inputWidth + 2}em` };

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
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
