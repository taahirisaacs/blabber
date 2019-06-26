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
            <Container fluid style={{paddingTop:`10px`}}>

              <Form onSubmit={this.onSubmit} className="homeSearch">

                <Form.Group controlId="formSearch">
                  <Form.Control
                    name="where"
                    value={this.state.where || ''}
                    onChange={this.onChange}
                    type="text"
                    className="input"
                    placeholder="What are you looking for? 🔍"
                  />
                </Form.Group>
              </Form>
              <h3 className="pageSubTitleCat">Choose a category</h3>
              <Row className="px-2">
                <Col xs={6} className="px-2">
                  <div className="catBlock disB">
                    <span className="catIcon">🏪</span>
                    <span className="catName">Spaza Shop</span>
                    <span className="catCount">Coming soon</span>
                  </div>
                </Col>
                <Col xs={6} className="px-2">
                  <NavLink to={ROUTES.FILT_ELEC}>
                    <div className="catBlock">
                      <span className="catIcon">💻</span>
                      <span className="catName">Electronics</span>
                      <span className="catCount"><span className="dot "></span>2837 Online</span>
                    </div>
                  </NavLink>
                </Col>
                <Col xs={6} className="px-2">
                  <NavLink to={ROUTES.FILT_CLOTHING}>
                    <div className="catBlock">
                      <span className="catIcon">👕</span>
                      <span className="catName">Clothing</span>
                      <span className="catCount"><span className="dot "></span>2837 Online</span>
                    </div>
                  </NavLink>
                </Col>
                <Col xs={6} className="px-2">
                  <div className="catBlock disB">
                    <span className="catIcon">💇🏼‍♂️</span>
                    <span className="catName">Barber/Salon</span>
                    <span className="catCount">Coming soon</span>
                  </div>
                </Col>
                <Col xs={6} className="px-2">
                  <NavLink to={ROUTES.FILT_CAR}>
                    <div className="catBlock">
                      <span className="catIcon">🚗</span>
                      <span className="catName">Cars</span>
                      <span className="catCount"><span className="dot "></span>2837 Online</span>
                    </div>
                  </NavLink>
                </Col>
                <Col xs={6} className="px-2">
                  <NavLink to={ROUTES.FILT_FOOD}>
                    <div className="catBlock">
                      <span className="catIcon">🍔</span>
                      <span className="catName">Food</span>
                      <span className="catCount"><span className="dot "></span>2837 Online</span>
                    </div>
                  </NavLink>
                </Col>
                <Col xs={6} className="px-2">
                  <div className="catBlock disB">
                    <span className="catIcon">🧵</span>
                    <span className="catName">Arts & Crafts</span>
                    <span className="catCount">Coming soon</span>
                  </div>
                </Col>
                <Col xs={6} className="px-2">
                  <div className="catBlock disB">
                    <span className="catIcon">👟</span>
                    <span className="catName">Sneakers</span>
                    <span className="catCount">Coming soon</span>
                  </div>

                </Col>
                <Col xs={6} className="px-2 disB">
                  <div className="catBlock disB">
                    <span className="catIcon">🚚</span>
                    <span className="catName">Movers</span>
<span className="catCount">Coming soon</span>
                  </div>
                </Col>
                <Col xs={6} className="px-2 disB">
                  <div className="catBlock disB">
                    <span className="catIcon">♻️</span>
                    <span className="catName">Thrift</span>
                  <span className="catCount">Coming soon</span>
                  </div>
                </Col>
                <Col xs={6} className="px-2 disB">
                  <div className="catBlock disB">
                    <span className="catIcon">🧹</span>
                    <span className="catName">Cleaners</span>
                  <span className="catCount">Coming soon</span>
                  </div>
                </Col>
                <Col xs={6} className="px-2">
                  <NavLink to={ROUTES.FILT_SERVICES}>
                    <div className="catBlock">
                      <span className="catIcon">⚙️</span>
                      <span className="catName">Other Services</span>
                      <span className="catCount"><span className="dot "></span>2837 Online</span>
                    </div>
                  </NavLink>
                </Col>
                <Container fluid className="px-1 mx-0 Footer">
                  <Form onSubmit={this.onSubmit} className="homeSearch">
                    <Form.Group controlId="formDrop"  className="mx-0 px-0">
                      <Form.Control as="select" name="cta" value={this.state.cta || ''} onChange={this.onChange}>
                        <option>Change your location  ↓</option>
                        <option>South Africa 🇿🇦</option>
                        <option>Cape Town</option>
                        <option>Joburg</option>
                        <option>Durban</option>
                        <option>Pretoria</option>
                        <option>Other</option>

                      </Form.Control>
                    </Form.Group>
                  </Form>
                  <Navbar.Brand className="mx-0 footer"><span className="catIcon foIcon">🏪</span>TinyTrader</Navbar.Brand>
                  <h1 className="pageTitleCat">An online market for micro businesses.</h1>

                </Container>
              </Row>
            </Container>
        );
      }
}

export default filterCategories;
