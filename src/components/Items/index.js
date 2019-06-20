import React, { Component } from 'react';
import { LinkContainer } from "react-router-bootstrap";
import { NavLink, Link } from 'react-router-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

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

    this.state = {
      loading: false,
      items: '',
      copied: false,
    };
  }

  componentWillMount(){
    this.setState({ loading: true })
    const itemkey = this.props.match.params.itemid;
    const db = firebase.firestore();
    const dbCol = db.collection("items");
    const dbquery = dbCol.where("name", "==", itemkey);

    this.unsubscribe = dbquery.onSnapshot(snap => {
      const items = {}
      snap.forEach(item => {
       items[item.id] =  item.data()
      })
        this.setState({items, loading: false})
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

  render () {
    console.log(this.props);
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
                      <div className="itemImg">
                        <Image src={items[key].imgUrl + `/-/scale_crop/500x500/center/` || "https://via.placeholder.com/150"}/>
                      </div>
                    </Col>
                    <Col xs={12} style={{ paddingLeft: `20px`, paddingRight: `20px` }}>
                      <h2>{items[key].name}</h2>
                      <span className="pricing">R{items[key].price}</span>
                      <span className="itemdesc">{items[key].description}</span>
                      <span className="cat">{items[key].category}</span>
                      <Button block className="storebtn order_cta" href={`https://wa.me/27${userWhatsapp}/?text=(${items[key].cta})%20:%20${items[key].item}%20|%20R${items[key].price}`}>{items[key].cta}</Button>
                      <CopyToClipboard block className="storebtn copy_link" text={`${itemUrl}`} onCopy={() => this.setState({copied: true})}>
                        <Button>{this.state.copied ? <span>Copied.</span> : <span>Copy Item URL</span>}</Button>
                      </CopyToClipboard>
                      <span className="divider"></span>
                      <Button block className="storebtn delete" onClick={this.removeItem.bind(this, key)}>Delete item</Button>
                    </Col>
                 </Row>
               </div>
              </li>
            );
          })}
        </ul>
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

      componentWillMount(){
          this.setState({ loading: true })
          const itemkey = this.props.match.params.itemid;
          const storekey = this.props.match.params.storeid;
          const db = firebase.firestore();

          const dbItems = db.collection("items");
          const dbItemsquery = dbItems.where("name", "==", itemkey);

          const dbStore = db.collection("stores").doc(storekey);

          dbStore.onSnapshot(snap => {
            console.log(snap.id);
            this.setState({
              stores: snap.data(),
              storesId: snap.id,
              loading: false,
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
                    <div className="chat">
                      <Row>
                        <Col xs={12}>
                          <div className="itemImg">
                            <Image src={items[key].imgUrl + `/-/scale_crop/500x500/center/` || "https://via.placeholder.com/150"}/>
                          </div>
                        </Col>
                        <Col xs={12} style={{ paddingLeft: `20px`, paddingRight: `20px` }}>
                          <h2>{items[key].name}</h2>
                          <span className="pricing">R{items[key].price}</span>
                          <span className="itemdesc">{items[key].description}</span>
                          <span className="cat">{items[key].category}</span>
                          <Button block className="storebtn" href={`https://wa.me/27${userWhatsapp}/?text=(${items[key].cta})%20:%20${items[key].name}%20|%20R${items[key].price}`}>{items[key].cta}</Button>
                          <CopyToClipboard block className="storebtn copy_link" text={`${itemUrl}`} onCopy={() => this.setState({copied: true})}>
                            <Button>{this.state.copied ? <span>Copied.</span> : <span>Copy Item URL</span>}</Button>
                          </CopyToClipboard>
                        </Col>
                      </Row>
                    </div>
                  </li>
                );
              })}
              <li className="messages" key={stores.id} index={stores.id} style={{marginBottom:`10px`,}}>
                <div className="chat">
                  <Row>
                    <Col xs={4} sm={4} md={2}>
                      <div className="itemImg storeList">
                        <Image src={stores.imgUrl + `/-/scale_crop/250x250/center/`}/>
                      </div>
                    </Col>
                    <Col xs={8} sm={8} md={10} style={{ paddingLeft: `0`, paddingRight: `45px` }}>
                      <Link to={{ pathname:`/store/${stores.user}/${storesId}`, state:{userkey: `${storesId}`} }}>
                        <h2>{stores.name}</h2>
                        <span className="desc">{stores.description}</span>
                        <span className="cat">{stores.category}</span>
                      </Link>
                    </Col>
                  </Row>
                </div>
              </li>
            </ul>
          </Col>
        );
      }
}

export default Items;
