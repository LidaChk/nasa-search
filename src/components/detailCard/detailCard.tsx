import React from 'react';
import { Link, useSearchParams } from 'react-router';
import { useGetImageDetailsQuery } from '../../store/nasaApi/nasaApi';
import Loader from '../loader/loader';
import './detailCard.css';

const DetailCard = (): React.JSX.Element => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q');
  const currentPage = searchParams.get('page') || '1';
  const nasaId = searchParams.get('details');

  const {
    data: item,
    isFetching,
    error,
  } = useGetImageDetailsQuery(nasaId ?? '', {
    skip: !nasaId,
  });

  if (error) {
    let errorMessage = 'An error occurred';
    if ('data' in error) {
      errorMessage =
        'error' in error ? error.error : JSON.stringify(error.data);
    }
    throw new Error(errorMessage);
  }

  return (
    <div
      className={`detail-item ${
        isFetching ? 'detail-item--loader' : 'detail-item--card'
      }`}
    >
      {isFetching ? (
        <Loader />
      ) : (
        item && (
          <>
            <div className="detail-item__image-container">
              <img
                src={item.href}
                alt={item.title}
                className="detail-item__image"
                loading="eager"
              />
            </div>
            <div className="detail-item__content detail-item__content--card">
              <h2 className="detail-item__name">{item.title}</h2>
              {item.keywords && item.keywords.length > 0 && (
                <ul className="detail-item__keywords">
                  {item.keywords.map((keyword) => (
                    <li key={keyword} className="detail-item__keyword">
                      {keyword}
                    </li>
                  ))}
                </ul>
              )}
              <div
                className="detail-item__description detail-item__description--card"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
              <div className="detail-item__description detail-item__description--card">
                <p>
                  <span className="accent">Date Created:</span>{' '}
                  {new Date(item.dateCreated).toLocaleDateString()}
                </p>
                <p>
                  <span className="accent">NASA ID:</span> {item.nasaId}
                </p>
              </div>
            </div>
            <Link
              to={`/search?q=${searchTerm}&page=${currentPage}`}
              className="close-button"
            >
              <h3>x</h3>
            </Link>
          </>
        )
      )}
    </div>
  );
};

export default DetailCard;
