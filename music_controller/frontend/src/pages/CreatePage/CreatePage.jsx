import React, { Component } from 'react';
import { Grid, Header, Radio, Input, Button } from 'semantic-ui-react';
import api from '../../services/api';

const { Column } = Grid;

export default class CreatePage extends Component {
  defaultVotes = 2;

  state = {
    guestCanPause: false,
    votesToSkip: this.defaultVotes,
  };

  handleGuestCanPauseChange = (e, obj) => {
    this.setState({ guestCanPause: obj.checked });
  };

  handleVotesChange = (e, obj) => {
    this.setState({ votesToSkip: parseInt(obj.value) || 1 });
  };

  handleSubmit = async (e) => {
    const { guestCanPause, votesToSkip } = this.state

    const response = await api.post('/create-room/', {
      guest_can_pause: guestCanPause,
      votes_to_skip: votesToSkip
    });
  }

  render () {
    const { guestCanPause, votesToSkip } = this.state;

    return (
      <>
        <Header size="small" textAlign="center"
          style={{ marginTop: 30 }}
        >
          Create a Room
        </Header>

        <Grid>
          <Grid.Row>
            <Column width={8}>
              <Radio
                toggle
                onChange={this.handleGuestCanPauseChange}
                checked={guestCanPause}
                label="Allow play/pause"
              />
            </Column>
            <Column width={8}>
              <Input
                type="number"
                size="mini"
                fluid
                min={1}
                placeholder="Votes do skip the song"
                value={votesToSkip}
                onChange={this.handleVotesChange}
              />
              <label>Votes to skip</label>
            </Column>
          </Grid.Row>
          <Grid.Row columns={1} centered>
            <Column textAlign="center">
              <Button content="Create a Room" primary onClick={this.handleSubmit} />
            </Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }
}
