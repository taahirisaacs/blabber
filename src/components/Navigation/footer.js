import React from 'react';
import { LinkContainer } from "react-router-bootstrap";
import { Link, NavLink } from 'react-router-dom';

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
      <NavLink to={ROUTES.EXPLORE}>
        <span className="navItem">
          <FontAwesomeIcon icon={faSearch} className="icon_store"/>
        <p>Explore</p>
        </span>
      </NavLink>
    </Col>

    <Col className="px-0">
      <NavLink to={ROUTES.ORDERS}>
        <span className="navItem">
          <FontAwesomeIcon icon={faReceipt} className="icon_store"/>
        <p>Orders</p>
        </span>
      </NavLink>
    </Col>

    <Col className="px-0">
      <NavLink to={ROUTES.NEWITEM}>
        <span className="navItem">
          <FontAwesomeIcon icon={faPlusSquare} className="icon_store" />
          <p>Add Item</p>
        </span>
      </NavLink>
    </Col>

    <Col className="px-0">
      <NavLink to={ROUTES.HOME}>
        <span className="navItem">
          <FontAwesomeIcon icon={faStore} className="icon_store"/>
          <p>My Store</p>
        </span>
      </NavLink>
    </Col>
  </Row>
);

const FooterNonAuth = () => (
  <Row className="bottomNavPublic">
    <Col className="px-0">
      <Link to={ROUTES.LANDING}>
        <span className="navItemLanding">
          🏚
        </span>
      </Link>
    </Col>
    <Col className="px-0">
      <NavLink to={ROUTES.FILT_FOOD}>
        <span className="navItemLanding">
          🍔
        </span>
      </NavLink>
    </Col>
    <Col className="px-0">
      <NavLink to={ROUTES.FILT_CLOTHING}>
        <span className="navItemLanding">
          👕
        </span>
      </NavLink>
    </Col>
    <Col className="px-0">
      <NavLink to={ROUTES.FILT_ELEC}>
        <span className="navItemLanding">
          💻
        </span>
      </NavLink>
    </Col>
    <Col className="px-0">
      <NavLink to={ROUTES.FILT_CAR}>
        <span className="navItemLanding">
          🚗
        </span>
      </NavLink>
    </Col>
    <Col className="px-0">
      <NavLink to={ROUTES.FILT_SERVICES}>
        <span className="navItemLanding">
          ⚙️
        </span>
      </NavLink>
    </Col>

  </Row>
);

export default FooterNavigation;
