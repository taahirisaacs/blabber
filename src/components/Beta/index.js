import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { LoginLink } from '../SignIn';
import Uploader from './../Uploader';
import {Image} from 'cloudinary-react';

import AlgoliaPlaces from 'algolia-places-react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import firebase from 'firebase/app';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const BetaListPage = () => (
  <Row className="mx-0">
    <Col xs={{span:'10', offset:'1'}}>
      <h1 className="pageTitle">Join +250 traders ready for business. Sign up for Beta.</h1>
      <BetaListForm />
      <LoginLink />
    </Col>
  </Row>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  location: '',
  profileUrl: '',
  passwordOne: '',
  passwordTwo: '',
  storeWhatsapp: '',
  storeName: '',
  storeCategory: '',
  error: null,
};

class BetaListFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, storeWhatsapp, storeCategory, location } = this.state;

    const db = firebase.firestore();
    const dbCol = db.collection("betalist");

      dbCol.add({
          name: username || '',
          whatsapp: storeWhatsapp || '',
          location: location || '',
          category: storeCategory || '',
        })
      .then( () => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.LANDING_CAT);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };


  render() {

    const {
      username,
      location,
      error,
      storeWhatsapp,
      storeName,
      storeCategory
    } = this.state;

    const isInvalid =
      storeWhatsapp === '' ||
      username === '';

    return (
      <div>
        <Form onSubmit={this.onSubmit}>
          <Form.Control style={{display:`none`}} name="profileUrl" value={this.state.profileUrl || ''} onChange={this.onChange} type="text" placeholder="profileUrl" />
          <Form.Group controlId="formUsername">
            <Form.Control
              name="username"
              value={username}
              onChange={this.onChange}
              type="text"
              placeholder="Full Name"
            />
          </Form.Group>
          <Form.Group controlId="formstoreWhatsapp">
            <Form.Control
              name="storeWhatsapp"
              value={storeWhatsapp}
              onChange={this.onChange}
              type="text"
              placeholder="Whatsapp Number"
            />
          </Form.Group>
          <Form.Group controlId="formLocation">
            <AlgoliaPlaces
              placeholder='Where are you based?'

              options={{
                appId: 'plMOIODNLXZ6',
                apiKey: 'b40b54304cdc5beb771d96ffc12c8cfe',
                language: 'en',
                countries: ['za'],
                type: 'address',
              }}

              onChange={({ query, rawAnswer, suggestion, suggestionIndex }) =>
                this.setState({ location: suggestion.value }) }

            />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Control as="select" name="category" value={this.state.category || ''} onChange={this.onChange}>
              <option>What category describes your business?</option>
              <option>👕 Clothing</option>
              <option>👟 Sneakers</option>
              <option>🍔 Food</option>
              <option>💻 Electronics</option>
              <option>🚗 Cars</option>
              <option>🚚 Movers</option>
              <option>🚕 Transport</option>
              <option>♻️ Thrift</option>
              <option>💅🏼 Salon</option>
              <option>💇🏼‍♂️ Barber</option>
              <option>🧹 Cleaner</option>
              <option>🏪 Spaza Shop</option>
              <option>🏭 Manufacturing</option>
              <option>👔 Pro Services</option>
              <option>🛠 Skilled Tradesmen</option>
            </Form.Control>
          </Form.Group>

          <Button variant="primary" disabled={isInvalid} type="submit" block>
            Sign Up for Beta
          </Button>

          {error && <p>{error.message}</p>}
        </Form>
      </div>
    );
  }
}



const BetaListLink = () => (
  <p style={{textAlign:`center`, marginTop:`20px`}}>
    Join +250 traders ready for business <Link to={ROUTES.BETA}>Sign up for Beta</Link>
  </p>
);

const BetaListForm = compose(
  withRouter,
  withFirebase,
)(BetaListFormBase);

export default BetaListPage;

export { BetaListForm, BetaListLink };
