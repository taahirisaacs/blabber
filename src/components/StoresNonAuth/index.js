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

import firebase from 'firebase/app';
import HomePage from '../Home';

const INITIAL_STATE = {
  loading: false,
  store: [],
  storedesc: [],
  item: [],
  description: [],
  category: [],
  price: [],
  error: null,
  copied: false,
};

class StoresPageNonAuth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storeImg: [],
      items: '',
    };

  }

  componentDidMount(){
    this.setState({ loading: true })
    const docId = this.props.match.params.uid;
    const userkey = this.props.match.params.userid;
    const db = firebase.firestore();
    const dbCol = db.collection("stores").doc(docId);

    const dbUser = firebase.database().ref(`users/${userkey}/`);

    const dbItems = db.collection("items");
    const dbItemsquery = dbItems.where("store", "==", docId);

    dbCol.onSnapshot(snap => {
        this.setState({
          storeImg: snap.data().imgUrl,
          storeName: snap.data().name,
          storeDesc: snap.data().description,
          storeCat: snap.data().category,
          storeId: snap.id,
          loading: false
        });
      });

      dbUser.on('value', snapshot => {
          const snap = snapshot.val();
          this.setState({
            userLocation: snap.location,
            userWhatsapp: snap.whatsapp,
            loading: false
          });
        });

        this.unsubscribe = dbItemsquery.onSnapshot(snap => {
          const items = {}

          snap.forEach(item => {
           items[item.id] =  item.data();
          })
            this.setState({items, loading: false});
          })

    }

      componentWillUnmount() {
      const userkey = this.props.match.params.userid;
      const storekey = this.props.match.params.uid;
      firebase.database().ref(`stores/users/${userkey}/${storekey}/`).off();
      firebase.database().ref(`items/users/${userkey}/`).off();
      firebase.database().ref(`users/${userkey}/`).off();
    }

  render() {
    const { items, storeImg, storeName, storeDesc, storeCat, storeId, userLocation, userWhatsapp, loading} = this.state;
    const user = this.props.match.params.userid;
    const pretext = "Hello! I want to";
    const itemUrl = window.location.href;

    return (

      <Col md={{span:6, offset:3}}>
        {loading && <div style={{textAlign:`center`,}}><Spinner animation="grow" variant="light" /></div>}
        <ul>
          <li key={storeId} index={storeId} className="messages" >
            <Row>
              <Col xs sm md className="storeHeader">
                <div className="chat">
                  <div className="storeImg">
                    <Image src={storeImg + `/-/scale_crop/500x500/center/`}/>
                  </div>
                  <h2>{storeName}</h2>
                  <span className="city">{userLocation}</span>
                  <span className="timestamp">{storeDesc}</span>
                  <span className="cat">{storeCat}</span>
                  <CopyToClipboard block className="storebtn copy_link" text={`${itemUrl}`} onCopy={() => this.setState({copied: true})}>
                    <Button>{this.state.copied ? <span>Copied.</span> : <span>Copy Store URL</span>}</Button>
                  </CopyToClipboard>
                </div>
              </Col>
            </Row>
          </li>
        </ul>

        <ul style={{marginBottom:`40px`,}}>

          {Object.keys(items).map((key, index) => {
            return (
              <li className="messages" key={key} index={index}>
                <div className="chat">
                  <Link to={`/items/${items[key].store}/${items[key].itemId}`}>
                    <Row>
                      <Col xs={4} sm={3} md={3}>
                        <div className="itemImg">
                          <Image src={items[key].imgUrl + `/-/scale_crop/500x500/center/` || "https://via.placeholder.com/150"}/>
                        </div>
                      </Col>
                      <Col xs={8} sm={9} md={9} style={{ paddingLeft: `0`, paddingRight: `40px` }}>

                        <h2>{items[key].name}</h2>
                        <span className="pricing">R{items[key].price}</span>
                        <span className="desc">{items[key].description}</span>
                      </Col>
                    </Row>
                  </Link>
                </div>
               </li>
             );
          })}
        </ul>
        <span className="poweredby">Powered by TinyTrader®</span>
      </Col>
    );
  }
}

export default StoresPageNonAuth;
