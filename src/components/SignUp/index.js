import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { LoginLink } from '../SignIn';
import Uploader from './../Uploader';
import {Image} from 'cloudinary-react';
import {Helmet} from "react-helmet";

import AlgoliaPlaces from 'algolia-places-react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import firebaseui from 'firebaseui';
import app from 'firebase/app';
import firebase from 'firebase/app';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';



const SignUpPage = () => (
  <Row className="mx-0">
    <Helmet>
      <meta charSet="utf-8" />
      <title>Login / Sign Up | TinyTrader</title>
      <meta name="description" content="Login or Sign Up for TinyTrader using your WhatsApp number. No Passwords. No forms." />
    </Helmet>
    <Col xs={{span:'10', offset:'1'}}>
      <h1 className="pageTitle">Login or Sign Up using your WhatsApp number</h1>
      <SignUpForm />
    </Col>
  </Row>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  location: '',
  locationCoLat: '',
  locationCoLng: '',
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
    const { username, email, storeWhatsapp, storeName, storeCategory, location, locationCoLat, locationCoLng, profileUrl, passwordOne } = this.state;

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
            profileUrl: profileUrl || 'https://via.placeholder.com/150/000000/FFFFFF?Text=TinyTrader.co.za',
            store: {
              name: storeName,
              category: storeCategory,
              whatsapp: storeWhatsapp,
              location,
              _geoloc: {
                lat: locationCoLat,
                lng: locationCoLng
              },
              user: authUser.user.uid,
              imgUrl: profileUrl || 'https://via.placeholder.com/150/000000/FFFFFF?Text=TinyTrader.co.za',
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



  componentDidMount () {
    const uiConfig = {
                  callbacks: {
                    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                      // User successfully signed in.
                      // Return type determines whether we continue the redirect automatically
                      // or whether we leave that to developer to handle.
                      return true;
                    },
                    uiShown: function() {
                      // The widget is rendered.
                      // Hide the loader.
                      document.getElementById('loader').style.display = 'none';
                    }
                  },
                  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
                  signInFlow: 'popup',
                  signInSuccessUrl: [ROUTES.HOME],
                  signInOptions: [
                    {
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      recaptchaParameters: {
        size: 'invisible', // 'invisible' or 'compact'
      },
      defaultCountry: 'ZA',
    }
                  ],
                  // Terms of service url.
                  tosUrl: '<your-tos-url>',
                  // Privacy policy url.
                  privacyPolicyUrl: '<your-privacy-policy-url>'
                };
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
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

    return (
      <div>
        <div id="firebaseui-auth-container"></div>
        <div id="loader">Loading...</div>
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
