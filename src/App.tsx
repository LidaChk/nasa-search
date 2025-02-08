import './App.css';
import React, { useCallback, useEffect, useState } from 'react';
import ErrorBoundary from './components/errorBoundary/errorBoundary';
import Search from './components/search/search';
import { LS_KEY_SEARCH_TERM } from './constants/constants';
import { PaginationInfo, searchResultItem } from './types/types';
import { searchImages } from './api/nasaApi';
import CardList from './components/cardList/cardList';
import ErrorCatchWrapper from './components/errorCatchWrapper/errorCatchWrapper';
import Pagination from './components/pagination/pagination';

const App: React.FC = () => {
  const [items, setItems] = useState<searchResultItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem(LS_KEY_SEARCH_TERM) || ''
  );
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });

  const fetchImages = useCallback(
    async (searchTerm: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await searchImages({
          query: searchTerm,
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
        });

        setItems(response.items);
        setPagination(response.pagination);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.pageSize, pagination.currentPage]
  );

  useEffect(() => {
    fetchImages(searchTerm);
  }, [searchTerm, pagination.currentPage, pagination.pageSize, fetchImages]);

  const onSearch = (newSearchTerm: string) => {
    localStorage.setItem(LS_KEY_SEARCH_TERM, newSearchTerm);
    setSearchTerm(newSearchTerm);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = useCallback(
    (page: number) => {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    },
    [setPagination]
  );

  return (
    <ErrorBoundary>
      <div className="app-header">
        <h1>NASA Image search</h1>
        <Search onSearch={onSearch} initialSearchTerm={searchTerm} />
      </div>
      <ErrorCatchWrapper error={error}>
        <div className="app-content">
          <CardList items={items} isLoading={isLoading} />
        </div>
        {items.length > 0 && !isLoading && pagination.totalPages > 1 && (
          <div className="app-footer">
            <Pagination {...pagination} onPageChange={handlePageChange} />
          </div>
        )}
      </ErrorCatchWrapper>
    </ErrorBoundary>
  );
};

export default App;
