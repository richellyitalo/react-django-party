import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import Routes from '../routes';
import 'semantic-ui-css/semantic.min.css'
import './App.scss';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <div className="app__container">
            <Grid centered>
              <Grid.Column width={8}>
                <Routes />
              </Grid.Column>
            </Grid>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
