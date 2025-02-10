import React from 'react';
import './nothingFound.css';

interface NothingFoundProp {
  message?: string;
}

const NothingFound: React.FC<NothingFoundProp> = ({
  message = 'Nothing was found',
}) => {
  return (
    <div
      className="error-container error-container__nothing"
      data-testid="nothing-found"
    >
      <div role="img" aria-hidden="true" className="error-emoji strong">
        (^-^*)
      </div>
      <div>{message}</div>
    </div>
  );
};

export default NothingFound;
