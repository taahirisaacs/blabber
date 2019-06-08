import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Uploader from './../Uploader';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Image from 'react-bootstrap/Image';

import firebase from 'firebase';
import HomePage from '../Home';

import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';

const StoresPage = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? <DescForm /> : <DescForm />
    }
  </AuthUserContext.Consumer>
);

const INITIAL_STATE = {
  loading: false,
  store: [],
  storedesc: [],
  item: [],
  description: [],
  category: [],
  price: [],
  error: null,
};

class DescForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.state = {
      stores: '',
      items: '',
      imgUrl: [],
      storeId: [],
      show: false,
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  onSubmit = event => {
    const { item, description, price, category, storeId, imgUrl } = this.state;
    const user = firebase.auth().currentUser;

      firebase.database().ref('items/users/' + user.uid).push({
          item,
          description,
          price,
          category,
          storeId,
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
    this.setState({ loading: true })
    const user = firebase.auth().currentUser;
    const blobId = this.props.match.params.uid;
    const db = firebase.database().ref(`stores/users/${user.uid}/${blobId}/`);

    db.on('value', snapshot => {
      const snap = snapshot.key;
      // const key = Object.keys(snap);
      // const custdata = snap[key];
      console.log(snap);
      this.setState({
        storesImg: snapshot.val().imgUrl,
        storesName: snapshot.val().store,
        storesDesc: snapshot.val().description,
        storesCat: snapshot.val().category,
        loading: false,
        storeId: snapshot.key,
      });
    });

         firebase.auth().onAuthStateChanged((user) => {
           if (user) {

             const storeId = this.props.match.params.uid;
             firebase.database().ref('items/users/' + user.uid).orderByChild('storeId').equalTo(`${storeId}`) //reference uid of logged in user like so
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
    const storeItem = this.state.storeId;
    const user = firebase.auth().currentUser;
    firebase.database().ref(`stores/users/${user.uid}/${storeItem}/`).off();
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

  render() {

    const {
      stores,
      items,
      storeUid,
      storesImg,
      storesName,
      storesDesc,
      storesCat,
      loading
     } = this.state;

    return (
      <Col md={{span:6, offset:3}}>
        <ul>
             <li key={storeUid} index={storeUid} className="messages" >

                <Row>
                  <Col xs sm md className="storeHeader">
                    <div className="chat">
                    <div className="storeImg">
                    <Image src={storesImg + `/-/scale_crop/500x500/center/` || "https://via.placeholder.com/150"}/>
                    </div>
                    <h2>{storesName}</h2>
                    <span className="timestamp">{storesDesc}</span>
                    <span className="cat">{storesCat}</span>
                      <Row >
                        <Col>
                          <Button variant="primary" size="sm" onClick={this.handleShow} block>
                            + Add a new item
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
             </li>
        </ul>
        <ul>
          {loading && <div style={{textAlign:`center`,}}><Spinner animation="grow" variant="light" /></div>}
          {Object.keys(items).map((key, index) => {
             return (
               <li className="messages" key={key} index={index} style={{marginBottom:`20px`,}}>
                <div className="chat">
                  <Row>
                  <Col xs={12} sm={3} md={3}>
                    <div className="itemImg">
                    <Image src={items[key].imgUrl + `/-/scale_crop/500x500/center/` || "https://via.placeholder.com/150"}/>
                    </div>
                  </Col>
                  <Col xs={12} sm={9} md={9}>
                    <h2>{items[key].item}</h2>
                    <span className="pricing">R{items[key].price}</span>
                    <span className="timestamp">{items[key].description}</span>
                    <span className="cat">{items[key].category}</span>
                  </Col>
                  </Row>
                </div>
               </li>
             );
          })}
        </ul>

    <Modal show={this.state.show} onHide={this.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create a new store</Modal.Title>
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
        <Form.Control style={{display:`none`}} name="storeId" value={this.state.storeId || ''} onChange={this.onChange} type="text" />
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
                Add Store
              </Button>
            </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      </Col>
    );
  }
}

const StoresPageForm = compose(
  withRouter,
  withFirebase,
)(DescForm);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(StoresPageForm, StoresPage);
