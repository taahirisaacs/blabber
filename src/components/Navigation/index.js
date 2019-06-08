import React from 'react';
import { LinkContainer } from "react-router-bootstrap";

import Nav from 'react-bootstrap/Nav';
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
    <LinkContainer to={ROUTES.HOME}><Navbar.Brand><span className="sml">tiny</span>trader</Navbar.Brand></LinkContainer>
  </Navbar>
);

const NavigationNonAuth = () => (
  <Navbar expand="lg" className="px-0">
    <Navbar.Brand href="/home">tiny trader</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
      <Nav>
        <LinkContainer to={ROUTES.LANDING}>
          <Nav.Item>Landing</Nav.Item>
        </LinkContainer>
        <LinkContainer to={ROUTES.SIGN_IN}>
          <Nav.Item>Sign In</Nav.Item>
        </LinkContainer>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default Navigation;
