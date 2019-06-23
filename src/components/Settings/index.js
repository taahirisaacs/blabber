import React from 'react';
import { AuthUserContext, withAuthorization } from '../Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import WhatsappUpdate from '../WhatsappUpdate';
import * as ROUTES from '../../constants/routes';
import FooterNavigation from '../Navigation/footer';


import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const Settings = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <Col xs={{span:'10', offset:'1'}}>
        <h3>Settings</h3>
        <p>{authUser.username}</p>
        <WhatsappUpdate className="mb-3"/>
        <PasswordForgetForm />
        <PasswordChangeForm className="mb-3"/>
        <FooterNavigation />
        </Col>
      )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Settings);
