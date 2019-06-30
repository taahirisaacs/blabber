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

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignUpPage = () => (
  <Row className="mx-0">
    <Col xs={{span:'10', offset:'1'}}>
      <h1 className="pageTitle">Sign up to start trading</h1>
      <SignUpForm />
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

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, storeWhatsapp, storeName, storeCategory, location, profileUrl, passwordOne } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase
          .user(authUser.user.uid)
          .set({
            username,
            email,
            location,
            profileUrl,
            store: {
              name: storeName,
              category: storeCategory,
              whatsapp: storeWhatsapp,
              location,
              user: authUser.user.uid
            },
          });
      })
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  showWidget = (widget) => {
    widget = window.cloudinary.createUploadWidget({
      cloudName: "djqr0a74c",
      uploadPreset: "jsghwzwi" },
    (error, result) => {

    if (!error && result && result.event === "success") {
      console.log('Done! Here is the image info: ', result.info);

      const profileUrl = result.info.url;
      this.setState({profileUrl});
    }

    })
    widget.open();
  };

  render() {

    const {
      username,
      email,
      profileUrl,
      location,
      passwordOne,
      passwordTwo,
      error,
      storeWhatsapp,
      storeName,
      storeCategory
    } = this.state;

    const style = {
      backgroundImage: `url(${profileUrl})`,
      backgroundRepeat: `no-repeat`,
      backgroundSize: `contain`,
      backgroundPosition: `center`,
    }

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <div>
        <Button onClick={this.showWidget} className="ProfileImgBtn">
          <span style={style} className="ProfileImg">


            <span className="ProfileText">
              +
            </span>
          </span>
        </Button>
        <Form onSubmit={this.onSubmit}>
          <span className="formTitles">Your Personal Info</span>
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
          <Form.Group controlId="formEmail">
            <Form.Control
              name="email"
              value={email}
              onChange={this.onChange}
              type="text"
              placeholder="Email Address"
            />
          </Form.Group>
          <span className="formTitles">Your Store Info</span>
          <Form.Group controlId="formstoreName">
            <Form.Control
              name="storeName"
              value={storeName}
              onChange={this.onChange}
              type="text"
              placeholder="What's you store called?"
            />
          </Form.Group>
          <Form.Group controlId="formLocation">
            <AlgoliaPlaces
              placeholder='Where is your store located?'

              options={{
                appId: 'plMOIODNLXZ6',
                apiKey: 'b40b54304cdc5beb771d96ffc12c8cfe',
                language: 'en',
                countries: ['za'],
                type: 'city',
              }}

              onChange={({ query, rawAnswer, suggestion, suggestionIndex }) =>
                this.setState({ location: suggestion.value }) }

              onSuggestions={({ rawAnswer, query, suggestions }) =>
                console.log('Fired when dropdown receives suggestions. You will receive the array of suggestions that are displayed.')}

              onCursorChanged={({ rawAnswer, query, suggestion, suggestonIndex }) =>
                console.log('Fired when arrows keys are used to navigate suggestions.')}

              onClear={() =>
                console.log('Fired when the input is cleared.')}

              onLimit={({ message }) =>
                console.log('Fired when you reached your current rate limit.')}

              onError={({ message }) =>
                console.log('Fired when we could not make the request to Algolia Places servers for any reason but reaching your rate limit.')}
            />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Control as="select" name="storeCategory" value={storeCategory} onChange={this.onChange}>
              <option>Which Product/Service category?</option>
              <option>👕 Clothing</option>
              <option>👟 Shoes</option>
              <option>🍔 Food</option>
              <option>💻 Electronics</option>
              <option>🚗 Cars</option>
              <option>⚙️ Services</option>
              <option>🚚 Logistics</option>
              <option>📦 2nd Hand Goods</option>
              <option>💅🏼 Salon</option>
              <option>💇🏼‍♂️ Barber</option>
              <option>🧹 Cleaning</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formstoreWhatsapp">
            <Form.Control
              name="storeWhatsapp"
              value={storeWhatsapp}
              onChange={this.onChange}
              type="text"
              placeholder="Whatsapp/Contact Number"
            />
          </Form.Group>
          <span className="formTitles">Security</span>
          <Form.Group controlId="formPassOne">
            <Form.Control
              name="passwordOne"
              value={passwordOne}
              onChange={this.onChange}
              type="password"
              placeholder="Password"
            />
          </Form.Group>
          <Form.Group controlId="formPassTwo">
            <Form.Control
              name="passwordTwo"
              value={passwordTwo}
              onChange={this.onChange}
              type="password"
              placeholder="Confirm Password"
            />
          </Form.Group>
          <Button variant="primary" disabled={isInvalid} type="submit" block>
            Sign Up
          </Button>

          {error && <p>{error.message}</p>}
        </Form>
      </div>
    );
  }
}



const SignUpLink = () => (
  <p style={{textAlign:`center`, marginTop:`20px`}}>
    Don't have a TinyTrader account yet? <Link to={ROUTES.SIGN_UP}>Create a free account today</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
