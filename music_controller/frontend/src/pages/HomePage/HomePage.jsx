import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { Container, Button, Icon } from 'semantic-ui-react';

import api from '@/services/api';

export default class HomePage extends Component {
  state = {
    roomCode: null
  }

  async componentDidMount () {
    const res = await api.get('user-in-room/')

    this.setState({ roomCode: res.data.code })
  }

  render () {
    const { roomCode } = this.state

    return (
      roomCode ? <Redirect to={`room/${roomCode}`} /> :
        <Container>
          <h1>Menu </h1>
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