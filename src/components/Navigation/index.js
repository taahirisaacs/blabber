import React from 'react';
import { LinkContainer } from "react-router-bootstrap";

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

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
  <Navbar expand="lg">
    <Navbar.Brand href="/home">(tiny)trader</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
      <Nav>
        <LinkContainer to={ROUTES.HOME}>
          <Nav.Item>Home</Nav.Item>
        </LinkContainer>
        <LinkContainer to={ROUTES.ACCOUNT}>
          <Nav.Item>Account</Nav.Item>
        </LinkContainer>
        <LinkContainer to={ROUTES.ADMIN}>
          <Nav.Item>Admin</Nav.Item>
        </LinkContainer>
        <Nav.Item>
          <SignOutButton to={ROUTES.SIGN_IN} />
        </Nav.Item>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

const NavigationNonAuth = () => (
  <Navbar expand="lg">
    <Navbar.Brand href="/home">(tiny)trader</Navbar.Brand>
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
