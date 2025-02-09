import React from 'react';
import ErrorBoundary from './components/errorBoundary/errorBoundary';
import './App.css';
import MainPage from './components/mainPage/mainPage';
import { Navigate, Route, Routes } from 'react-router';
import { LS_KEY_SEARCH_TERM } from './constants/constants';
import useLocalStorage from './hooks/useLocalStorage';

const DEFAULT_PAGE = '1';

const App: React.FC = () => {
  const [searchTermFromLS] = useLocalStorage(LS_KEY_SEARCH_TERM, '');

  return (
    <ErrorBoundary>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={`/${searchTermFromLS}/${DEFAULT_PAGE}`} replace />
          }
        />
        <Route path="/:searchTerm/:currentPage" element={<MainPage />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
