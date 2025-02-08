import './App.css';

import ErrorBoundary from './components/errorBoundary/errorBoundary';
import Search from './components/search/search';
import { LS_KEY_SEARCH_TERM } from './constants/constants';
import { PaginationInfo, searchResultItem } from './types/types';
import { searchImages } from './api/nasaApi';
import CardList from './components/cardList/cardList';
import ErrorCatchWrapper from './components/errorCatchWrapper/errorCatchWrapper';
import Pagination from './components/pagination/pagination';
import React, { useCallback, useEffect, useState, useTransition } from 'react';

const App: React.FC = () => {
  const [items, setItems] = useState<searchResultItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem(LS_KEY_SEARCH_TERM) || ''
  );
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page') || '1', 10);
    setPagination((prev) => ({ ...prev, currentPage: page }));
  }, []);

  const fetchImages = useCallback(
    async (searchTerm: string, page: number) => {
      try {
        setError(null);

        const response = await searchImages({
          query: searchTerm,
          page,
          pageSize: pagination.pageSize,
        });

        startTransition(() => {
          setItems(response.items);
          setPagination(response.pagination);
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      }
    },
    [pagination.pageSize, startTransition]
  );

  useEffect(() => {
    fetchImages(searchTerm, pagination.currentPage);
  }, [searchTerm, pagination.currentPage, fetchImages]);

  const onSearch = (newSearchTerm: string) => {
    localStorage.setItem(LS_KEY_SEARCH_TERM, newSearchTerm);
    setSearchTerm(newSearchTerm);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  return (
    <ErrorBoundary>
      <div className="app-header">
        <h1>NASA Image search</h1>
        <Search onSearch={onSearch} initialSearchTerm={searchTerm} />
      </div>
      <ErrorCatchWrapper error={error}>
        <div className="app-content">
          <CardList items={items} isLoading={isPending} />
        </div>
        {items.length > 0 && !isPending && (
          <div className="app-footer">
            <Pagination {...pagination} onPageChange={handlePageChange} />
          </div>
        )}
      </ErrorCatchWrapper>
    </ErrorBoundary>
  );
};

export default App;
