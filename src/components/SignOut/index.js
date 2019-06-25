import React from 'react';

import { withFirebase } from '../Firebase';
import Button from 'react-bootstrap/Button';

const SignOutButton = ({ firebase }) => (
  <Button className="settings" size="xs" variant="secondary" type="button" onClick={firebase.doSignOut} block>
    Sign Out
  </Button>
);

export default withFirebase(SignOutButton);
