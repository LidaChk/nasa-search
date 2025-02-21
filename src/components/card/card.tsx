import React from 'react';
import './card.css';
import { NavLink, useSearchParams } from 'react-router';
import CheckBox from '../checkbox/checkbox';

interface CardProps {
  nasaId: string;
  title: string;
  description: string;
  preview: string;
}

const Card = ({
  nasaId,
  title,
  description,
  preview,
}: CardProps): React.JSX.Element => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q');
  const currentPage = searchParams.get('page') || '1';

  return (
    <NavLink
      to={`/search?q=${searchTerm}&page=${currentPage}&details=${nasaId}`}
      className="card"
      key={nasaId}
    >
      <CheckBox nasaId={nasaId} />
      <div className="card__image-container">
        <img src={preview} alt={title} className="card__image" />
      </div>
      <div className="card__content">
        <h3 className="card__title">{title}</h3>
        <p
          className="card__description"
          dangerouslySetInnerHTML={{ __html: description }}
        ></p>
      </div>
    </NavLink>
  );
};

export default Card;
