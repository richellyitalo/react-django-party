import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

export default function ({ show }) {
  return (
    show &&
    <Dimmer active inverted>
      <Loader size='medium'>Loading</Loader>
    </Dimmer>
  )
}