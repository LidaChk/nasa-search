import React from 'react';
import ErrorBoundary from './components/errorBoundary/errorBoundary';
import './App.css';
import MainPage from './components/mainPage/mainPage';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      {/* routing */}
      <MainPage />
    </ErrorBoundary>
  );
};

export default App;
