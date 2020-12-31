import React, { Component } from 'react';
import { Grid, Card, Label, Button, Icon } from 'semantic-ui-react';
import Loader from '@/components/Loader/Loader';
import api from '@/services/api';

export default class RoomView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roomCode: props.match.params.roomCode,
      guestCanPause: null,
      isHost: null,
      votesToSkip: null,
      loading: true
    };
  }

  componentDidMount () {
    this.getRoom()
  }

  getRoom = async (e) => {
    try {
      const { data } = await api.get('/get-room/', {
        params: {
          code: this.state.roomCode
        }
      });

      this.setState({
        guestCanPause: data.guest_can_pause,
        isHost: data.is_host,
        votesToSkip: data.votes_to_skip
      })
    } catch (err) {
      this.props.history.push('/');
    } finally {
      this.setState({ loading: false })
    }
  }

  handleLeaveClick = async () => {
    await api.post('/leave-room/')
    this.setState({code: null})
    this.props.history.push('/')
  }

  render () {
    const { roomCode,
      guestCanPause,
      isHost,
      votesToSkip,
      loading
    } = this.state

    return (
      <>
        <Grid style={{ marginTop: 30 }}>
          <Grid.Row centered>
            <Card>

              <Loader show={loading} />

              <Card.Content>
                <Card.Header>
                  Code of this Room: <Label color="olive">{roomCode}</Label>
                </Card.Header>
              </Card.Content>
              <Card.Content extra>
                <Card.Meta>
                  <b>{guestCanPause !== null && `Guest can Pause ${guestCanPause.toString()}`}</b>
                </Card.Meta>
                <Card.Meta>
                  <b>{guestCanPause !== null && `Is Host ${isHost.toString()}`}</b>
                </Card.Meta>
                <Card.Meta>
                  <b>{votesToSkip !== null && `Votes to skip ${votesToSkip.toString()}`}</b>
                </Card.Meta>
              </Card.Content>
            </Card>
          </Grid.Row>

          <Grid.Row centered>
            <Button to="/create" negative onClick={this.handleLeaveClick}>
              <Icon name="sign-out"></Icon>
                Sair da página
              </Button>
          </Grid.Row>

        </Grid>
      </>
    );
  }
}
