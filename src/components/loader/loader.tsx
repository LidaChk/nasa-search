import React from 'react';
import './loader.css';

const Loader: React.FC = () => {
  return (
    <div className="loader" aria-label="loading">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loader;
