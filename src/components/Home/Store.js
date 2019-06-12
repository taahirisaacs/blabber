import React, { Component } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import TextareaAutosize from 'react-autosize-textarea';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Uploader from './../Uploader';
import { Link } from 'react-router-dom';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Spinner from 'react-bootstrap/Spinner';

import firebase from 'firebase';

const INITIAL_STATE = {
  store: [],
  description: [],
  category: [],
  error: null,
  loading: false,
};

class Stores extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { ...INITIAL_STATE };
    this.state = {
      stores: '',
      imgUrl: [],
      show: false,
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

  };

  onSubmit = event => {
    const { store, description, category, imgUrl } = this.state;
    const user = firebase.auth().currentUser;

      firebase.database().ref('stores/users/' + user.uid).push({
          store,
          description,
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
    this.setState({ loading: true });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.database().ref('stores/users/' + user.uid) //reference uid of logged in user like so
            .on('value', (snapshot) => {
              const storesObject = snapshot.val() || '';
              this.setState({ loading: false })
              const storesList = Object.keys(storesObject).map((key, index) => ({
                ...storesObject[key],
                uid: key,
              }));
                this.setState({
                  stores: storesList,
                })
              });
            }
         });
        }

  componentWillUnmount() {
    const user = firebase.auth().currentUser;
    firebase.database().ref(`stores/users/` + user.uid).off();
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  removeStore(key, e)  {
    const user = firebase.auth().currentUser;
    const store = this.state.stores[key].uid;
    firebase.database().ref(`stores/users/` + user.uid + `/` + store).remove();
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };


  render() {

    const {
      stores,
      loading
    } = this.state;

    const userid = firebase.auth().currentUser;

    const isInvalid =
      stores === '';

    return (
      <Col md={{span:6, offset:3}}>
        <Row className="laneTitle">
          <Col>
            <Button variant="primary" onClick={this.handleShow}>
              + Add new store
            </Button>
          </Col>
        </Row>

          {loading && <div style={{textAlign:`center`,}}><Spinner animation="grow" variant="light" /></div>}

        <ul>
          {Object.keys(stores).map((key, index) => {
             return (
               <li className="messages" key={key} index={index} style={{marginBottom:`10px`,}}>
                <div className="chat">
                  <Row>
                  <Col xs={4} sm={4} md={2}>
                    <div className="itemImg storeList">
                    <Image src={stores[key].imgUrl + `/-/scale_crop/250x250/center/`}/>
                    </div>
                  </Col>
                  <Col xs={8} sm={8} md={10} style={{ paddingLeft: `0`, paddingRight: `45px` }}>
                  <Link to={`store/${userid.uid}/${this.state.stores[key].uid}/`}>
                    <h2>{stores[key].store}</h2>
                  </Link>
                    <span className="timestamp">{stores[key].description}</span>
                    <span className="cat">{stores[key].category}</span>
                  </Col>
                  <Dropdown>
                    <Dropdown.Toggle as="span" drop="left" className="timestamp delete" id="dropdown-basic"/>
                    <Dropdown.Menu >
                      <Dropdown.Item onClick={this.removeStore.bind(this, key)}>Delete</Dropdown.Item>
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

              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Store Name</Form.Label>
                <Form.Control name="store" value={this.state.store || ''} onChange={this.onChange} type="text" placeholder="eg. Widget123" />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Label>Description</Form.Label>
                <Form.Control name="description" as="textarea" rows="3"  value={this.state.description || ''} onChange={this.onChange} type="text" placeholder="eg. Widget123" />
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
      </Col >
    );
  }
}


export default Stores;
