import './App.css';

import ErrorBoundary from './components/errorBoundary/errorBoundary';
import Search from './components/search/search';
import { LS_KEY_SEARCH_TERM } from './constants/constants';
import { searchResultItem } from './types/types';
import { searchImages } from './api/nasaApi';
import CardList from './components/cardList/cardList';
import ErrorCatchWrapper from './components/errorCatchWrapper/errorCatchWrapper';
import React, { useEffect, useState, useTransition } from 'react';

const App: React.FC = () => {
  const [items, setItems] = useState<searchResultItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem(LS_KEY_SEARCH_TERM) || ''
  );

  const [isPending, startTransition] = useTransition();

  const fetchImages = async (searchTerm: string) => {
    try {
      setError(null);

      const response = await searchImages({ query: searchTerm });

      startTransition(() => {
        setItems(response);
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  useEffect(() => {
    fetchImages(searchTerm);
  }, [searchTerm]);

  const onSearch = (newSearchTerm: string) => {
    localStorage.setItem(LS_KEY_SEARCH_TERM, newSearchTerm);
    setSearchTerm(newSearchTerm);
    fetchImages(newSearchTerm);
  };

  return (
    <ErrorBoundary>
      <h1>NASA Image search</h1>
      <ErrorCatchWrapper error={error}>
        <Search onSearch={onSearch} initialSearchTerm={searchTerm} />
        <CardList items={items} isLoading={isPending} />
        <div className="app"></div>
      </ErrorCatchWrapper>
    </ErrorBoundary>
  );
};

export default App;
