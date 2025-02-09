import React, { useCallback, useEffect, useState } from 'react';
import { PaginationInfo, searchResultItem } from '../../types/types';
import { LS_KEY_SEARCH_TERM } from '../../constants/constants';
import { searchImages } from '../../api/nasaApi';
import Search from '../search/search';
import ErrorCatchWrapper from '../errorCatchWrapper/errorCatchWrapper';
import CardList from '../cardList/cardList';
import Pagination from '../pagination/pagination';

const MainPage: React.FC = () => {
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

  const onSearch = useCallback((newSearchTerm: string) => {
    localStorage.setItem(LS_KEY_SEARCH_TERM, newSearchTerm);
    setSearchTerm(newSearchTerm);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  }, []);

  useEffect(() => {
    fetchImages(searchTerm);
  }, [searchTerm, pagination.currentPage, pagination.pageSize, fetchImages]);

  return (
    <>
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
    </>
  );
};

export default MainPage;
