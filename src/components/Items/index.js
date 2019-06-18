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
    const userkey = this.props.match.params.userid;
    const user = firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    const dbCol = db.collection("items");
    const dbquery = dbCol.where("user", "==", userkey);

    this.unsubscribe = dbquery.onSnapshot(snap => {
      const items = {}
      snap.forEach(item => {
       items[item.id] =  item.data()
      })
        this.setState({items, loading: false})
      })

    }

    componentWillUnmount() {
      const userkey = this.props.match.params.userid;
      firebase.database().ref(`items/users/${userkey}/`).off();
      firebase.database().ref(`users/${userkey}/`).off();
    }

    removeItem(key, e) {
      const db = firebase.firestore();
      const itemkey = key;
      db.collection("items").doc(itemkey).delete();
      this.props.history.goBack();
    }

  render () {
    console.log(this.props.history);
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
                     <h2>{items[key].item}</h2>
                     <span className="pricing">R{items[key].price}</span>
                     <span className="itemdesc">{items[key].description}</span>
                     <span className="cat">{items[key].category}</span>
                      <Button block className="storebtn" href={`https://wa.me/27${userWhatsapp}/?text=(${items[key].cta})%20:%20${items[key].item}%20|%20R${items[key].price}`}>{items[key].cta}</Button>
                      <CopyToClipboard block className="storebtn" text={`${itemUrl}`} onCopy={() => this.setState({copied: true})}>
                        <Button>{this.state.copied ? <span>Copied.</span> : <span>Copy Link URL</span>}</Button>
                      </CopyToClipboard>
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
        };
      }

      componentWillMount(){
          this.setState({ loading: true })
          const userkey = this.props.match.params.userid;
          const db = firebase.firestore();
          const dbCol = db.collection("items");
          const dbquery = dbCol.where("user", "==", userkey);

          this.unsubscribe = dbquery.onSnapshot(snap => {
            const items = {}
            snap.forEach(item => {
             items[item.id] =  item.data()
            })
              this.setState({items, loading: false})
            })

          }

        componentWillUnmount() {
          const userkey = this.props.match.params.userid;
          firebase.database().ref(`items/users/${userkey}/`).off();
          firebase.database().ref(`users/${userkey}/`).off();
        }

      render () {

        const { items, loading, userWhatsapp } = this.state;
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
                         <h2>{items[key].item}</h2>
                         <span className="pricing">R{items[key].price}</span>
                         <span className="itemdesc">{items[key].description}</span>
                         <span className="cat">{items[key].category}</span>
                        <Button block className="storebtn" href={`https://wa.me/27${userWhatsapp}/?text=(${items[key].cta})%20:%20${items[key].item}%20|%20R${items[key].price}`}>{items[key].cta}</Button>
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

export default Items;
