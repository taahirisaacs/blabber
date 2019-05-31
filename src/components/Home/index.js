import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import Linkify from 'react-linkify';
import TimeAgo from 'react-timeago';
import TextareaAutosize from 'react-autosize-textarea';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import firebase from 'firebase';

import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

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
    firebase.database().ref('messages/users/').off('value');
  }

  removeItem(key, e)  {
    const user = firebase.auth().currentUser;
    const item = this.state.datas[key].dataId;
    firebase.database().ref(`messages/users/` + user.uid + `/` + item).remove();
  }

  render() {

    const {
      loading,
      message,
      error,
    } = this.state;

    const isInvalid =
      message === '';

    const messageList = Object.keys(this.state.datas).map((key, index) =>
          <li key={key} className="messages">
            <Linkify>
            <p className="chat">{this.state.datas[key].data}
              <span className="info">
                 <span className="timestamp">
                   <TimeAgo date={this.state.datas[key].date}/>
                </span>
                <span className="timestamp delete" onClick={this.removeItem.bind(this, key)}>Delete</span>
              </span>
            </p></Linkify>

        </li>
     );

    return (
      <div>
      {loading && <div style={{textAlign:`center`,}}><Spinner animation="grow" variant="light" /></div>}
      <ul>{messageList}</ul>
      <div className="formhold">
        <Form className="FormInput" onSubmit={this.onSubmit}>
          <Form.Group className="messagegroup" controlid="formMessage">
            <TextareaAutosize
              as="textarea"
              rows={1}
              name="message"
              value={this.state.message || ''}
              onChange={this.onChange}
              type="text"
              placeholder="Write a blab..."
              className="messagearea"
            />
          </Form.Group>
          <Button className="chatBtn" variant="primary" disabled={isInvalid} type="submit" block>
            👉
          </Button>
          {error && <p>{error.message}</p>}
        </Form>
      </div>
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
