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

import Form from 'react-bootstrap/Form';
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

class filterCategories extends Component {
  constructor(props) {
    super(props);

        this.state = {
          loading: false,
          items: [],
          stores: '',
          copied: false,
          cta: [],
          where: [],
        };
      }

      componentDidMount(){
          this.setState({ loading: true });
          this.getItems();
      }

      componentWillUnmount() {
        if(this.unsubscribe)
          this.unsubscribe();
      }

      getItems = () => {
        const db = firebase.firestore();

        this.subscribe = db.collection("items").orderBy("timestamp", "desc").limit(25).get()
        .then(snap => {
          const items= {}
          snap.forEach(doc => {
          items[doc.id] = doc.data()
          })
          this.setState({items, loading: false})
        })
      }

      onChange = event => {
        this.setState({ [event.target.name]: event.target.value});
      };

      render () {

        const { items, loading } = this.state;
        const itemUrl = window.location.href;

        return (
            <Container fluid>
              <Col xs={12} className="px-1">
                <h1 className="pageTitleCat">An online market for micro businesses.</h1>
                <Form onSubmit={this.onSubmit} className="homeSearch">
                  <Form.Group controlId="formDrop">
                    <Form.Control as="select" name="cta" value={this.state.cta || ''} onChange={this.onChange}>
                      <option>Select your location</option>
                      <option>South Africa 🇿🇦</option>
                      <option>Cape Town</option>
                      <option>Joburg</option>
                      <option>Durban</option>
                      <option>Pretoria</option>
                      <option>Other</option>

                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="formSearch">
                    <Form.Control
                      name="where"
                      value={this.state.where || ''}
                      onChange={this.onChange}
                      type="text"
                      placeholder="What are you looking for?"
                    />
                  </Form.Group>
                </Form>
              </Col>

              <h3 className="pageSubTitleCat">Choose a category</h3>
              <Row className="px-2">
                <Col xs={6} className="px-2">
                  <div className="catBlock">
                    <span className="catIcon">🏪</span>
                    <span className="catName">Spaza Shop</span>
                  </div>
                </Col>
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
                  <div className="catBlock">
                    <span className="catIcon">💇🏼‍♂️</span>
                    <span className="catName">Barber/Salon</span>
                  </div>
                </Col>
                <Col xs={6} className="px-2">
                  <NavLink to={ROUTES.FILT_CAR}>
                    <div className="catBlock">
                      <span className="catIcon">🚗</span>
                      <span className="catName">Cars</span>
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
                  <div className="catBlock">
                    <span className="catIcon">🧵</span>
                    <span className="catName">Arts & Crafts</span>
                  </div>
                </Col>
                <Col xs={6} className="px-2">
                  <div className="catBlock">
                    <span className="catIcon">👟</span>
                    <span className="catName">Sneakers</span>
                  </div>
                </Col>
                <Col xs={6} className="px-2">
                  <div className="catBlock">
                    <span className="catIcon">🚚</span>
                    <span className="catName">Movers</span>
                  </div>
                </Col>
                <Col xs={6} className="px-2">
                  <div className="catBlock">
                    <span className="catIcon">♻️</span>
                    <span className="catName">Thrift</span>
                  </div>
                </Col>
                <Col xs={6} className="px-2">
                  <div className="catBlock">
                    <span className="catIcon">🧹</span>
                    <span className="catName">Cleaners</span>
                  </div>
                </Col>
                <Col xs={6} className="px-2">
                  <NavLink to={ROUTES.FILT_SERVICES}>
                    <div className="catBlock">
                      <span className="catIcon">⚙️</span>
                      <span className="catName">Other Services</span>
                    </div>
                  </NavLink>
                </Col>
              </Row>
            </Container>
        );
      }
}

export default filterCategories;
