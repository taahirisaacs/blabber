import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import TextareaAutosize from 'react-autosize-textarea';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Uploader from './../Uploader';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import * as ROUTES from '../../constants/routes';

import firebase from 'firebase/app';
import firstore from 'firebase/firestore';

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

    this.removeItem = this.removeItem.bind(this);

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
    const user = firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    const dbCol = db.collection("items");
    const dbquery = dbCol.where("user", "==", user);

    this.unsubscribe = dbquery.onSnapshot(snap => {
    const items = {}
    snap.forEach(item => {
     items[item.id] =  item.data()
    })
      this.setState({items})
    })

  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  removeItem(item, e) {
    const db = firebase.firestore();
    const itemkey = item;
    db.collection("items").doc(itemkey).delete();
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };


  render() {

    const { items } = this.state;
    const user = firebase.auth().currentUser;

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
          {Object.keys(items).map((item, index) => {
            return (
              <li className="messages" key={item} index={index}>
                <div className="chat">

                  <Row>
                    <Col xs={4} sm={3} md={3}>
                      <div className="itemImg">
                        {items[item].imgUrl && <Image src={items[item].imgUrl + `/-/scale_crop/500x500/center/` || ''}/>}
                      </div>
                    </Col>
                    <Col xs={8} sm={9} md={9} style={{ paddingLeft: `0`, paddingRight: `40px` }}>
                      <Link to={`/items/${items[item].store}/${items[item].itemId}`}>
                        <h2>{items[item].name}</h2>
                        <span className="pricing">R{items[item].price}</span>
                        <span className="timestamp desc">{items[item].description}</span>
                       </Link>
                     </Col>

                     <Dropdown>
                       <Dropdown.Toggle as="span" drop="left" className="timestamp delete" id="dropdown-basic"/>
                       <Dropdown.Menu >
                         <Dropdown.Item onClick={this.removeItem.bind(this, item)}>Delete</Dropdown.Item>
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
