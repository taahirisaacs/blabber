import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';
import Uploader from './../Uploader';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import TextTruncate from 'react-text-truncate';
import AlgoliaPlaces from 'algolia-places-react';

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

import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';

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
      storeshow: false,
      location: '',
      locationCoLat: '',
      locationCoLng: '',
      storeName: '',
      storeDescription: '',
      storeLocation: '',
      storeWhatsapp: '',
      storeCategory: '',
      storeImgUrl: '',
      storeUrl: window.location.href,
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleStoreShow = this.handleStoreShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  onUpdate = event => {
    const { storeName, storeDescription, storeLocation, locationCoLat, locationCoLng, storeWhatsapp, storeCategory, storeImgUrl } = this.state;
    const user = firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    const storekey = this.props.match.params.uid;
    const dbCol = db.collection("stores").doc(storekey);

      dbCol.update({
          name: storeName,
          description: storeDescription,
          whatsapp: storeWhatsapp,
          category: storeCategory,
          imgUrl: storeImgUrl,
          location: storeLocation,
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

  onSubmit = event => {
    const { name, description, price, location, locationCoLat, locationCoLng, category, storeId, storeName, imgUrl, cta } = this.state;
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
            timestamp: timestamp,
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
        storeLocation: snap.data().location,
        storeImgUrl: snap.data().imgUrl,
        storeWhatsapp: snap.data().whatsapp,
        storeCategory: snap.data().category,
        storeDescription: snap.data().description,
        locationCoLat: snap.data()._geoloc.lat,
        locationCoLng: snap.data()._geoloc.lng,
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
    this.setState({ show: false, storeshow: false });
  };

  handleShow() {
    this.setState({ show: true });
  };
  handleStoreShow() {
    this.setState({ storeshow: true });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeOptions = event => {
    this.setState({ [event.target.name]: event.target.value});
    this.setState({ storeName: event.target.options[event.target.selectedIndex].text});
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
          const storeImgUrl = result.info.secure_url;
          this.setState({storeImgUrl});
        }
      });
      widget.open();
    }

  render() {

    const {
      stores,
      items,
      storeId,
      storeName,
      storeImgUrl,
      storeshow,
      loading
     } = this.state;
     const itemUrl = window.location.href;
     const user = firebase.auth().currentUser;
     const placeOptions = {
       appId: 'plMOIODNLXZ6',
       apiKey: 'b40b54304cdc5beb771d96ffc12c8cfe',
       language: 'en',
       countries: ['za'],
       type: 'city',
       useDeviceLocation: true,
     };
     const style = {
       backgroundImage: `url(${storeImgUrl})`,
       backgroundRepeat: `no-repeat`,
       backgroundSize: `contain`,
       backgroundPosition: `center`,
       marginBottom: `20px`
     }

    return (
      <Col md={{span:6, offset:3}}>
        <ul>
          <li key={stores.id} index={stores.id} className="messages" >

            <Row>
              <Col xs sm md className="storeHeader">
                <div className="chat">
                  <div className="storeImg">
                    <Image src={stores.imgUrl} fluid/>
                  </div>
                  <h2>{stores.name}</h2>
                  <p className="profileSub">{stores.location}</p>
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
                      <Button className="storebtn copy_link" onClick={this.handleStoreShow} block>
                        Edit
                      </Button>
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
                      <Col xs={8} sm={9} md={9} style={{ paddingLeft: `0`}}>
                        <h2>{items[key].name}</h2>
                        <span className="pricing">R{items[key].price}</span>
                        <TextTruncate
                          className="timestamp"
                          line={1}
                          truncateText="…"
                          text={items[key].description}
                        />
                      </Col>
                    </Row>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
        <Modal show={this.state.storeshow} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit your store</Modal.Title>
          </Modal.Header>

          <Modal.Body>

              <Button onClick={this.showWidget} className="ProfileImgBtn">
                    <span style={style} className="ProfileImg">
                  <span className="ProfileText">
                    +
                  </span>
                </span>
              </Button>
            <Form className="FormInput" onSubmit={this.onUpdate}>

              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Your store name</Form.Label>
                <Form.Control name="storeName" value={this.state.storeName || ''} onChange={this.onChange} type="text" placeholder="Required" />
              </Form.Group>
              <Form.Group controlId="formLocation">
                <Form.Label>Location</Form.Label>
                <AlgoliaPlaces
                  placeholder={this.state.storeLocation}

                  options={placeOptions}
                  onChange = {({ query, rawAnswer, suggestion, suggestionIndex }) =>
                    this.setState({storeLocation: suggestion.value, locationCoLat:suggestion.latlng.lat,locationCoLng: suggestion.latlng.lng})
                  }
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Category</Form.Label>
                <Form.Control as="select" name="storeCategory" value={this.state.storeCategory || ''} onChange={this.onChange}>
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
                    name="storeWhatsapp"
                    flags={flags}
                    placeholder="Enter WhatsApp number"
                    country= "ZA"
                    value={ this.state.storeWhatsapp || '' }
                    onChange={ storeWhatsapp => this.setState({ storeWhatsapp }) }
                    />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Label>Description</Form.Label>
                <Form.Control name="storeDescription" as="textarea" rows="3"  value={this.state.storeDescription || ''} onChange={this.onChange} type="text" placeholder="Let people know what your store is about" />
              </Form.Group>
              <Button block variant="primary" className="btnCreate" onClick={this.handleClose} type="submit">
                Save
              </Button>
              <Button block variant="secondary" className="btnCancel" onClick={this.handleClose}>
                Cancel
              </Button>
              </Form>
          </Modal.Body>
        </Modal>
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
                <Form.Control as="select" name="category" value={this.state.category || ''} onChange={this.onChange}>
                  <option>Which Product/Service category?</option>
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
                  <option>🛠 Skilled Trades</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlSelect12">
                <Form.Label>Select a contact button</Form.Label>
                <Form.Control as="select" name="cta" value={this.state.cta || ''} onChange={this.onChange}>
                  <option>Select a contact button</option>
                  <option>Message Me</option>
                  <option>Make an offer</option>
                  <option>Order</option>
                  <option>Pre-Order</option>
                  <option>Make a booking</option>
                  <option>Request a quote</option>
                  <option>Book now</option>
                  <option>Book a test drive</option>
                  <option>Reserve</option>
                  <option>RSVP</option>
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
