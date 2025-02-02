import { Component } from 'react';
import './nothingFound.css';

class NothingFound extends Component {
  render() {
    return (
      <div className="error-container error-container__nothing">
        <div role="img" aria-hidden="true" className="error-emoji strong">
          (^-^*)
        </div>
        <div>Nothing was found</div>
      </div>
    );
  }
}

export default NothingFound;
