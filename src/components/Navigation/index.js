import React from 'react';
import { Link, Route, Switch, Redirect } from 'react-router-dom';
import { LinkContainer } from "react-router-bootstrap";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

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
      <Nav>
        <NavDropdown title="Menu" id="nav-dropdown">
          <NavDropdown.Item eventKey="4.3">
            <LinkContainer to={ROUTES.HOME}>
              <Nav.Item>Home</Nav.Item>
            </LinkContainer>
          </NavDropdown.Item>
          <NavDropdown.Item eventKey="4.1">
            <LinkContainer to={ROUTES.ACCOUNT}>
            <Nav.Item>Account</Nav.Item>
            </LinkContainer>
          </NavDropdown.Item>
          <NavDropdown.Item eventKey="4.2">
            <LinkContainer to={ROUTES.ADMIN}>
              <Nav.Item>Admin</Nav.Item>
            </LinkContainer>
          </NavDropdown.Item>
          <NavDropdown.Item eventKey="4.4">
            <Nav.Item>
              <SignOutButton to={ROUTES.SIGN_IN} />
            </Nav.Item>
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
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
