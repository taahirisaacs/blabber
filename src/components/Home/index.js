import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
    };

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

  render() {
    const dataz = this.props;
    console.log(dataz)

    const {
      datas,
      loading,
      message,
      error,
    } = this.state;



    const isInvalid =
      message === '';

    return (
      <div>
      {loading && <div style={{textAlign:`center`,}}><Spinner animation="grow" variant="light" /></div>}

      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <ul {...provided.droppableProps} ref={ provided.innerRef } style={getListStyle(snapshot.isDraggingOver)} >
              {Object.keys(this.state.datas).map((key, index) => (
                <Draggable key={key} draggableId={key} index={index}>
                  {(provided, snapshot) => (
                    <Link to={`/blob/${this.state.datas[key].dataId}/`}><li
                      className="messages"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >

                        <div key={key} className="chat">

                            <p><Linkify >{this.state.datas[key].data}</Linkify></p>

                        <span className="info">
                          <span className="timestamp tag">
                          ✍🏼 Notes
                         </span>
                           <span className="timestamp">
                             <TimeAgo date={this.state.datas[key].date}/>
                          </span>
                        </span>

                      </div>

                    </li>
                    </Link>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

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
            👉🏻
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
