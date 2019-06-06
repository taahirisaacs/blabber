import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import SwipeableViews from 'react-swipeable-views';

import Linkify from 'react-linkify';
import TimeAgo from 'react-timeago';
import TextareaAutosize from 'react-autosize-textarea';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';


import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import firebase from 'firebase';

import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import Items from './Item';
import Stores from './Store';

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

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getListStyle = isDraggingOver => ({
  listStyle: "none",
});

class MessageForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.state = {
      datas: '',
      description: '',
      data: [],
      date: [],
      dataId: [],
      show: false,
      index: 0,
    };

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);

  };


  onSubmit = event => {
    const { message, description } = this.state;
    const user = firebase.auth().currentUser;
    const date = new Date();
    const timestamp = date.getTime();

      firebase.database().ref('messages/users/' + user.uid).push({
          message,
          timestamp,
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
                      description: child.val().description,
                    });
                });
                this.setState({
                  datas: datasUpdate,
                });
              });
            }
         });
        }

  componentWillUnmount() {
    const user = firebase.auth().currentUser;
    firebase.database().ref(`messages/users/` + user.uid).off();
  }

    onDragEnd(result) {
     // dropped outside the list
     if (!result.destination) {
       return;
     }

     const datas = reorder(
       this.state.datas,
       result.source.index,
       result.destination.index
     );

     this.setState({
       datas
     });
   }

  removeItem(key, e)  {
    const user = firebase.auth().currentUser;
    const item = this.state.datas[key].dataId;
    firebase.database().ref(`messages/users/` + user.uid + `/` + item).remove();
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleChange = (event, value) => {
    this.setState({
      index: value,
    });
  };

  handleChangeIndex = index => {
    this.setState({
      index,
    });
  };

  render() {

    const {
      datas,
      loading,
      message,
      error,
      index,
    } = this.state;



    const isInvalid =
      message === '';

    return (
      <div>
        <Row className="tabbar">
          <Col md={{span:6, offset:3,}}>
            <Tabs TabIndicatorProps={{style: {backgroundColor:`#6a7b95`}}} value={index} variant="fullWidth" onChange={this.handleChange} >
              <Tab label="🛍 Store" />
              <Tab label="📦 Items" />
              <Tab label="🧾 Orders" />
              <Tab label="✍🏼 Notes" />
            </Tabs>
          </Col>
        </Row>
        <SwipeableViews index={index} onChangeIndex={this.handleChangeIndex}>

          <Row>
            <Stores />
          </Row>

          <Row>
            <Items />
          </Row>

          <Row>
            <Col md={{span:6, offset:3}}>
              Orders
            </Col>
          </Row>

            <Row>

              <Col md={{span:6, offset:3}}>
                <Row className="laneTitle">
                  <Col>
                    <Button variant="primary" onClick={this.handleShow}>
                      New Note
                    </Button>
                  </Col>
                </Row>
              {loading && <div style={{textAlign:`center`,}}><Spinner animation="grow" variant="light" /></div>}
              <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <ul {...provided.droppableProps} ref={ provided.innerRef } style={getListStyle(snapshot.isDraggingOver)} >
                      {Object.keys(this.state.datas).map((key, index) => (
                        <Draggable key={key} draggableId={key} index={index}>
                          {(provided, snapshot) => (
                            <li
                              className="messages"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                                <div key={key} className="notes">
                                  <Link style={{display:`inline-block`, height:`100%`,}} to={`/blob/${this.state.datas[key].dataId}/`}>
                                    <span className="linkArea">
                                      <p>{this.state.datas[key].data}</p>
                                        <span className="timestamp">
                                          <TimeAgo date={this.state.datas[key].date}/>
                                       </span>
                                    </span>
                                  </Link>
                                  <Dropdown>
                                    <Dropdown.Toggle as="span" drop="up" className="timestamp delete" id="dropdown-basic"/>
                                    <Dropdown.Menu >
                                      <Dropdown.Item onClick={this.removeItem.bind(this, key)}>Delete</Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>

              <Modal show={this.state.show} onHide={this.handleClose}>

                <Form className="FormInput" onSubmit={this.onSubmit}>

                  <Modal.Header closeButton>
                    <Modal.Title>Add a Note</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                    <Form.Group controlid="formMessage">
                      <TextareaAutosize
                        as="textarea"
                        rows={3}
                        name="message"
                        value={this.state.message || ''}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Write a new note"
                      />
                    </Form.Group>
                  </Modal.Body>
                  <Modal.Footer >
                    <Button variant="secondary" onClick={this.handleClose}>
                      Close
                    </Button>
                    <Button onClick={this.handleClose} variant="primary" disabled={isInvalid} type="submit" block>
                      Add new note
                    </Button>
                    {error && <p>{error.message}</p>}
                  </Modal.Footer>

                </Form>

              </Modal>

            </Col >
          </Row>
        </SwipeableViews>
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
