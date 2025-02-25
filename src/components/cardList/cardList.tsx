import React from 'react';
import Loader from '../loader/loader';
import NothingFound from '../nothingFound/nothingFound';
import Pagination from '../pagination/pagination';
import Card from '../card/card';
import { useSearchParams } from 'react-router';
import { useSearchImagesQuery } from '../../store/nasaApi/nasaApi';

import './cardList.css';

const CardList = (): React.JSX.Element => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q');
  const currentPage = searchParams.get('page') || '1';

  const { data, isFetching, isError, error } = useSearchImagesQuery({
    query: searchTerm ?? '',
    page: parseInt(currentPage, 10),
  });

  if (isError) {
    let errorMessage = 'An error occurred';
    if (error && 'data' in error) {
      errorMessage =
        'error' in error ? error.error : JSON.stringify(error.data);
    }
    return <NothingFound message={errorMessage} />;
  }

  const className = `card-list ${isFetching ? 'card-list__loader' : 'card-list__scrolled'}`;

  const shouldShowPagination =
    data &&
    data.items.length > 0 &&
    !isFetching &&
    data.pagination.totalPages > 1;

  return (
    <>
      <div className={className}>
        {isFetching ? (
          <Loader />
        ) : data?.items.length === 0 ? (
          <NothingFound />
        ) : (
          data?.items.map((item) => <Card key={item.nasaId} {...item} />)
        )}
      </div>
      {shouldShowPagination && (
        <div className="pagination-container">
          <Pagination totalPages={data.pagination.totalPages} />
        </div>
      )}
    </>
  );
};

export default CardList;
