import React from 'react';
import './nothingFound.css';

const NothingFound: React.FC = () => {
  return (
    <div className="error-container error-container__nothing">
      <div role="img" aria-hidden="true" className="error-emoji strong">
        (^-^*)
      </div>
      <div>Nothing was found</div>
    </div>
  );
};

export default NothingFound;
