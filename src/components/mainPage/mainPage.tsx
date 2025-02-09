import React from 'react';
import { Outlet, useNavigate, useParams } from 'react-router';
import Search from '../search/search';
import CardList from '../cardList/cardList';
import './mainPage.css';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const { searchTerm, currentPage, nasaId } = useParams<{
    searchTerm: string;
    currentPage: string;
    nasaId?: string;
  }>();

  const handleContainerClick = (e: React.MouseEvent) => {
    if (nasaId && !e.defaultPrevented) {
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
