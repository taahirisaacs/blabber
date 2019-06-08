import React from 'react';
import { LinkContainer } from "react-router-bootstrap";
import { NavLink } from 'react-router-dom';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore, faSearch, faUserCircle, faReceipt, faPlusSquare, faHome } from '@fortawesome/free-solid-svg-icons';

const FooterNavigation = () => (
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <FooterNavigationAuth /> : <FooterNonAuth />
      }
    </AuthUserContext.Consumer>
);

const FooterNavigationAuth = () => (
  <Row className="bottomNav">
    <Col className="px-0">
      <NavLink to={ROUTES.ADMIN}>
        <span className="navItem">
      <FontAwesomeIcon icon={faHome} />
      </span>
    </NavLink>
    </Col>
    <Col className="px-0">
      <NavLink to={ROUTES.EXPLORE}>
        <span className="navItem">
          <FontAwesomeIcon icon={faSearch} />
        </span>
    </NavLink>
    </Col>
    <Col className="px-0">
      <NavLink to={ROUTES.NEWITEM}>
        <span className="navItem">
          <FontAwesomeIcon icon={faPlusSquare} />
        </span>
    </NavLink>
    </Col>
    <Col className="px-0">
      <NavLink to={ROUTES.ORDERS}>
        <span className="navItem">
      <FontAwesomeIcon icon={faReceipt} />
      </span>
    </NavLink>
    </Col>
    <Col className="px-0">
      <NavLink to={ROUTES.HOME}>
        <span className="navItem">
          <FontAwesomeIcon icon={faStore} />
        </span>
      </NavLink>
    </Col>

  </Row>
);

const FooterNonAuth = () => (
  null
);

export default FooterNavigation;
