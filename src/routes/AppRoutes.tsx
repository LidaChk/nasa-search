import React from 'react';
import { Route, Routes, Navigate } from 'react-router';
import MainPage from '../components/mainPage/mainPage';
import DetailCard from '../components/detailCard/detailCard';
import NothingFound from '../components/nothingFound/nothingFound';
import { EMPTY_SEARCH, LS_KEY_SEARCH_TERM } from '../constants/constants';
import useLocalStorage from '../hooks/useLocalStorage';

const DEFAULT_PAGE = '1';

export const AppRoutes = (): React.JSX.Element => {
  const [searchTermFromLS] = useLocalStorage(LS_KEY_SEARCH_TERM, '');

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={`/search?q=${searchTermFromLS || EMPTY_SEARCH}&page=${DEFAULT_PAGE}`}
            replace
          />
        }
      />
      <Route path="/search" element={<MainPage />}>
        <Route path="details" element={<DetailCard />} />
      </Route>
      <Route path="*" element={<NothingFound message="404" />} />
    </Routes>
  );
};
