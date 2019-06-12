import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Uploader from './../Uploader';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Image from 'react-bootstrap/Image';

import firebase from 'firebase';
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
};

class StoresPageNonAuth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storeImg: [],
      items: '',
    };

  }

  componentWillMount(){

    console.log(this.props.location.state);

    const userkey = this.props.match.params.userid;
    const storekey = this.props.match.params.uid;
    const db = firebase.database().ref(`stores/users/${userkey}/${storekey}/`);
    const dbUser = firebase.database().ref(`users/${userkey}/`);
    const dbItem = firebase.database().ref(`items/users/${userkey}`).orderByChild('storeId').equalTo(`${storekey}`)

    db.on('value', snapshot => {
        const snap = snapshot.val();
        console.log(snap);
        this.setState({
          storeImg: snap.imgUrl,
          storeName: snap.store,
          storeDesc: snap.description,
          storeCat: snap.category,
          storeId: snapshot.key,
        });
      });

      dbUser.on('value', snapshot => {
          const snap = snapshot.val();
          this.setState({
            userLocation: snap.location,
            userWhatsapp: snap.whatsapp,
          });
        });

    dbItem.on('value', (snapshot) => {
      const itemsObject = snapshot.val() || '';
      const itemsList = Object.keys(itemsObject).map((key, index) => ({
        ...itemsObject[key],
        uid: key,
      }));
        this.setState({
          items: itemsList,
        })
      });

    }

    componentWillUnmount() {
      const userkey = this.props.match.params.userid;
      const storekey = this.props.match.params.uid;
      firebase.database().ref(`stores/users/${userkey}/${storekey}/`).off();
      firebase.database().ref(`items/users/${userkey}/`).off();
    }

  render() {
    const { items, storeImg, storeName, storeDesc, storeCat, storeId, userLocation, userWhatsapp} = this.state;

    const pretext = "I'm interested in:";

    return (
      <Col md={{span:6, offset:3}}>
        <ul>
             <li key={storeId} index={storeId} className="messages" >
                <Row>
                  <Col xs sm md className="storeHeader">
                    <div className="chat">
                    <div className="storeImg">
                    <Image src={storeImg + `/-/scale_crop/500x500/center/` || `https://via.placeholder.com/150`}/>
                    </div>
                    <h2>{storeName}</h2>
                    <span className="city">{userLocation}</span>
                    <span className="timestamp">{storeDesc}</span>
                    <span className="cat">{storeCat}</span>
                    </div>
                  </Col>
                </Row>
             </li>
        </ul>

        <ul style={{marginBottom:`100px`,}}>

          {Object.keys(items).map((key, index) => {
             return (
               <li className="messages" key={key} index={index} style={{marginBottom:`20px`,}}>
                 <div className="itemTitle">
                   <Row>
                   <Col>
                       <span className="producttitle">{items[key].item}</span>
                       <span className="pricing">R{items[key].price}</span>
                   </Col>
                   </Row>
                 </div>
                 <div className="itemImg mb-0">
                 <Image src={items[key].imgUrl + `/-/scale_crop/500x500/center/` || "https://via.placeholder.com/150"}/>
                 </div>
                <div className="chat store">
                  <Row>
                  <Col xs={12} sm={9} md={9}>
                    <span className="timestamp">{items[key].description}</span>
                    <span className="cat">{items[key].category}</span>
                    <Button className="storebtn" target="_blank" href={`https://wa.me/27${userWhatsapp}/?text=${pretext}%20${items[key].item}%20|%20${items[key].description}%20(R${items[key].price})`}>Message</Button>
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

export default StoresPageNonAuth;
