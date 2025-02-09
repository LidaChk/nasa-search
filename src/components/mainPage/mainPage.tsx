import React from 'react';

import Search from '../search/search';
import CardList from '../cardList/cardList';

const MainPage: React.FC = () => {
  return (
    <>
      <div className="app-header">
        <h1>NASA Image search</h1>
        <Search />
      </div>
      <CardList />
    </>
  );
};

export default MainPage;
