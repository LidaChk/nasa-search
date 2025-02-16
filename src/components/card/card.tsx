import React from 'react';
import './card.css';
import { NavLink, useParams } from 'react-router';

interface CardProps {
  nasaId: string;
  title: string;
  description: string;
  preview: URL;
}

const Card = ({
  nasaId,
  title,
  description,
  preview,
}: CardProps): React.JSX.Element => {
  const { searchTerm, currentPage } = useParams();

  return (
    <NavLink
      to={`/search/${searchTerm}/${currentPage}/details/${nasaId}`}
      className="card"
      key={nasaId}
    >
      <div className="card__image-container">
        <img src={preview.href} alt={title} className="card__image" />
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
