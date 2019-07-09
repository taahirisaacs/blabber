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

const VideoPage = () => (
  <Row className="mx-0">
    <Col xs={{span:'10', offset:'1'}}>
      <h1 className="pageTitle mb-1">Who We Are</h1>
      <p className="text-center mb-2">Share your view. Tell your story.</p>
      <VideoForm />
    </Col>
  </Row>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  location: '',
  profileUrl: '',
  imgUrl: '',
  error: null,
  checkboxChecked: false,
};

class VideoFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.handleChange = this.handleChange.bind(this);
  }

  onSubmit = event => {
    const { username, profileUrl, location, checkboxChecked } = this.state;

    const db = firebase.firestore();
    const dbCol = db.collection("videos");

      dbCol.add({
          name: username || '',
          location: location || '',
          video: profileUrl || '',
          termsChecked: checkboxChecked
        })
      .then( () => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  }

  componentDidMount() {
    document.title = "Carlsberg Video Uploader"
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
      console.log(result.info);
      const profileUrl = result.info.url;
      const imgUrl = result.thumbnail_url;
      this.setState({profileUrl, imgUrl});
    }

    })
    widget.open();
  };

  handleChange(evt) {
   this.setState({ checkboxChecked: evt.target.checked });
 }


  render() {

    const {
      username,
      location,
      error,
      storeWhatsapp,
      storeName,
      storeCategory,
      profileUrl,
      imgUrl,
      checkboxChecked
    } = this.state;

    const isInvalid =
      location === '' ||
      profileUrl === '' ||
      checkboxChecked === '' ||
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

              onChange={({ query, rawAnswer, suggestion, suggestionIndex }) =>
                this.setState({ location: suggestion.value }) }

            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Do you grant consent to use this video to share and promote Who We Are? <Link to="/">Details</Link></Form.Label>
            <Form.Check
              name="checkboxChecked"
              label="Agree to terms and conditions"
              id="checkboxChecked"
              checked={this.state.checkboxChecked}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Image src={imgUrl} fluid/>
          <Button onClick={this.showWidget} className="VideoUploadBtn mb-4" block>
            Upload Video
          </Button>
          <Form.Control style={{display:`none`}} name="profileUrl" value={this.state.profileUrl || ''} onChange={this.onChange} type="text" placeholder="profileUrl" />

          <Button variant="primary" disabled={isInvalid} type="submit" block>
            Send
          </Button>

          {error && <p>{error.message}</p>}
        </Form>
      </div>
    );
  }
}



const VideoForm = compose(
  withRouter,
  withFirebase,
)(VideoFormBase);

export default VideoPage;

export { VideoForm };
