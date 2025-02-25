import React from 'react';
import './nothingFound.css';

interface NothingFoundProp {
  message?: string;
}

const NothingFound = ({
  message = 'Nothing was found',
}: NothingFoundProp): React.JSX.Element => {
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
