import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import TextareaAutosize from 'react-autosize-textarea';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Uploader from './../Uploader';


import * as ROUTES from '../../constants/routes';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import firebase from 'firebase';

const INITIAL_STATE = {
  item: [],
  description: [],
  category: [],
  price: [],
  error: null,
};

class Items extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { ...INITIAL_STATE };
    this.state = {
      loading: false,
      items: '',
      imgUrl: [],
      show: false,
    };

  };

  onSubmit = event => {
    const { item, description, price, category, imgUrl } = this.state;
    const user = firebase.auth().currentUser;

      firebase.database().ref('items/users/' + user.uid).push({
          item,
          description,
          price,
          category,
          imgUrl
        })
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });

      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  }

  componentWillMount(){

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.database().ref('items/users/' + user.uid) //reference uid of logged in user like so
            .on('value', (snapshot) => {
              const itemsObject = snapshot.val() || '';
              this.setState({ loading: false })
              const itemsList = Object.keys(itemsObject).map((key, index) => ({
                ...itemsObject[key],
                uid: key,
              }));
                this.setState({
                  items: itemsList,
                })
              });
            }
         });
        }

  componentWillUnmount() {
    const user = firebase.auth().currentUser;
    firebase.database().ref(`items/users/` + user.uid).off();
  }

  removeItem(key, e)  {
    const user = firebase.auth().currentUser;
    const item = this.state.items[key].uid;
    firebase.database().ref(`items/users/` + user.uid + `/` + item).remove();
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };


  render() {

    const { items } = this.state;

    return (
      <Col md={{span:6, offset:3}}>
        <Row className="laneTitle">
          <Col>
            <NavLink as="button" to={ROUTES.NEWITEM}>
                <Button>+ Add new item</Button>
          </NavLink>
          </Col>
        </Row>
        <ul>
          {Object.keys(items).map((key, index) => {
             return (
               <li className="messages" key={key} index={index}>
                <div className="chat">
                  <Row>
                  <Col xs={4} sm={3} md={3}>
                    <div className="itemImg">
                    <Image src={items[key].imgUrl + `/-/scale_crop/500x500/center/` || "https://via.placeholder.com/150"}/>
                    </div>
                  </Col>
                  <Col xs={8} sm={9} md={9} style={{ paddingLeft: `0`, paddingRight: `40px` }}>
                    <h2>{items[key].item}</h2>
                    <span className="pricing">R{items[key].price}</span>
                    <span className="timestamp">{items[key].description}</span>
                    <span className="cat">{items[key].category}</span>
                  </Col>
                  <Dropdown>
                    <Dropdown.Toggle as="span" drop="left" className="timestamp delete" id="dropdown-basic"/>
                    <Dropdown.Menu >
                      <Dropdown.Item onClick={this.removeItem.bind(this, key)}>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  </Row>
                </div>
               </li>
             );
          })}
        </ul>
      </Col >
    );
  }
}


export default Items;
