import React, { Component } from 'react';

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
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

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
              // console.log(itemsObject);
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

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
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
            <Button variant="primary" onClick={this.handleShow}>
              Add New Item
            </Button>
          </Col>
        </Row>
        <ul>
          {Object.keys(items).map((key, index) => {
             return (
               <li className="messages" key={key} index={index} style={{marginBottom:`10px`,}}>
                <div className="chat">
                  <Row>
                  <Col xs={4} sm={3} md={3}>
                    <div className="itemImg">
                    <Image src={items[key].imgUrl + `/-/scale_crop/250x250/center/` || "https://via.placeholder.com/150"}/>
                    </div>
                  </Col>
                  <Col xs={8} sm={9} md={9}>
                    <h2>{items[key].item}</h2>
                    <span className="timestamp">{items[key].description}</span>
                    <span className="pricing">R{items[key].price}</span>
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

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Item</Modal.Title>
          </Modal.Header>

          <Modal.Body>
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
                <Form.Label>Item Name</Form.Label>
                <Form.Control name="item" value={this.state.item || ''} onChange={this.onChange} type="text" placeholder="eg. Widget123" />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Label>Description</Form.Label>
                <Form.Control name="description" as="textarea" rows="3"  value={this.state.description || ''} onChange={this.onChange} type="text" placeholder="eg. Widget123" />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput3">
                <Form.Label>Price</Form.Label>
                <Form.Control name="price"  value={this.state.price || ''} onChange={this.onChange} type="number" min="0.00" step="any" placeholder="100.00" />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Select a category</Form.Label>
                <Form.Control as="select" name="category" value={this.state.category || ''} onChange={this.onChange}>
                  <option>Select a Category</option>
                  <option>👕 Clothing</option>
                  <option>👟 Sneakers</option>
                  <option>🍔 Food</option>
                  <option>💻 Electronics</option>
                  <option>📦 2nd Hand Goods</option>
                </Form.Control>
              </Form.Group>
              <Modal.Footer >
                <Button variant="secondary" onClick={this.handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={this.handleClose} type="submit">
                  Add Item
                </Button>
              </Modal.Footer>
              </Form>
          </Modal.Body>
        </Modal>
      </Col >
    );
  }
}


export default Items;
