import React from 'react';
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
  <Navbar sticky="top" bg="light" variant="light">
    <Navbar.Brand href={ROUTES.LANDING}>Navbar</Navbar.Brand>
    <Nav className="justify-content-end" activeKey={ROUTES.HOME}>
      <Nav.Item>
        <Link to={ROUTES.LANDING}>Landing</Link>
      </Nav.Item>
      <Nav.Item>
        <Link to={ROUTES.HOME}>Home</Link>
      </Nav.Item>
      <Nav.Item>
        <Link to={ROUTES.ACCOUNT}>Account</Link>
      </Nav.Item>
      <Nav.Item>
        <Link to={ROUTES.ADMIN}>Admin</Link>
      </Nav.Item>
      <Nav.Item>
        <SignOutButton />
      </Nav.Item>
    </Nav>
  </Navbar>
);

const NavigationNonAuth = () => (
  <Navbar sticky="top" bg="light" variant="light">
    <Navbar.Brand href={ROUTES.LANDING}>Navbar</Navbar.Brand>
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
