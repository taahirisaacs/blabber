import React, { Component } from 'react';
import { LinkContainer } from "react-router-bootstrap";
import { NavLink, Link } from 'react-router-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Uploader from './../Uploader';
import FooterNavigation from '../Navigation/footer';

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

class filterFood extends Component {
  constructor(props) {
    super(props);

        this.state = {
          loading: false,
          items: [],
          stores: '',
          copied: false,
        };
      }

      componentWillMount(){

          this.setState({ loading: true })

          const db = firebase.firestore();

          db.collection("items").where("category", "==", "🍔 Food").limit(25).get()
          .then(snap => {
            const items= {}
            snap.forEach(doc => {
            items[doc.id] = doc.data()
            })
            this.setState({items, loading: false})
          })

      }

        componentWillUnmount() {
        }

      render () {

        const { items, loading } = this.state;
        const itemUrl = window.location.href;

        return (
          <Col style={{paddingTop:`20px`, paddingBottom:`10px`}} xs={12} md={{span:'4', offset:'4'}}>

            <h4 className="catTitle">🍔 Food near you</h4>
            {loading && <div style={{textAlign:`center`,}}><Spinner animation="grow" variant="light" /></div>}
            <ul>
              {Object.keys(items).map((item, index) => {
                return (
                  <li className="messages" key={item} index={index}>
                    <div className="chat">
                      <Row>
                        <Col xs={4} sm={3} md={3}>
                          <div className="itemImg">
                            {items[item].imgUrl && <Image src={items[item].imgUrl + `/-/scale_crop/500x500/center/` || ''}/>}
                          </div>
                        </Col>
                        <Col xs={8} sm={9} md={9} style={{ paddingLeft: `0`, paddingRight: `40px` }}>
                          <Link to={`/items/${items[item].store}/${items[item].itemId}`}>

                            <h2>{items[item].name}</h2>
                            <span className="pricing">R{items[item].price}</span>
                            <span className="timestamp desc">{items[item].description}</span>
                            <span className="cat">{items[item].category}</span>
                          </Link>
                        </Col>
                      </Row>
                    </div>
                  </li>
                );
              })}
            </ul>
            <FooterNavigation />
          </Col>
        );
      }
}

export default filterFood;
