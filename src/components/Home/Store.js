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
import AlgoliaPlaces from 'algolia-places-react';

import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags'

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
      location: '',
      locationCoLat: '',
      locationCoLng: '',
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.removeStore = this.removeStore.bind(this);

  };

  onSubmit = event => {
    const { name, description, location, locationCoLat, locationCoLng, whatsapp, category, imgUrl } = this.state;
    const user = firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    const dbCol = db.collection("stores");

      dbCol.add({
          name: name || '',
          description: description || '',
          whatsapp: whatsapp || '',
          category: category || '',
          imgUrl: imgUrl || 'https://via.placeholder.com/150/c9d2df/000000?text=TINYTRADER.CO.ZA',
          user: user || '',
          location: location || '',
          _geoloc: {
            lat: locationCoLat,
            lng: locationCoLng,
          }
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

  showWidget = (widget) => {
      widget = window.cloudinary.createUploadWidget({
        cloudName: "djqr0a74c",
        sources: [ 'local'],
        multiple: false,
        cropping: true,
        croppingAspectRatio: 1,
        croppingDefaultSelectionRatio: 1,
        uploadPreset: "jsghwzwi" },
      (error, result) => {
        if (!error && result && result.event === "success") {
          const imgUrl = result.info.secure_url;
          this.setState({imgUrl});
        }
      });
      widget.open();
    }

  render() {

    const {
      stores,
      userStore,
      loading,
      imgUrl
    } = this.state;

    const placeOptions = {
      appId: 'plMOIODNLXZ6',
      apiKey: 'b40b54304cdc5beb771d96ffc12c8cfe',
      language: 'en',
      countries: ['za'],
      type: 'city',
      useDeviceLocation: true,
    };

    const userid = firebase.auth().currentUser;
    const style = {
      backgroundImage: `url(${imgUrl})`,
      backgroundRepeat: `no-repeat`,
      backgroundSize: `contain`,
      backgroundPosition: `center`,
      marginBottom: `20px`
    }

    const isInvalid =
      stores === '';

    return (
      <Col md>
        {loading && <div style={{textAlign:`center`,}}><Spinner animation="grow" variant="light" /></div>}

        <ul>

          {Object.keys(stores).map((key, index) => {
            return (
              <li className="messages" key={key} index={index} style={{marginBottom:`10px`,}}>
                <div className="chat">
                  <Row>
                    <Col xs={4} sm={4} md={4}>
                      <div className="itemImg storeList">
                        <Image src={stores[key].imgUrl} fluid />
                      </div>
                    </Col>
                    <Col xs={8} sm={8} md={8} style={{ paddingLeft: `0`}}>
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
          <Row className="laneTitle">
            <Col>
              <Button variant="primary" className="mt-2" onClick={this.handleShow} block>
                + Add new store
              </Button>
            </Col>
          </Row>
        </ul>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create your store</Modal.Title>
          </Modal.Header>

          <Modal.Body>

              <Button onClick={this.showWidget} className="ProfileImgBtn">
                    <span style={style} className="ProfileImg">
                  <span className="ProfileText">
                    +
                  </span>
                </span>
              </Button>
            <Form className="FormInput" onSubmit={this.onSubmit}>

              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Your store name</Form.Label>
                <Form.Control name="name" value={this.state.name || ''} onChange={this.onChange} type="text" placeholder="Required" />
              </Form.Group>
              <Form.Group controlId="formLocation">
                <Form.Label>Location</Form.Label>
                <AlgoliaPlaces
                  placeholder='Required'

                  options={placeOptions}
                  onChange = {({ query, rawAnswer, suggestion, suggestionIndex }) =>
                    this.setState({location: suggestion.value, locationCoLat:suggestion.latlng.lat,locationCoLng: suggestion.latlng.lng})
                  }
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Category</Form.Label>
                <Form.Control as="select" name="category" value={this.state.category || ''} onChange={this.onChange}>
                  <option>Select a category</option>
                  <option>👕 Clothing</option>
                  <option>👟 Sneakers</option>
                  <option>🍔 Food</option>
                  <option>💻 Electronics</option>
                  <option>🚗 Cars</option>
                  <option>🚚 Movers</option>
                  <option>🚕 Transport</option>
                  <option>♻️ Thrift</option>
                  <option>💅🏼 Salon</option>
                  <option>💇🏼‍♂️ Barber</option>
                  <option>🧹 Cleaner</option>
                  <option>🏪 Spaza Shop</option>
                  <option>🏭 Manufacturing</option>
                  <option>👔 Pro Services</option>
                  <option>🛠 Skilled Tradesmen</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Label>WhatsApp Number</Form.Label>
                  <PhoneInput
                    name="whatsapp"
                    flags={flags}
                    placeholder="Enter WhatsApp number"
                    country= "ZA"
                    value={ this.state.whatsapp || '' }
                    onChange={ whatsapp => this.setState({ whatsapp }) }
                    />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Label>Description</Form.Label>
                <Form.Control name="description" as="textarea" rows="3"  value={this.state.description || ''} onChange={this.onChange} type="text" placeholder="Let people know what your store is about" />
              </Form.Group>
              <Button block variant="primary" className="btnCreate" onClick={this.handleClose} type="submit">
                Create your store
              </Button>
              <Button block variant="secondary" className="btnCancel" onClick={this.handleClose}>
                Cancel
              </Button>
              </Form>
          </Modal.Body>
        </Modal>
      </Col >
    );
  }
}


export default Stores;
