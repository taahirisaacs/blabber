import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';

import Linkify from 'react-linkify';
import TimeAgo from 'react-timeago';
import TextareaAutosize from 'react-autosize-textarea';
import {sortableContainer, sortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

import firebase from 'firebase';

import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

const BlobPage = () => (
  <div>
    <h1>Home</h1>
    <p>The Home Page is accessible by every signed in user.</p>
  </div>
);

const INITIAL_STATE = {
  loading: false,
  description: '',
  error: null,
};

class DescForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.state = {
      datas: '',
      data: [],
      date: [],
      dataId: [],
    };
  }

  onSubmit = event => {
    const { description } = this.state;
    const blobId = this.props.match.params.dataId;
    const user = firebase.auth().currentUser;
    const date = new Date();
    const timestamp = date.getTime();

      firebase.database().ref(`messages/users/${user.uid}/` + blobId).update({
            description
        })
      .then(authUser => {
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

  componentWillMount(){
    this.setState({ loading: true });
    const blobId = this.props.match.params.dataId;
    const user = firebase.auth().currentUser;

    firebase.database().ref(`messages/users/${user.uid}/` + blobId).on('value', snapshot => {
      const blobject = snapshot.val();
      console.log(snapshot);
      this.setState({
        datas: blobject,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    const blobId = this.props.match.params.dataId;
    const user = firebase.auth().currentUser;
    firebase.database().ref(`messages/users/${user.uid}/` + blobId).off();
  }

  render() {
    const blobId = this.props.match.params.dataId;
    console.log(this.props);
    const {
      datas,
      loading,
      date,
      description,
      message,
      error,
    } = this.state;

    const isInvalid =
      description === '';

    return (
      <Col md={{ span: 8, offset: 2 }}>

      {loading && <div style={{textAlign:`center`,}}><Spinner animation="grow" variant="light" /></div>}

      <div className="chat" style={{width:`100%`}}>
        <h6>{this.state.datas.message}</h6>
        <p>{this.state.datas.description}</p>
      </div>
      <Button className="innerBtn" onClick={this.props.history.goBack}>Back</Button>
      <div className="formhold">
        <Form className="FormInput" onSubmit={this.onSubmit}>
          <Form.Group className="messagegroup" controlid="formMessage">
            <TextareaAutosize
              as="textarea"
              rows={1}
              name="description"
              value={this.state.description || ''}
              onChange={this.onChange}
              type="text"
              placeholder="Write a blab..."
              className="messagearea"
            />
          </Form.Group>
          <Button className="chatBtn" variant="primary" disabled={isInvalid} type="submit" block>
            👉
          </Button>
          {error && <p>{error.description}</p>}
        </Form>
      </div>
    </Col>
    );
  }
}

const BlobPageForm = compose(
  withRouter,
  withFirebase,
)(DescForm);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(BlobPageForm, BlobPage);
