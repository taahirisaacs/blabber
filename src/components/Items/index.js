import React, { Component } from 'react';
import { LinkContainer } from "react-router-bootstrap";
import { NavLink, Link } from 'react-router-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import FooterNavigation from '../Navigation/footer';
import TextTruncate from 'react-text-truncate';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Uploader from './../Uploader';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import TextareaAutosize from 'react-autosize-textarea';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Spinner from 'react-bootstrap/Spinner';

import firebase from 'firebase/app';

import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

const INITIAL_STATE = {
  show: false,
};

const Items = (props) => (

    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <ItemsAuth {...props}/> : <ItemsNonAuth {...props}/>
      }
    </AuthUserContext.Consumer>
);

class ItemsAuth extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.state = {
      loading: false,
      items: '',
      copied: false,
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  onSubmit = event => {
    const { name, description, price, category, imgUrl, cta } = this.state;

    const user = firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    const itemkey = this.props.match.params.itemid;
    db.collection("items").where("itemId", "==", itemkey)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
            // Build doc ref from doc.id
            db.collection("items").doc(doc.id).update({
              name,
              description,
              price,
              category,
              cta,
              imgUrl
            })
        })
   })
   .catch(error => {
     this.setState({ error });
   });

 event.preventDefault();

}

  componentWillMount(){
    this.setState({ loading: true })
    const itemkey = this.props.match.params.itemid;
    const db = firebase.firestore();
    const dbCol = db.collection("items");
    const dbquery = dbCol.where("itemId", "==", itemkey);

    const user = firebase.auth().currentUser;
    const dbUsers = db.collection("users").doc(user.uid);

    dbUsers.get()
    .then(snap => {
      this.setState({userWhatsapp: snap.data().whatsapp})
    })

    this.unsubscribe = dbquery.onSnapshot(snap => {
      const snapId = snap.docs[0].id;
      const items = {};
      snap.forEach(item => {
       items[item.id] =  item.data()
      })
        this.setState({
          items,
          name: items[snapId].name,
          description: items[snapId].description,
          price: items[snapId].price,
          category: items[snapId].category,
          cta: items[snapId].cta,
          imgUrl: items[snapId].imgUrl,
          loading: false
        })
      })

    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    removeItem(key, e) {
      const db = firebase.firestore();
      const itemkey = key;
      db.collection("items").doc(itemkey).delete();
      this.props.history.goBack();
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

  render () {
    const { items, loading, userWhatsapp } = this.state;
    const itemUrl = window.location.href;

    return (
      <Col>
        <ul style={{marginTop:`20px`, marginBottom:`90px`}}>
          {Object.keys(items).map((key, index) => {
            return (
              <li className="messages" key={key} index={index}>
                <div className="chat">
                  <Row>
                    <Col xs={12}>
                      <div className="itemImgInner">
                        <Image src={items[key].imgUrl + `/-/scale_crop/500x500/center/` || "https://via.placeholder.com/150"}/>
                      </div>
                    </Col>
                    <Col xs={12} style={{ paddingLeft: `20px`, paddingRight: `20px` }}>
                      <span className="storenameInner">{items[key].store.name}</span>
                      <h2 className="titleInner">{items[key].name}</h2>
                      <span className="pricing">R{items[key].price}</span>
                      <span className="itemdesc">{items[key].description}</span>
                      <span className="cat">{items[key].category}</span>
                      <Button block className="storebtn order_cta" href={`https://wa.me/27${userWhatsapp}/?text=(${items[key].cta})%20:%20${items[key].item}%20|%20R${items[key].price}`}>{items[key].cta}</Button>
                      <CopyToClipboard block className="storebtn copy_link" text={`${itemUrl}`} onCopy={() => this.setState({copied: true})}>
                        <Button>{this.state.copied ? <span>Copied.</span> : <span>Copy Item URL</span>}</Button>
                      </CopyToClipboard>
                      <Button className="storebtn copy_link" onClick={this.handleShow} block>
                        Edit
                      </Button>
                      <span className="divider"></span>
                      <Button block className="storebtn delete" onClick={this.removeItem.bind(this, key)}>Delete item</Button>
                    </Col>
                  </Row>
                </div>
                <Modal show={this.state.show} onHide={this.handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Edit your store</Modal.Title>
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
                        this.setState ({
                          imgUrl: file.cdnUrl,
                        })
                      }}
                      onUploadComplete={info =>
                        this.setState ({
                          imgUrl: info.cdnUrl,
                        })
                      } />
                    <Form className="FormInput" onSubmit={this.onSubmit}>
                      <Form.Control style={{display:`none`}} name="imgUrl" value={this.state.imgUrl || ''} onChange={this.onChange} type="text" placeholder="imgUrl" />
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Item Name</Form.Label>
                        <Form.Control name="name" value={this.state.name || ''} onChange={this.onChange} type="text" placeholder="Item name" />
                      </Form.Group>
                      <Form.Group controlId="exampleForm.ControlInput2">
                        <Form.Control name="description" as="textarea" rows="3"  value={this.state.description || ''}  onChange={this.onChange} type="text" placeholder="Description..." />
                      </Form.Group>
                      <Form.Group controlId="exampleForm.ControlInput3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control name="price"  value={this.state.price || ''}  onChange={this.onChange} type="number" pattern="[0-9]*" placeholder="100.00" />
                      </Form.Group>
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Control as="select" name="category" value={this.state.category || ''}  onChange={this.onChange}>
                          <option>Which Product/Service category?</option>
                          <option>👕 Clothing</option>
                          <option>👟 Sneakers</option>
                          <option>🍔 Food</option>
                          <option>💻 Electronics</option>
                          <option>🚗 Cars</option>
                          <option>🚚 Movers</option>
                          <option>♻️ Thrift</option>
                          <option>💅🏼 Salon</option>
                          <option>💇🏼‍♂️ Barber</option>
                          <option>🧹 Cleaner</option>
                          <option>🏪 Spaza Shop</option>
                          <option>🏭 Manufacturing</option>
                          <option>⚙️ Other Services</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="exampleForm.ControlSelect12">
                        <Form.Label>Select your contact button</Form.Label>
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
                      <Button block variant="primary" onClick={this.handleClose} type="submit">
                        Save Changes
                      </Button>
                      <Button block variant="secondary" onClick={this.handleClose}>
                        Cancel
                      </Button>
                    </Form>
                  </Modal.Body>
                </Modal>
              </li>
            );
          })}
        </ul>
        <FooterNavigation />
      </Col>
    );
  }
}

class ItemsNonAuth extends Component {
  constructor(props) {
    super(props);

        this.state = {
          loading: false,
          items: '',
          stores: '',
          copied: false,
        };
      }

      componentDidMount(){
          this.setState({ loading: true })
          const itemkey = this.props.match.params.itemid;
          const storekey = this.props.match.params.storeid;
          const db = firebase.firestore();

          const dbItems = db.collection("items");
          const dbItemsquery = dbItems.where("itemId", "==", itemkey);

          const dbStore = db.collection("stores").doc(storekey);

          dbStore.onSnapshot(snap => {
            this.setState({
              stores: snap.data(),
              storesId: snap.id,
              loading: false,
            })
          })

          this.unsubscribe = dbItemsquery.onSnapshot(snap => {
            const items = {}

            snap.forEach(item => {
             items[item.id] =  item.data()
            })
              this.setState({items, loading: false});
            })


          }

        componentWillUnmount() {
          const userkey = this.props.match.params.userid;
          firebase.database().ref(`items/users/${userkey}/`).off();
          firebase.database().ref(`users/${userkey}/`).off();
        }

      render () {

        const { items, stores, storesId, loading, userWhatsapp } = this.state;
        const itemUrl = window.location.href;

        return (
          <Col xs={12} md={{span:'4', offset:'4'}}>
            {loading && <div style={{textAlign:`center`,}}><Spinner animation="grow" variant="light" /></div>}
            <ul style={{marginTop:`20px`}}>
              {Object.keys(items).map((key, index) => {
                return (
                  <li className="messages" key={key} index={index}>
                    <div className="chat chatInner">
                      <Row>
                        <Col xs={12}>
                          <div className="itemImgInner">
                            <Image src={items[key].imgUrl + `/-/scale_crop/500x500/center/` || "https://via.placeholder.com/150"}/>
                          </div>
                        </Col>
                        <Col xs={12} style={{ paddingLeft: `20px`, paddingRight: `20px` }}>
                          <span className="storenameInner">{items[key].store.name}</span>
                          <h2 className="titleInner">{items[key].name}</h2>
                          <span className="pricing">R{items[key].price}</span>

                          <Button block className="storebtn" href={`https://wa.me/27${stores.whatsapp}/?text=New%20TinyTrader%C2%AE%20Request%0A%0AItem%3A%20${items[key].name}%0APrice%3A%20R${items[key].price}%0AMy%20Name%3A%20`}>{items[key].cta}</Button>
                          <CopyToClipboard block className="storebtn copy_link" text={`${itemUrl}`} onCopy={() => this.setState({copied: true})}>
                            <Button>{this.state.copied ? <span>Copied.</span> : <span>Copy Item URL</span>}</Button>
                          </CopyToClipboard>
                          <span className="smallHead">Description</span>
                          <span className="itemdescInner">{items[key].description}</span>
                          <span className="cat">{items[key].category}</span>
                        </Col>
                      </Row>
                    </div>
                  </li>
                );
              })}

              <li className="messages" key={stores.id} index={stores.id} style={{marginBottom:`10px`,}}>
                <span className="smallHeadSection">About The Trader</span>
                <div className="chat">
                  <Row>
                    <Col xs={4} sm={4} md={2}>
                      <div className="itemImg storeList">
                        <Image src={stores.imgUrl}/>
                      </div>
                    </Col>
                    <Col xs={8} sm={8} md={10} style={{ paddingLeft: `0` }}>
                      <Link to={{ pathname:`/store/${stores.user}/${storesId}`, state:{userkey: `${storesId}`} }}>
                        <h2>{stores.name}</h2>
                        <TextTruncate
                          className="timestamp"
                          line={1}
                          truncateText="…"
                          text={stores.location}
                        />
                        <TextTruncate
                          className="timestamp"
                          line={1}
                          truncateText="…"
                          text={stores.description}
                        />
                        <span className="cat">{stores.category}</span>
                      </Link>
                    </Col>
                  </Row>
                </div>
              </li>
            </ul>
            <Link to={ROUTES.BETA}>
              <span className="poweredby">Join +250 traders ready for business →</span>
            </Link>
          </Col>
        );
      }
}

export default Items;
