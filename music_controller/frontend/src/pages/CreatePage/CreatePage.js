import React, { Component } from 'react';
import { Grid, Header, Radio } from 'semantic-ui-react';

const { Column } = Grid;

export default class CreatePage extends Component {
  defaultVotes = 2;

  state = {
    guestCanPause: false,
    votesToSkip: this.defaultVotes,
  };

  handleGuestCanPauseChange = (e, obj) => {
    this.setState({ guestCanPause: obj.checked})
  }

  render() {
    const { guestCanPause } = this.state;

    return (
      <>
        <Header size="small" textAlign="center">
          Create a Room
        </Header>

        <Radio
          toggle
          onChange={this.handleGuestCanPauseChange}
          checked={guestCanPause}
        />
      </>
    );
  }
}
