import React from 'react';
import ErrorBoundary from './components/errorBoundary/errorBoundary';
import './App.css';
import MainPage from './components/mainPage/mainPage';
import { Navigate, Route, Routes } from 'react-router';
import { EMPTY_SEARCH, LS_KEY_SEARCH_TERM } from './constants/constants';
import useLocalStorage from './hooks/useLocalStorage';
import DetailCard from './components/detailCard/detailCard';
import NothingFound from './components/nothingFound/nothingFound';

const DEFAULT_PAGE = '1';

const App: React.FC = () => {
  const [searchTermFromLS] = useLocalStorage(LS_KEY_SEARCH_TERM, '');

  return (
    <ErrorBoundary>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={`/search/${searchTermFromLS || EMPTY_SEARCH}/${DEFAULT_PAGE}`}
              replace
            />
          }
        />
        <Route path="search/:searchTerm/:currentPage" element={<MainPage />}>
          <Route path="details/:nasaId" element={<DetailCard />} />
        </Route>
        <Route path="*" element={<NothingFound message="404" />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
