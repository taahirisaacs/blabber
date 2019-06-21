import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import firebase from 'firebase/app';

const INITIAL_STATE = {
  whatsapp: '',
  error: null,
};

class WhatappUpdate extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { whatsapp } = this.state;
    const user = firebase.auth().currentUser;
    const db = firebase.firestore();
    const dbUsers = db.collection("users").doc(user.uid);


    dbUsers.update({
        whatsapp
      })
    .then(authUser => {
      this.setState({ ...INITIAL_STATE });

    })
    .catch(error => {
      this.setState({ error });
    });

  event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { whatsapp, error } = this.state;

    const isInvalid =
      whatsapp === '';

    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Control
          name="whatsapp"
          value={whatsapp}
          onChange={this.onChange}
          type="number"
          placeholder="WhatsApp Number"
        />
      <Button disabled={isInvalid} type="submit" block>
          Add my WhatsApp Number
        </Button>

        {error && <p>{error.message}</p>}
      </Form>
    );
  }
}

export default withFirebase(WhatappUpdate);
