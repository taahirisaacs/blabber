import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';
import Uploader from './../Uploader';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import TextTruncate from 'react-text-truncate';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Image from 'react-bootstrap/Image';
import * as ROUTES from '../../constants/routes';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import firebase from 'firebase/app';
import HomePage from '../Home';
import Rating from 'react-rating';
import Linkify from 'react-linkify';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

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
      index: 0,
    };

  }

  componentWillMount(){
    this.setState({ loading: true })

    const docId = this.props.match.params.uid;
    const userkey = this.props.match.params.userid;
    const db = firebase.firestore();
    const dbCol = db.collection("stores").doc(docId);

    const dbUser = db.collection("users").doc(userkey);
    const dbItems = db.collection("items");
    const dbItemsquery = dbItems.where("store.id", "==", docId);

    this.unsubscribe = dbCol.onSnapshot(snap => {
        this.setState({
          storeImg: snap.data().imgUrl,
          storeName: snap.data().name,
          storeDesc: snap.data().description,
          storeCat: snap.data().category,
          storeLoc: snap.data().location,
          storeId: snap.id,
          loading: false
        })
      })

    this.unsubscribe = dbUser.onSnapshot(snap => {
          this.setState({
            userLocation: snap.data().location,
            userWhatsapp: snap.data().whatsapp,
            loading: false
          })
        })

    this.unsubscribe = dbItemsquery.onSnapshot(snap => {
          const items = {}

          snap.forEach(item => {
           items[item.id] =  item.data();
          })
            this.setState({items, loading: false});
          })

    }

      componentWillUnmount() {
      this.unsubscribe();
    }

    handleChange = (event, value) => {
      this.setState({
        index: value,
      });
    };

    handleChangeIndex = index => {
      this.setState({
        index,
      });
    };

  render() {
    const { items, storeImg, index, storeName, storeLoc, storeDesc, storeCat, storeId, userLocation, userWhatsapp, loading} = this.state;
    const user = this.props.match.params.userid;
    const pretext = "Hello! I want to";
    const itemUrl = window.location.href;

    return (

      <Col >
        {loading && <div style={{textAlign:`center`,}}><Spinner animation="grow" variant="light" /></div>}
        <ul>
          <li key={storeId} index={storeId} className="messages" >
            <Row>
              <Col xs sm md className="storeHeader">
                <div className="chat">
                  <div className="storeImg">
                    <Image src={storeImg} fluid/>
                  </div>
                  <h2>{storeName}</h2>
                  <TextTruncate
                    className="city"
                    line={1}
                    truncateText="…"
                    text={storeLoc}
                  />
                <span className="ratingText">0.0</span>
                  <Rating
                    initialRating={0.0}
                    readonly
                    emptySymbol={<FontAwesomeIcon icon={faStar} className="icon_star_empty"/>}
                    fullSymbol={<FontAwesomeIcon icon={faStar} className="icon_star"/>}
                    className="mb-1"
                  />
                <span className="ratingText">(0 reviews)</span>
                  <Linkify>
                    <span className="timestamp">{storeDesc}</span>
                  </Linkify>
                  <span className="cat">{storeCat}</span>
                  <CopyToClipboard block className="storebtn copy_link" text={`${itemUrl}`} onCopy={() => this.setState({copied: true})}>
                    <Button>{this.state.copied ? <span>Copied.</span> : <span>Copy Store URL</span>}</Button>
                  </CopyToClipboard>
                </div>
              </Col>
            </Row>
          </li>
        </ul>

        <Row className="tabbar mx-0">
          <Col md>
            <Tabs TabIndicatorProps={{style: {backgroundColor:`#6a7b95`}}} value={index} variant="fullWidth"  onChange={this.handleChange} >
              <Tab label={"Items"} />
              <Tab label={"Reviews"} />

            </Tabs>
          </Col>
        </Row>

        <SwipeableViews index={index} onChangeIndex={this.handleChangeIndex}>

          <Row  className="px-2">
            <ul style={{marginBottom:`40px`,}}>
              {Object.keys(items).map((key, index) => {
                return (
                  <li className="messages" key={key} index={index}>
                    <div className="chat">
                      <Link to={`/items/${items[key].store.id}/${items[key].itemId}`}>
                        <Row>
                          <Col xs={4} sm={3} md={3}>
                            <div className="itemImg">
                              <Image src={items[key].imgUrl + `/-/scale_crop/500x500/center/` || "https://via.placeholder.com/150"}/>
                            </div>
                          </Col>
                          <Col xs={8} sm={9} md={9} style={{ paddingLeft: `0` }}>

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
          </Row>

          <Row className="px-2">
            <span></span>
          </Row>

        </SwipeableViews>

        <Link to={ROUTES.BETA}>
          <span className="poweredby">Join +250 traders ready for business →</span>
        </Link>
      </Col>
    );
  }
}

export default StoresPageNonAuth;
