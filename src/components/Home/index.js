import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Link, NavLink } from 'react-router-dom';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import SwipeableViews from 'react-swipeable-views';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore, faSearch, faUserCircle, faReceipt } from '@fortawesome/free-solid-svg-icons';

import Linkify from 'react-linkify';
import TimeAgo from 'react-timeago';
import TextareaAutosize from 'react-autosize-textarea';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';


import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import firebase from 'firebase/app';

import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import Items from './Item';
import Stores from './Store';
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

  componentDidMount() {
    document.title = 'Profile';
  }

  componentWillMount(){
    this.setState({ loading: true });

    const user = firebase.auth().currentUser;
    const db = firebase.database().ref(`users/${user.uid}/`);

    db.on('value', (snapshot) => {
      const uname = snapshot.val().username;
      const ulocation = snapshot.val().location;
      this.setState({
        uname: uname,
        ulocation: ulocation,
      });

    });

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
    firebase.database().ref(`messages/users/${user.uid}`).off();
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
      uname,
      ulocation,
    } = this.state;



    const isInvalid =
      message === '';


    return (
      <Container fluid className="px-0">
        <Row className="mx-0">
          <Col xs sm md className="storeHeader">
            <div className="chat">
              <span className="storeImg">
                <img src="https://res.cloudinary.com/djqr0a74c/image/upload/v1560070682/TinyTrader/taahir_2x.890a73ff.png"/>
              </span>
              <h2>{uname}</h2>
              <p className="profileSub">{ulocation}</p>
              <NavLink to={ROUTES.SETTINGS}>
                  <Button className="navItem mt-3 mb-3 settings" size="sm" variant="secondary" block>
                Edit my profile
                </Button>
              </NavLink>
            </div>
          </Col>
        </Row>

        <Row className="tabbar mx-0">
          <Col md>
            <Tabs TabIndicatorProps={{style: {backgroundColor:`#6a7b95`}}} value={index} variant="fullWidth"  onChange={this.handleChange} >
              <Tab label="Your Items" />
              <Tab label="Your Stores" />
            </Tabs>
          </Col>
        </Row>
        <SwipeableViews index={index} onChangeIndex={this.handleChangeIndex}>

        <Row className="px-2">
          <Items />
        </Row>

          <Row className="px-2">
            <Stores />
          </Row>

        </SwipeableViews>

    </Container>
    );
  }
}

const HomePageForm = compose(
  withRouter,
  withFirebase,
)(MessageForm);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePageForm, HomePage);
