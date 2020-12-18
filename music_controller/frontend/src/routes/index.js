import React from 'react';
import { Switch, Route } from 'react-router-dom';

import HomePage from '@/pages/HomePage/HomePage';
import JoinPage from '@/pages/JoinPage/JoinPage';
import CreatePage from '@/pages/CreatePage/CreatePage';
import RoomView from '@/pages/RoomView/RoomView';

const routes = () => (
  <Switch>
    <Route exact path="/" component={HomePage} />
    <Route exact path="/join" component={JoinPage} />
    <Route exact path="/create" component={CreatePage} />
    <Route exact path="/room/:roomCode" component={RoomView} />
  </Switch>
);

export default routes;
