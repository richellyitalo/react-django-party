import React, { Component } from 'react';
import { Header, Grid, Input, Message, Button,  Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import api from '@/services/api';

const { Column } = Grid;

export default class JoinPage extends Component {
  state = {
    code: '',
    errors: '',
  };

  handleInputChange = (e, data) => {
    this.setState({ [data.name]: data.value });
  };

  handleSubmit = async () => {
    try {
      const res = await api.post('/join-room/', {
        code: this.state.code,
      });

      this.props.history.push(`/room/${this.state.code}`)
    } catch (error) {
      let errorMessage;
      if (error.response && error.response.status === 404) {
        errorMessage = 'Has been an unknown problem.';
      } else {
        errorMessage = error.response.data.detail;
      }

      this.setState({ errors: errorMessage });
    }
  };

  render() {
    const { code, errors } = this.state;

    return (
      <>
        <Header size="small" textAlign="center" style={{ marginTop: 30 }}>
          <Button
            negative
            as={Link}
            to="/"
          ><Icon name="long arrow alternate left"></Icon></Button>
          Join in a existing Room
        </Header>

        <Grid centered>
          <Grid.Row>
            <Column width={8}>
              <Input
                size="massive"
                fluid
                placeholder="Room Code"
                value={code}
                name="code"
                onChange={this.handleInputChange}
              />

              {errors && <Message error content={errors} />}
            </Column>
            <Column textAlign="center">
              <Button
                size="massive"
                content="Join"
                positive
                onClick={this.handleSubmit}
              />
            </Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }
}
