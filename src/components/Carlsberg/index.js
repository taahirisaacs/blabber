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

const CarlsSignUpPage = () => (
  <Row className="mx-0">
    <Col xs={{span:'10', offset:'1'}}>
      <h1 className="pageTitle mb-1">Who We Are</h1>
      <p className="text-center mb-2">Share your view. Tell your story.</p>
      <CarlsSignUpForm />
      <LoginLink />
    </Col>
  </Row>
);

const INITIAL_STATE = {
  username: '',
  location: '',
  profileUrl: '',
  termBoolean: '',
  videoCategory: '',
  error: null,
};

class CarlsSignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.handleChange = this.handleChange.bind(this);
  }

  onSubmit = event => {
    const { username, location, profileUrl, termBoolean } = this.state;

    const db = this.props.firebase.firestore();
    const dbCol = db.collection("videos");

    dbCol.add({
        name: username || '',
        location,
        profileUrl,
        termBoolean
      })
    .then( () => {
      this.setState({ ...INITIAL_STATE });
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

      const profileUrl = result.info.url;
      this.setState({profileUrl});
    }

    })
    widget.open();
  };

  handleChange(evt) {
    this.setState({ termBoolean: evt.target.checked });
  }

  render() {

    const {
      username,
      profileUrl,
      location,
      error,
      videoCategory,
      termBoolean
    } = this.state;

    const isInvalid =
      location === '' ||
      profileUrl === '' ||
      username === '';

    return (
      <div>

        <Form onSubmit={this.onSubmit}>
          <Form.Control style={{display:`none`}} name="profileUrl" value={this.state.profileUrl || ''} onChange={this.onChange} type="text" placeholder="profileUrl" />
          <Form.Group controlId="formUsername">
            <Form.Label>1. What's your name</Form.Label>
            <Form.Control
              name="username"
              value={username}
              onChange={this.onChange}
              type="text"
              placeholder="Required"
            />
          </Form.Group>
          <Form.Group controlId="formLocation">
            <Form.Label>2. Where are you? City/Country</Form.Label>
            <AlgoliaPlaces
              placeholder='Required'

              options={{
                appId: 'plMOIODNLXZ6',
                apiKey: 'b40b54304cdc5beb771d96ffc12c8cfe',
                language: 'en',
                type: 'city',
              }}

              onChange = {({ query, rawAnswer, suggestion, suggestionIndex }) =>
                this.setState({location: suggestion.value})
              }

            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Do you grant consent to use this video to share and promote Who We Are? <Link to="#">Details</Link></Form.Label>
            <Form.Check
              required
              name="termBoolean"
              label="Agree to terms and conditions"
              id="termBoolean"
              checked={this.state.termBoolean}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Button onClick={this.showWidget} className="VideoUploadBtn mb-4" block>
            Upload Video
          </Button>

          <Button variant="primary" disabled={isInvalid} type="submit" block>
            Send
          </Button>

          {error && <p>{error.message}</p>}
        </Form>
      </div>
    );
  }
}


const CarlsSignUpForm = compose(
  withRouter,
  withFirebase,
)(CarlsSignUpFormBase);

export default CarlsSignUpPage;

export { CarlsSignUpForm };
