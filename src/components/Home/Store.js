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
import TextTruncate from 'react-text-truncate';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Spinner from 'react-bootstrap/Spinner';

import firebase from 'firebase/app';

const INITIAL_STATE = {
  name: [],
  description: [],
  whatsapp: [],
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
      userStore: '',
      imgUrl: '',
      show: false,
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.removeStore = this.removeStore.bind(this);

  };

  onSubmit = event => {
    const { name, description, whatsapp, category, imgUrl } = this.state;
    const user = firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    const dbCol = db.collection("stores");

      dbCol.add({
          name: name || '',
          description: description || '',
          whatsapp: whatsapp || '',
          category: category || '',
          imgUrl: imgUrl || 'https://via.placeholder.com/150/c9d2df/000000?text=TINYTRADER.CO.ZA',
          user: user || ''
        })
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });

      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  }

  componentDidMount(){
    this.setState({ loading: true });
    const user = firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    const dbCol = db.collection("stores");
    const dbquery = dbCol.where("user", "==", user);
    const dbUser = db.collection("users");
    const dbUserquery = dbUser.where("store.user", "==", user);

    this.unsubscribe = dbquery.onSnapshot(snap => {
      const stores = {}
      snap.forEach(store => {
       stores[store.id] =  store.data()
      })
        this.setState({stores, loading: false})
      })

      this.unsubscribe = dbUserquery.onSnapshot(snap => {
        const userStore = {}
        snap.forEach(store => {
         userStore[store.id] =  store.data()
        })
          this.setState({userStore, loading: false})
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

  removeStore(key, e)  {
    const db = firebase.firestore();
    const storekey = key;
    db.collection("stores").doc(storekey).delete();
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };


  render() {

    const {
      stores,
      userStore,
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
                        <Image src={stores[key].imgUrl}/>
                      </div>
                    </Col>
                    <Col xs={8} sm={8} md={10} style={{ paddingLeft: `0`}}>
                      <Link to={{ pathname:`store/${userid.uid}/${[key]}`, state:{userkey: `${stores[key].user}`} }}>
                        <h2>{stores[key].name}</h2>
                        <TextTruncate
                          className="timestamp"
                          line={1}
                          truncateText="…"
                          text={stores[key].description}
                        />
                        <span className="cat">{stores[key].category}</span>
                      </Link>
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

              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Store Name</Form.Label>
                <Form.Control name="name" value={this.state.name || ''} onChange={this.onChange} type="text" placeholder="eg. Widget123" />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Label>Description</Form.Label>
                <Form.Control name="description" as="textarea" rows="3"  value={this.state.description || ''} onChange={this.onChange} type="text" placeholder="eg. Widget123" />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Label>WhatsApp Number</Form.Label>
                <Form.Control name="whatsapp"  value={this.state.whatsapp || ''} onChange={this.onChange} type="text" />
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
