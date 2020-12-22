import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import  { Container, Button, Icon } from 'semantic-ui-react';

export default class HomePage extends Component {
  render () {
    return (
      <Container>
        <h1>Menu</h1>
        <p>
          <Button as={Link} to="/join" primary>
            <Icon name="sign-in"></Icon>
            Logar numa sala
          </Button>
          <Button as={Link} to="/create" positive>
            <Icon name="sign-out"></Icon>
            Criar uma página
          </Button>
        </p>
      </Container>
    )
  }
}