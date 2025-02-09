import React, { useState } from 'react';
import './search.css';
import { useNavigate, useParams } from 'react-router';
import useLocalStorage from '../../hooks/useLocalStorage';
import { LS_KEY_SEARCH_TERM } from '../../constants/constants';

const Search: React.FC = () => {
  const { searchTerm = '' } = useParams<{
    searchTerm: string;
  }>();

  const [searchTermLS, setSearchTermLS] = useLocalStorage(
    LS_KEY_SEARCH_TERM,
    ''
  );

  const [inputValue, setInputValue] = useState(searchTerm);

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedSearchTerm = inputValue.trim();
    if (trimmedSearchTerm !== searchTermLS) {
      setSearchTermLS(trimmedSearchTerm);
    }
    navigate(`/${trimmedSearchTerm}/1`);
  };

  return (
    <form onSubmit={handleSearch} className="search-form" aria-label="search">
      <input
        type="search"
        className="search-input"
        placeholder="Search..."
        value={inputValue}
        onChange={handleInputChange}
      />
      <button className="search-button">Search</button>
    </form>
  );
};

export default Search;
