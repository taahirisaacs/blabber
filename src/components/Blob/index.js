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
import HomePage from '../Home';

import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';

const BlobPage = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? <DescForm /> : <DescFormNon />
    }
  </AuthUserContext.Consumer>
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
      descr: '',
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

    const db = firebase.database().ref(`messages/users/${user.uid}/${blobId}`);

    db.on('value', snapshot => {
      console.log(snapshot.val());
      this.setState({
        descr: snapshot.val().description,
        message: snapshot.val().message,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    const blobId = this.props.match.params.dataId;
    const user = firebase.auth().currentUser;
    firebase.database().ref(`messages/users/${user.uid}/${blobId}`).off();
  }

  render() {
    const {
      datas,
      loading,
      date,
      description,
      descr,
      message,
      error,
    } = this.state;
    console.log(datas)

    const isInvalid =
      description === '';

    return (
      <Col md={12}>

      {loading && <div style={{textAlign:`center`,}}><Spinner animation="grow" variant="light" /></div>}


      <h1 className="innerTitle">{message}</h1>
      <div className="chat" style={{width:`100%`,}}>
          <p>{descr}</p>
      </div>

      <Button className="innerBtn" onClick={this.props.history.goBack}>Back</Button>

      <div className="formhold">
        <Form className="FormInput" onSubmit={this.onSubmit}>
          <Form.Group className="messagegroup" controlid="formMessage">
            <TextareaAutosize
              as="textarea"
              rows={1}
              name="description"
              value={description || ''}
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

class DescFormNon extends Component {
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

    const db = firebase.database().ref(`messages/users/${user.uid}/${blobId}`);

    db.on('value', snapshot => {
      console.log(snapshot.val());
      this.setState({
        description: snapshot.val().description,
        message: snapshot.val().message,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    const blobId = this.props.match.params.dataId;
    const user = firebase.auth().currentUser;
    firebase.database().ref(`messages/users/${user.uid}/${blobId}`).off();
  }

  render() {
    const {
      datas,
      loading,
      date,
      description,
      message,
      error,
    } = this.state;
    console.log(datas)

    const isInvalid =
      description === '';

    return (
      <Col md={12}>

      {loading && <div style={{textAlign:`center`,}}><Spinner animation="grow" variant="light" /></div>}

      <div className="chat" style={{width:`100%`,}}>
        <span>
          <h4>{message}</h4>
          <p>{description}</p>
        </span>
      </div>

      <Button className="innerBtn" onClick={this.props.history.goBack}>Back</Button>

    </Col>
    );
  }
}

const BlobPageForm = compose(
  withRouter,
  withFirebase,
)(DescForm, DescFormNon);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(BlobPageForm, BlobPage);
