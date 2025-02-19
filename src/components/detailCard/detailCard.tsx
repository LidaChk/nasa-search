import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { SearchResultItem } from '../../types/types';
import { searchImages } from '../../store/nasaApi/nasaApi';
import Loader from '../loader/loader';
import './detailCard.css';

const DetailCard = (): React.JSX.Element => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q');
  const currentPage = searchParams.get('page') || '1';
  const nasaId = searchParams.get('details');

  const [item, setItem] = useState<SearchResultItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!nasaId) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await searchImages({ nasaId });
        if (response.items.length > 0) {
          setItem(response.items[0]);
        } else {
          setError('Not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'fetching data failed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [nasaId]);

  if (error) {
    throw new Error(error);
  }

  return (
    <div
      className={`detail-item ${isLoading ? 'detail-item--loader' : 'detail-item--card'}`}
    >
      {isLoading ? (
        <Loader />
      ) : (
        item && (
          <>
            <div className="detail-item__image-container">
              <img
                src={item.href.href}
                alt={item.title}
                className="detail-item__image"
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
