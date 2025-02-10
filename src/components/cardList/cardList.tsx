import React, { useEffect, useState } from 'react';
import Loader from '../loader/loader';
import NothingFound from '../nothingFound/nothingFound';
import Pagination from '../pagination/pagination';
import { searchImages } from '../../api/nasaApi';
import { PaginationInfo, SearchResultItem } from '../../types/types';
import { EMPTY_SEARCH, PAGE_SIZE } from '../../constants/constants';
import Card from '../card/card';
import { useParams } from 'react-router';

import './cardList.css';

const CardList: React.FC = () => {
  const { searchTerm = '', currentPage = '1' } = useParams<{
    searchTerm: string;
    currentPage: string;
    nasaId?: string;
  }>();

  const [items, setItems] = useState<SearchResultItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: parseInt(currentPage, PAGE_SIZE),
    totalPages: 1,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await searchImages({
          query: searchTerm === EMPTY_SEARCH ? '' : searchTerm,
          page: parseInt(currentPage, 10),
          pageSize: pagination.pageSize,
        });

        setItems(response.items);
        setPagination(response.pagination);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    setPagination((prev) => ({
      ...prev,
      currentPage: parseInt(currentPage, 10),
    }));

    fetchImages();
  }, [searchTerm, currentPage, pagination.pageSize]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const className = `card-list ${isLoading ? 'card-list__loader' : 'card-list__scrolled'}`;

  return (
    <>
      <div className={className}>
        {isLoading ? (
          <Loader />
        ) : items.length === 0 ? (
          <NothingFound />
        ) : (
          items.map((item) => <Card key={item.nasaId} {...item} />)
        )}
      </div>
      {items.length > 0 && !isLoading && pagination.totalPages > 1 && (
        <div className="pagination-container">
          <Pagination totalPages={pagination.totalPages} />
        </div>
      )}
    </>
  );
};

export default CardList;
