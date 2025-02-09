import React, { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { LS_KEY_SEARCH_TERM } from '../../constants/constants';
import Search from '../search/search';
import CardList from '../cardList/cardList';
import useLocalStorage from '../../hooks/useLocalStorage';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTermLS, setSearchTermLS] = useLocalStorage(
    LS_KEY_SEARCH_TERM,
    ''
  );

  const onSearch = useCallback(
    (newSearchTerm: string) => {
      setSearchTermLS(newSearchTerm);
      navigate(`/${newSearchTerm}/1`);
    },
    [navigate, setSearchTermLS]
  );

  return (
    <>
      <div className="app-header">
        <h1>NASA Image search</h1>
        <Search onSearch={onSearch} initialSearchTerm={searchTermLS} />
      </div>
      <CardList />
    </>
  );
};

export default MainPage;
