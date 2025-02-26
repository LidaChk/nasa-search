import React from 'react';
import { Route, Routes, Navigate } from 'react-router';
import MainPage from '../components/mainPage/mainPage';
import DetailCard from '../components/detailCard/detailCard';
import NothingFound from '../components/nothingFound/nothingFound';
import { LS_KEY_SEARCH_TERM } from '../constants/constants';
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
            to={`/search?q=${searchTermFromLS}&page=${DEFAULT_PAGE}`}
            replace
          />
        }
      />
      <Route path="/search" element={<MainPage />}>
        <Route path="" element={<DetailCard />} />
      </Route>
      <Route path="*" element={<NothingFound message="404" />} />
    </Routes>
  );
};
