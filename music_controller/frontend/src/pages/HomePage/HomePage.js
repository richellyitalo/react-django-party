import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class HomePage extends Component {
  render () {
    return (
      <div>
        <h1>Home page.</h1>
        <p>
          <Link to="/join">Ir para Join</Link>
        </p>
      </div>
    )
  }
}