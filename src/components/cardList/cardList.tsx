import React from 'react';
import './cardList.css';
import { searchResultItem } from '../../types/types';
import Loader from '../loader/loader';
import Card from '../card/card';
import NothingFound from '../nothingFound/nothingFound';

interface CardListProps {
  items: searchResultItem[];
  isLoading: boolean;
}

const CardList: React.FC<CardListProps> = ({ items, isLoading }) => {
  const className = `card-list${isLoading ? ' card-list__loader' : ''}`;

  return (
    <div className={className}>
      {isLoading ? (
        <Loader />
      ) : items.length === 0 ? (
        <NothingFound />
      ) : (
        items.map((item) => <Card key={item.nasaId} {...item} />)
      )}
    </div>
  );
};

export default CardList;
