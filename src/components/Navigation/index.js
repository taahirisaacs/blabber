import React from 'react';
import { LinkContainer } from "react-router-bootstrap";

import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

const Navigation = () => (
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
);

const NavigationAuth = () => (
  <Navbar expand="lg" sticky="top">
    <LinkContainer to={ROUTES.HOME}><Navbar.Brand>TinyTrader</Navbar.Brand></LinkContainer>
  </Navbar>
);

const NavigationNonAuth = () => (
  <Navbar expand="lg" className="px-3">
    <Navbar.Brand className="mx-0" href="/home">TinyTrader</Navbar.Brand>
    <Nav>
      <LinkContainer as="button" className="signup" to={ROUTES.SIGN_UP}>
        <Nav.Item>Create your store</Nav.Item>
      </LinkContainer>
    </Nav>
  </Navbar>
);

export default Navigation;
