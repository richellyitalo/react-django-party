import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class HomePage extends Component {
  render () {
    return (
      <div>
        <h1>Menu</h1>
        <p>
          <Link to="/join">Ir para Join</Link>
          <br/>
          <Link to="/create">Ir para Create</Link>
        </p>
      </div>
    )
  }
}