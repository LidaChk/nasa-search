import React from 'react';
import ErrorBoundary from './components/errorBoundary/errorBoundary';
import './App.css';
import { AppRoutes } from './routes/AppRoutes';

const App: () => React.JSX.Element = () => {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
};

export default App;
