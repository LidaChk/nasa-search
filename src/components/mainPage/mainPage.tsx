import React from 'react';
import { Outlet, useSearchParams } from 'react-router';
import CardList from '../cardList/cardList';
import Flyout from '../flyout/flyout';
import './mainPage.css';
import Search from '../search/search';

const MainPage = (): React.JSX.Element => {
  const [searchParams] = useSearchParams();
  const nasaId = searchParams.get('details');

  return (
    <div
      className={`main-page-container ${nasaId ? 'main-page-container__detail' : ''}`}
    >
      <div className={`app-header ${nasaId ? 'app-header__detail' : ''}`}>
        <h1>NASA Image search</h1>
        <Search />
      </div>
      <div className={`main-page ${nasaId ? 'main-page__detail' : ''}`}>
        <CardList />
        <Flyout />
      </div>
      {nasaId && (
        <div className="details-section">
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default MainPage;
