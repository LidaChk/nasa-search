import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { SearchResultItem } from '../../types/types';
import { searchImages } from '../../api/nasaApi';
import Loader from '../loader/loader';
import './detailCard.css';

const DetailCard: React.FC = () => {
  const { nasaId, searchTerm, currentPage } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<SearchResultItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!nasaId) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await searchImages({ nasaId });
        if (response.items.length > 0) {
          setItem(response.items[0]);
        } else {
          setError('Item not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [nasaId]);

  const handleClose = () => {
    navigate(`/${searchTerm}/${currentPage}`);
  };

  if (isLoading) {
    return (
      <div className="detail-card">
        <Loader />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="detail-card">
        <div className="error-container">
          <div className="error-message">{error || 'Item not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-card">
      <button className="detail-card__close" onClick={handleClose}>
        ×
      </button>
      <img
        src={item.href.href}
        alt={item.title}
        className="detail-card__image"
      />
      <div className="detail-card__content">
        <h2>{item.title}</h2>
        <p dangerouslySetInnerHTML={{ __html: item.description }}></p>
        <div className="detail-card__metadata">
          <p>
            <strong>Date:</strong>{' '}
            {new Date(item.dateCreated).toLocaleDateString()}
          </p>
          {item.keywords && item.keywords.length > 0 && (
            <>
              <strong>Keywords:</strong>
              <div className="detail-card__keywords">
                {item.keywords.map((keyword) => (
                  <span key={keyword} className="detail-card__keyword">
                    {keyword}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailCard;
