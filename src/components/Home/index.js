import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';

import firebase from 'firebase';

import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const HomePage = () => (
  <div>
    <h1>Home</h1>
    <p>The Home Page is accessible by every signed in user.</p>
  </div>
);

const INITIAL_STATE = {
  loading: false,
  message: '',
  error: null,
};

class MessageForm extends Component {
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
    const { message } = this.state;
    const user = firebase.auth().currentUser;
    const date = new Date();
    const timestamp = date.getTime();

      firebase.database().ref('messages/users/' + user.uid).push({
          message,
          timestamp
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

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.database().ref('messages/users/' + user.uid) //reference uid of logged in user like so
            .on('value', (snapshot) => {
              var datasUpdate = [];
              this.setState({ loading: false })
              snapshot.forEach((child) =>{
                  datasUpdate.push({
                    dataId: child.key,
                    date: child.val().timestamp,
                    data: child.val().message,
                  });
              });
              this.setState({
                datas: datasUpdate,
              });
              console.log(this.state.datas);
            })
      }

   });
  }

  componentWillUnmount() {
    const user = firebase.auth().currentUser;
    firebase.database().ref('messages/users/' + user.uid).off('value');
  }

  removeItem(key, e)  {
    const user = firebase.auth().currentUser;
    const item = this.state.datas[key].dataId;
    firebase.database().ref(`messages/users/` + user.uid + `/` + item).remove();
  }

  render() {

    const {
      datas,
      loading,
      message,
      error,
    } = this.state;

    const isInvalid =
      message === '';

    const messageList = Object.keys(this.state.datas).map((key, index) =>

        <li key={key} className="messages">
          <p className="chat">{this.state.datas[key].data} <button className="mesDel" onClick={this.removeItem.bind(this, key)}>X</button></p>
             <span className="timestamp">
               {new Intl.DateTimeFormat('en-GB', {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                year: 'numeric',
                month: 'long',
                day: '2-digit'
              }).format(this.state.datas[key].date)}
            </span>
        </li>
     );

    return (
      <div>
      {loading && <div style={{textAlign:`center`,}}><Spinner animation="grow" variant="light" /></div>}
      <ul>{messageList}</ul>
      <Form className="FormInput" onSubmit={this.onSubmit}>
        <InputGroup controlid="formMessage">
          <Form.Control
            name="message"
            value={message}
            onChange={this.onChange}
            type="text"
            placeholder="Write a blab..."
          />
        <InputGroup.Append>
          <Button className="chatBtn" variant="primary" disabled={isInvalid} type="submit" block>
            👉
          </Button>
        </InputGroup.Append>
        </InputGroup>
        {error && <p>{error.message}</p>}
      </Form>
    </div>
    );
  }
}

const HomePageForm = compose(
  withRouter,
  withFirebase,
)(MessageForm);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePageForm, HomePage);
