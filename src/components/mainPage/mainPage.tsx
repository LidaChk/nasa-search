import React, { useContext } from 'react';
import { Outlet, useSearchParams } from 'react-router';
import CardList from '../cardList/cardList';
import Flyout from '../flyout/flyout';
import './mainPage.css';
import Search from '../search/search';
import { ThemeContext } from '../../contexts/themeContext';
import ThemeSwitch from '../themeSwitch/themeSwitch';

const MainPage = (): React.JSX.Element => {
  const [searchParams] = useSearchParams();
  const nasaId = searchParams.get('details');
  const { theme } = useContext(ThemeContext);

  return (
    <div
      data-theme={theme}
      className={`main-page-container ${nasaId ? 'main-page-container__detail' : ''}`}
    >
      <div className={`app-header ${nasaId ? 'app-header__detail' : ''}`}>
        <h1>NASA Image search</h1>
        <ThemeSwitch />
        <Search />
      </div>
      <div className={`main-page ${nasaId ? 'main-page__detail' : ''}`}>
        <CardList />
      </div>
      <Flyout />
      {nasaId && (
        <div className="details-section">
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default MainPage;
