import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from '../routes';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <div class="app">
          <h1>Application</h1>

          <div className="app__container">
            <Routes />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
