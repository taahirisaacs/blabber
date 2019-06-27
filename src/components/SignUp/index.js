import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { LoginLink } from '../SignIn';
import Uploader from './../Uploader';

import AlgoliaPlaces from 'algolia-places-react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignUpPage = () => (
  <Row>
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
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, location, profileUrl, passwordOne } = this.state;

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

  render() {
    const {
      username,
      email,
      profileUrl,
      location,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <div>
        <Uploader
          id='file'
          name='file'
          onChange={(file) => {
            console.log('File changed: ', file)

            if (file) {
              file.progress(info => console.log('File progress: ', info.progress))
              file.done(info => console.log('File uploaded: ', info))
            }
          }}
          onUploadComplete={info =>
            this.setState ({
              profileUrl: info.cdnUrl,
            })
          } />
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
          <Form.Group controlId="formEmail">
            <Form.Control
              name="email"
              value={email}
              onChange={this.onChange}
              type="text"
              placeholder="Email Address"
            />
          </Form.Group>
          <Form.Group controlId="formLocation">
            <AlgoliaPlaces
              placeholder='Write an address here'

              options={{
                appId: 'plMOIODNLXZ6',
                apiKey: 'b40b54304cdc5beb771d96ffc12c8cfe',
                language: 'en',
                countries: ['za'],
                type: 'address',
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
            {/* <Form.Control
              name="location"
              value={location}
              onChange={this.onChange}
              type="text"
              placeholder="Your location"
            /> */}
          </Form.Group>
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
