import React from 'react';
import { Outlet, useNavigate, useParams } from 'react-router';
import CardList from '../cardList/cardList';
import './mainPage.css';
import Search from '../search/search';

const MainPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { searchTerm, currentPage, nasaId } = useParams<{
    searchTerm: string;
    currentPage: string;
    nasaId?: string;
  }>();

  const handleContainerClick = () => {
    if (nasaId) {
      navigate(`/search/${searchTerm}/${currentPage}`);
    }
  };

  return (
    <div
      className={`main-page-container ${nasaId ? 'main-page-container__detail' : ''}`}
      onClick={handleContainerClick}
    >
      <div className={`app-header ${nasaId ? 'app-header__detail' : ''}`}>
        <h1>NASA Image search</h1>
        <Search />
      </div>
      <div className={`main-page ${nasaId ? 'main-page__detail' : ''}`}>
        <CardList />
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
