import React, { Component } from 'react';
import { LinkContainer } from "react-router-bootstrap";
import { NavLink, Link } from 'react-router-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import TextTruncate from 'react-text-truncate';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Uploader from './../Uploader';
import FooterNavigation from '../Navigation/footer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import foodIcon from '../../images/food-icon.svg'
import elecIcon from '../../images/elec-icon.svg'
import clothingIcon from '../../images/cloth-icon.svg'
import carsIcon from '../../images/car-icon.svg'
import sneakersIcon from '../../images/sneaker-icon.svg'
import moverIcon from '../../images/mover-icon.svg'
import salonIcon from '../../images/salon-icon.svg'

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import TextareaAutosize from 'react-autosize-textarea';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Spinner from 'react-bootstrap/Spinner';

import firebase from 'firebase/app';

import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

class CategoryList extends Component {
  constructor(props) {
    super(props);

        this.state = {
          loading: false,
          cta: '',
        };
      }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value});
  };

      render () {

        return (
            <Col className="mx-0 px-0">
              <h3 className="pageSubTitleCat">Choose a category</h3>
              <Row className="px-2">

                <Col xs={6} className="px-2">
                  <NavLink to={ROUTES.FILT_ELEC}>
                    <div className="catBlock">
                      <span className="catIcon">💻</span>
                      <span className="catName">Electronics</span>

                    </div>
                  </NavLink>
                </Col>
                <Col xs={6} className="px-2">
                  <NavLink to={ROUTES.FILT_CLOTHING}>
                    <div className="catBlock">
                      <span className="catIcon">👕</span>
                      <span className="catName">Clothing</span>

                    </div>
                  </NavLink>
                </Col>
                <Col xs={6} className="px-2">
                  <NavLink to={ROUTES.FILT_CAR}>
                    <div className="catBlock">
                      <span className="catIcon">🚗</span>
                      <span className="catName">Cars</span>

                    </div>
                  </NavLink>
                </Col>
                <Col xs={6} className="px-2 ">
                  <NavLink to={ROUTES.FILT_THRIFT}>
                    <div className="catBlock ">
                      <span className="catIcon">♻️</span>
                      <span className="catName">Thrift</span>

                    </div>
                  </NavLink>
                </Col>
                <Col xs={6} className="px-2">
                  <NavLink to={ROUTES.FILT_SNEAKERS}>
                    <div className="catBlock">
                      <span className="catIcon">👟</span>
                      <span className="catName">Sneakers</span>

                    </div>
                  </NavLink>
                </Col>
                <Col xs={6} className="px-2">
                  <NavLink to={ROUTES.FILT_FOOD}>
                    <div className="catBlock">
                      <span className="catIcon">🍔</span>
                      <span className="catName">Food</span>

                    </div>
                  </NavLink>
                </Col>
                <Col xs={6} className="px-2">
                  <NavLink to={ROUTES.FILT_MOVERS}>
                    <div className="catBlock">
                      <span className="catIcon">🚚</span>
                      <span className="catName">Movers</span>

                    </div>
                  </NavLink>
                </Col>
                <Col xs={6} className="px-2 ">
                  <NavLink to={ROUTES.FILT_TRANS}>
                    <div className="catBlock ">
                      <span className="catIcon">🚕</span>
                      <span className="catName">Transport</span>

                    </div>
                  </NavLink>
                </Col>
                <Col xs={6} className="px-2">
                  <NavLink to={ROUTES.FILT_CLEANERS}>
                    <div className="catBlock">
                      <span className="catIcon">🧹</span>
                      <span className="catName">Cleaners</span>

                    </div>
                  </NavLink>
                </Col>
                <Col xs={6} className="px-2">
                  <NavLink to={ROUTES.FILT_SALON}>
                    <div className="catBlock">
                      <span className="catIcon">💅🏼</span>
                      <span className="catName">Salon</span>

                    </div>
                  </NavLink>
                </Col>
                <Col xs={6} className="px-2">
                  <NavLink to={ROUTES.FILT_BARBER}>
                    <div className="catBlock">
                      <span className="catIcon">💇🏼‍♂️</span>
                      <span className="catName">Barber</span>

                    </div>
                  </NavLink>
                </Col>
                <Col xs={6} className="px-2 ">
                  <NavLink to={ROUTES.FILT_MANU}>
                    <div className="catBlock ">
                      <span className="catIcon">🏭</span>
                      <span className="catName">Manufacturing</span>

                    </div>
                  </NavLink>
                </Col>

                <Col xs={6} className="px-2">
                  <NavLink to={ROUTES.FILT_SPAZA}>
                    <div className="catBlock">
                      <span className="catIcon">🏪</span>
                      <span className="catName">Spaza Shops</span>

                    </div>
                  </NavLink>
                </Col>

                <Col xs={6} className="px-2">
                  <NavLink to={ROUTES.FILT_PROSERV}>
                    <div className="catBlock">
                      <span className="catIcon">👔</span>
                      <span className="catName">Pro Services</span>
                    </div>
                  </NavLink>
                </Col>
                <Col xs={6} className="px-2">
                  <NavLink to={ROUTES.FILT_SKILLED}>
                    <div className="catBlock">
                      <span className="catIcon">🛠</span>
                      <span className="catName">Skilled Trades</span>

                    </div>
                  </NavLink>
                </Col>
                <Col xs={6} className="px-2">
                  <NavLink to={ROUTES.FILT_ARTS}>
                    <div className="catBlock">
                      <span className="catIcon">🧵</span>
                      <span className="catName">Arts & Crafts</span>

                    </div>
                  </NavLink>
                </Col>
                <Container fluid className="mx-0 Footer">
                  {/* <h3 className="pageSubTitleFooter">Change your location</h3>
                    <Form onSubmit={this.onSubmit} className="homeSelect">
                    <Form.Group controlId="formDrop"  className="mx-0 px-0">
                      <Form.Control as="select" name="cta" multiple={false} value={this.state.cta || ''} onChange={this.onChange}>
                    <option>Cape Town, South Africa 🇿🇦</option>
                    <option>Joburg, South Africa 🇿🇦</option>
                    <option>Durban, South Africa 🇿🇦</option>
                    <option>Pretoria, South Africa 🇿🇦</option>
                    <option>Other</option>
                      </Form.Control>
                    </Form.Group>
                  </Form> */}
                  <h3 className="pageSubTitleFooter">Need help getting started?</h3>
                  <Button block className="storebtn mt-0 mb-2" href={`https://wa.me/27628303606/?text=New%20TinyTrader%C2%AE%20Request%0A%0AYour%20Request:`}>Chat to us on WhatsApp</Button>
                  <Navbar.Brand className="mx-0 footer"><span className="catIcon foIcon">🏪</span>TinyTrader</Navbar.Brand>
                  <h1 className="pageTitleCat">An online marketplace for micro, small and home-based businesses.</h1>

                </Container>
              </Row>
            </Col>
        );
      }

}

export default CategoryList;
