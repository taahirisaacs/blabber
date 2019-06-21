import React, { Component } from 'react';
import { AuthUserContext, withAuthorization } from '../Session';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import TextareaAutosize from 'react-autosize-textarea';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import Uploader from './../Uploader';
import shortid from 'shortid';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import * as ROUTES from '../../constants/routes';
import firebase from 'firebase';
import firestore from "firebase/firestore";

const INITIAL_STATE = {
  name: [],
  description: [],
  category: [],
  price: [],
  cta: [],
  storeId: [],
  userId: [],
  error: null,
};

class NewItem extends Component {

constructor(props, context) {
  super(props, context);

  this.state = { ...INITIAL_STATE };
  this.state = {
    loading: false,
    items: '',
    stores: '',
    imgUrl: [],
    show: false,
  };
};

onSubmit = event => {
  const { name, description, price, category, imgUrl, storeId, cta } = this.state;
  const user = firebase.auth().currentUser;
  const db = firebase.firestore();
  const itemUid = shortid.generate();

  db.collection("items").add({
          name,
          description,
          price,
          category,
          cta,
          imgUrl,
          store: storeId || null,
          user: user.uid,
          itemId: itemUid
      })
      .then(authUser => {
          console.log("Document written with ID: ", authUser.id);
          this.setState({ ...INITIAL_STATE });
          this.props.history.push(ROUTES.HOME);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });

  event.preventDefault();
}

componentDidMount() {
  document.title = 'Add New Item';
}

componentWillMount(){
       const user = firebase.auth().currentUser.uid;
       const db = firebase.firestore();
       const dbCol = db.collection("stores");
       const dbquery = dbCol.where("user", "==", user);

       dbquery.onSnapshot(snap => {
         const stores = {}
         snap.forEach(store => {
          stores[store.id] =  store.data()
         })
           this.setState({stores})
         })

}

componentWillUnmount() {
  const user = firebase.auth().currentUser;
  firebase.database().ref(`items/users/` + user.uid).off();
  firebase.database().ref(`stores/users/${user.uid}/`).off();
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

  const { stores, imgUrl } = this.state;
  const uploadedImg = `${imgUrl}/-/scale_crop/500x500/center/`;

  return (
    <Col md={{span:6, offset:3}} className="newitemform">
      <span className="uploadImg">
        <img src={uploadedImg}></img>
      </span>
      <Uploader
        id='file'
        name='file'
        onChange={(file) => {
          console.log('File changed: ', file)

          if (file) {
            file.progress(info => console.log('File progress: ', info.progress))
            file.done(info => console.log('File uploaded: ', info))
          }
        }}
        onUploadComplete={info =>
          this.setState ({
              imgUrl: info.cdnUrl,
          })
        } />
      <Form className="FormInput" onSubmit={this.onSubmit}>
        <Form.Control style={{display:`none`}} name="imgurl" value={this.state.imgUrl || ''} onChange={this.onChange} type="text" placeholder="imgUrl" />


        <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={this.state.name || ''} onChange={this.onChange} type="text" placeholder="Item name" />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlInput2">
              <Form.Control name="description" as="textarea" rows="3"  value={this.state.description || ''} onChange={this.onChange} type="text" placeholder="Description" />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect2">
              <Form.Label>Select a Store</Form.Label>
              <Form.Control as="select" name="storeId" value={this.state.storeId || ''} onChange={this.onChange}>
                <option>Select a Store</option>
                {Object.keys(stores).map((store, index) => {
                  return (
                    <option key={store} index={index} value={store}>{stores[store].name}</option>
                    );
                  }
                )}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlInput3">
              <Form.Label>Price</Form.Label>
              <Form.Control name="price"  value={this.state.price || ''} onChange={this.onChange} type="number" pattern="[0-9]*" />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Select a category</Form.Label>
              <Form.Control as="select" name="category" value={this.state.category || ''} onChange={this.onChange}>
                <option>Select a Category</option>
                <option>👕 Clothing</option>
                <option>👟 Shoes</option>
                <option>🍔 Food</option>
                <option>💻 Electronics</option>
                <option>🚗 Cars</option>
                <option>🚚 Logistics</option>
                <option>📦 2nd Hand Goods</option>
                <option>💅🏼 Salon</option>
                <option>💇🏼‍♂️ Barber</option>
                <option>🧹 Cleaning</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect12">
              <Form.Label>Select your item button</Form.Label>
              <Form.Control as="select" name="cta" value={this.state.cta || ''} onChange={this.onChange}>
                <option>Select item button</option>
                <option>Message Me</option>
                <option>Make an offer</option>
                <option>Order</option>
                <option>Pre-Order</option>
                <option>Make a booking</option>
                <option>Book now</option>
                <option>Book a test drive</option>
                <option>Reserve</option>
                <option>RSVP</option>
                <option>Request a quote</option>
              </Form.Control>
            </Form.Group>
              <Button variant="primary" onClick={this.handleClose} type="submit" block>
                Add Item
              </Button>
            </Form>
    </Col >
  );
}
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(NewItem);
