import React from 'react';
import { Link } from 'react-router-dom';
import { LinkContainer } from "react-router-bootstrap";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

const Navigation = () => (
  <Col>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </Col>
);

const NavigationAuth = () => (
  <Navbar fluid sticky="top">
    <Navbar.Brand href={ROUTES.LANDING}><p style={{color:`#fff`,}}>Blabber</p></Navbar.Brand>
    <Navbar.Collapse>
      <Nav className="justify-content-end">
        <LinkContainer to={ROUTES.LANDING}>
          <Nav.Item>Landing</Nav.Item>
        </LinkContainer>
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
          <SignOutButton />
        </Nav.Item>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

const NavigationNonAuth = () => (
  <Navbar sticky="top">
    <Navbar.Brand href={ROUTES.LANDING}><p style={{color:`#fff`,}}>Blabber</p></Navbar.Brand>
      <Nav className="justify-content-end" activeKey={ROUTES.HOME}>
        <Nav.Item>
          <Link to={ROUTES.LANDING}>Landing</Link>
        </Nav.Item>
        <Nav.Item>
          <Link to={ROUTES.SIGN_IN}>Sign In</Link>
        </Nav.Item>
      </Nav>
  </Navbar>
);

export default Navigation;
