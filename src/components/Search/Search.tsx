import React, { useState } from 'react';
import './search.css';

interface SearchProps {
  onSearch: (searchTerm: string) => void;
  initialSearchTerm: string;
}

const Search: React.FC<SearchProps> = ({ onSearch, initialSearchTerm }) => {
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    onSearch(trimmedSearchTerm);
  };

  return (
    <form onSubmit={handleSearch} className="search-form" aria-label="search">
      <input
        type="search"
        className="search-input"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button className="search-button">Search</button>
    </form>
  );
};

export default Search;
