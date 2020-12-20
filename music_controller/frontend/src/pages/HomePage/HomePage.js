import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import  { Container, Button } from 'semantic-ui-react';

export default class HomePage extends Component {
  render () {
    return (
      <Container>
        <h1>Menu</h1>
        <p>
          <Button as={Link} to="/join" primary>Logar numa sala</Button>
          <Button as={Link} to="/create" secondary>Criar uma página</Button>
        </p>
      </Container>
    )
  }
}