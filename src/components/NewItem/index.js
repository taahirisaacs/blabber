import React from 'react';
import { AuthUserContext, withAuthorization } from '../Session';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const NewItem = () => (
  <div>
    <h1>NewItem</h1>
  </div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(NewItem);
