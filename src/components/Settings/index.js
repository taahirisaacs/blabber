import React from 'react';
import { AuthUserContext, withAuthorization } from '../Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import * as ROUTES from '../../constants/routes';
import SignOutButton from '../SignOut';


import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const Settings = () => (
  <AuthUserContext.Consumer>
    {authUser => (
        <Col xs={{span:10, offset:1}}>
            <h3>Settings</h3>
            <p>Account: {authUser.email}</p>
              <PasswordForgetForm />
              <PasswordChangeForm className="mb-3"/>
            <SignOutButton to={ROUTES.SIGN_IN} />
        </Col>
      )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Settings);
