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
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

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

class filterClothing extends Component {
  constructor(props) {
    super(props);

        this.state = {
          loading: false,
          stores: [],
          copied: false,
        };
      }

      componentWillMount(){

          this.setState({ loading: true })

          const db = firebase.firestore();

          db.collection("stores").where("category", "==", "⚙️ Services").limit(25).get()
          .then(snap => {
            const stores= {}
            snap.forEach(doc => {
            stores[doc.id] = doc.data()
            })
            this.setState({stores, loading: false})
          })

      }

        componentWillUnmount() {
        }

      render () {

        const { stores, loading } = this.state;
        const itemUrl = window.location.href;

        return (
          <Col style={{paddingTop:`20px`, paddingBottom:`10px`}} xs={12} md={{span:'4', offset:'4'}}>

            <h4 className="catTitle">⚙️ Services</h4>
            {loading && <div style={{textAlign:`center`,}}><Spinner animation="grow" variant="light" /></div>}
            <ul>
              {Object.keys(stores).map((store, index) => {
                return (
                  <li className="messages" key={store} index={index} style={{marginBottom:`10px`,}}>
                    <div className="chat">
                      <Row>
                        <Col xs={4} sm={4} md={2}>
                          <div className="itemImg storeList">
                            <Image src={stores[store].imgUrl + `/-/scale_crop/250x250/center/`}/>
                          </div>
                        </Col>
                        <Col xs={8} sm={8} md={10} style={{ paddingLeft: `0`, paddingRight: `45px` }}>
                          <Link to={{ pathname:`/store/${stores[store].user}/${store}`, state:{userkey: `${store}`} }}>
                            <h2>{stores[store].name}</h2>
                            <span className="desc">{stores[store].description}</span>
                            <span className="cat">{stores[store].category}</span>
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

export default filterClothing;
