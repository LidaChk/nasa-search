import { Component } from 'react';
import './loader.css';

class Loader extends Component {
  render() {
    return (
      <div className="loader" aria-label="loading">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  }
}

export default Loader;
