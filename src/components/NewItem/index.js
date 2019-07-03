import React, { Component } from 'react';
import { AuthUserContext, withAuthorization } from '../Session';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Uploader from './../Uploader';
import shortid from 'shortid';
import FooterNavigation from '../Navigation/footer';

import * as ROUTES from '../../constants/routes';
import firebase from 'firebase/app';

const INITIAL_STATE = {
  name: [],
  description: [],
  category: [],
  price: [],
  cta: [],
  storeId: [],
  storeName: [],
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
    imgUrl: '',
    show: false,
  };
};



onSubmit = event => {
  const { name, description, price, category, imgUrl, storeId, storeName, cta } = this.state;
  const user = firebase.auth().currentUser;
  const db = firebase.firestore();
  const itemUid = shortid.generate();
  const timestamp = firebase.firestore.FieldValue.serverTimestamp();

  db.collection("items").add({
          name: name || '',
          description: description || '',
          price: price || '',
          category: category || '',
          cta: cta || '',
          imgUrl: imgUrl || '',
          store: { id: storeId || '', name: storeName || ''},
          user: user.uid,
          itemId: itemUid,
          timestamp: timestamp
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
  this.setState({ [event.target.name]: event.target.value});
};

onChangeOptions = event => {
  this.setState({ [event.target.name]: event.target.value});
  this.setState({ storeName: event.target.options[event.target.selectedIndex].text});
};


render() {

  const { stores, storeName, imgUrl } = this.state;
  const uploadedImg = `${imgUrl}/-/scale_crop/500x500/center/`;
  console.log(storeName);

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
          <Form.Control as="select" name="storeId" value={this.state.storeId || ''} store="storeName" storename={this.state.storeName || ''} onChange={this.onChangeOptions}>
            <option>Select a Store</option>
            {Object.keys(stores).map((store, index) => {
              return (
                <option key={store} index={index} value={store} storename={stores[store].name}>{stores[store].name}</option>
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
            <option>⚙️ Services</option>
            <option>🚚 Logistics</option>
            <option>📦 2nd Hand Goods</option>
            <option>💅🏼 Salon</option>
            <option>💇🏼‍♂️ Barber</option>
            <option>🧹 Cleaning</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect12">
          <Form.Label>Select your contact button</Form.Label>
          <Form.Control as="select" name="cta" value={this.state.cta || ''} onChange={this.onChange}>
            <option>Select contact button</option>
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
      <FooterNavigation />
    </Col>
  );
}
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(NewItem);
