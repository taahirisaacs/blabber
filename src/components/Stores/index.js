import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';
import Uploader from './../Uploader';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Image from 'react-bootstrap/Image';
import shortid from 'shortid';
import FooterNavigation from '../Navigation/footer';

import firebase from 'firebase/app';
import HomePage from '../Home';

import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';

const INITIAL_STATE = {
  loading: false,
  store: [],
  storedesc: [],
  name: '',
  description: '',
  category: '',
  cta: '',
  price: '',
  error: null,
  copied: false,
};

class StoresPageAuth extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.state = {
      stores: '',
      items: '',
      imgUrl: '',
      storeId: [],
      storeName: [],
      show: false,
      storeUrl: window.location.href,
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  onSubmit = event => {
    const { name, description, price, category, storeId, storeName, imgUrl, cta } = this.state;
    const user = firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    const itemUid = shortid.generate();
    const timestamp = Date.now();

      db.collection("items").add({
            name: name || '',
            description: description || '',
            price: price || '',
            category: category || '',
            cta: cta || '',
            imgUrl: imgUrl || '',
            store: { id: storeId || '', name: storeName || ''},
            user: user || '',
            itemId: itemUid || '',
            timestamp: timestamp
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
    this.setState({ loading: true })
    const user = firebase.auth().currentUser.uid;
    const docId = this.props.match.params.uid;
    const db = firebase.firestore();
    const dbCol = db.collection("stores").doc(docId);

    this.unsubscribe = dbCol.onSnapshot(snap => {
      this.setState({
        stores: snap.data(),
        storeId: snap.id,
        storeName: snap.data().name,
        loading: false,
      });

    });

    const dbItems = db.collection("items");
    const dbItemquery = dbItems.where("store.id", "==", docId);

    this.unsubscribe = dbItemquery.onSnapshot(snap => {
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

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeOptions = event => {
    this.setState({ [event.target.name]: event.target.value});
    this.setState({ storeName: event.target.options[event.target.selectedIndex].text});
  };

  render() {

    const {
      stores,
      items,
      storeId,
      storeName,
      loading
     } = this.state;
     const itemUrl = window.location.href;
     const user = firebase.auth().currentUser;
     console.log(storeId);

    return (
      <Col md={{span:6, offset:3}}>
        <ul>
          <li key={stores.id} index={stores.id} className="messages" >

            <Row>
              <Col xs sm md className="storeHeader">
                <div className="chat">
                  <div className="storeImg">
                    <Image src={stores.imgUrl + `/-/scale_crop/500x500/center/`}/>
                  </div>
                  <h2>{stores.name}</h2>
                  <span className="timestamp">{stores.description || ''}</span>
                  <span className="cat">{stores.category || ''}</span>
                  <Row >
                    <Col>
                      <Button className="storebtn" onClick={this.handleShow} block>
                        + Add a new item
                      </Button>
                      <CopyToClipboard block className="storebtn copy_link" text={`${itemUrl}`} onCopy={() => this.setState({copied: true})}>
                        <Button>{this.state.copied ? <span>Copied.</span> : <span>Copy Link URL</span>}</Button>
                      </CopyToClipboard>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </li>
        </ul>
        <ul style={{marginBottom:`100px`,}}>
          {loading && <div style={{textAlign:`center`,}}><Spinner animation="grow" variant="light" /></div>}
          {Object.keys(items).map((key, index) => {
            return (
              <li className="messages" key={key} index={index}>
                <div className="chat">
                  <Link to={`/items/${items[key].store.id}/${items[key].itemId}`}>
                    <Row>
                      <Col xs={4} sm={3} md={3}>
                        <div className="itemImg">
                          <Image src={items[key].imgUrl + `/-/scale_crop/500x500/center/`}/>
                        </div>
                      </Col>
                      <Col xs={8} sm={9} md={9} style={{ paddingLeft: `0`, paddingRight: `40px` }}>
                        <h2>{items[key].name}</h2>
                        <span className="pricing">R{items[key].price}</span>
                        <span className="timestamp desc">{items[key].description}</span>
                      </Col>
                    </Row>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add an item</Modal.Title>
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
              <Form.Control style={{display:`none`}} name="storeId" value={storeId || ''} onChange={this.onChange} type="text" />
              <Form.Control style={{display:`none`}} name="storeName" value={storeName || ''} onChange={this.onChange} type="text" />
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Item Name</Form.Label>
                <Form.Control name="name" value={this.state.name || ''} onChange={this.onChange} type="text" placeholder="Item name" />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Control name="description" as="textarea" rows="3"  value={this.state.description || ''} onChange={this.onChange} type="text" placeholder="Description..." />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput3">
                <Form.Label>Price</Form.Label>
                <Form.Control name="price"  value={this.state.price || ''} onChange={this.onChange} type="number" pattern="[0-9]*" placeholder="100.00" />
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
                  <option>Select a button</option>
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
        <FooterNavigation />
      </Col>
    );
  }
}

const StoresPageForm = compose(
  withRouter,
  withFirebase,
)(StoresPageAuth);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(StoresPageForm, StoresPageAuth);
