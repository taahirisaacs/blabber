import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

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

  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.database().ref('messages/users/' + user.uid) //reference uid of logged in user like so
            .on('value', (snapshot) => {
              console.log(snapshot);
              snapshot.forEach(child =>{
                  this.setState({
                    dataId: this.state.dataId.concat([child.val().timestamp]),
                    data: this.state.data.concat([child.val().message])
                  })
              });
            })
      }
   });
  }

  render() {

    const {
      message,
      error,
    } = this.state;

    const isInvalid =
      message === '';

    const messageList = this.state.dataId.map((dataList, index) =>

        <li className="messages">
          <p>{this.state.data[index]}</p>
             <span className="timestamp">
               {new Intl.DateTimeFormat('en-GB', {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                year: 'numeric',
                month: 'long',
                day: '2-digit'
              }).format(dataList)}
            </span>
        </li>
     );

    return (
      <div>
      <ul>{messageList}</ul>
      <Form className="FormInput" onSubmit={this.onSubmit}>
        <InputGroup controlId="formMessage">
          <Form.Control
            name="message"
            value={message}
            onChange={this.onChange}
            type="text"
            placeholder="Write a blab..."
          />
        <InputGroup.Append>
          <Button variant="primary" disabled={isInvalid} type="submit" block>
            Blabber
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
