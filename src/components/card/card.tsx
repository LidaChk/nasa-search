import React from 'react';
import './card.css';

interface CardProps {
  nasaId: string;
  title: string;
  description: string;
  preview: URL;
}

const Card: React.FC<CardProps> = ({ nasaId, title, description, preview }) => {
  return (
    <div className="card" key={nasaId}>
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
    </div>
  );
};

export default Card;
