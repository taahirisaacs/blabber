import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TextTruncate from 'react-text-truncate';

import Typography from '@material-ui/core/Typography';
import Uploader from './../Uploader';
import FooterNavigation from '../Navigation/footer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore } from '@fortawesome/free-solid-svg-icons';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import TextareaAutosize from 'react-autosize-textarea';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Spinner from 'react-bootstrap/Spinner';
import CategoryList from '../Category';

import firebase from 'firebase/app';

import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

const algoliasearch = require('algoliasearch');
const PROJECT_ID = 'blabber-2fef9';          // Required - your Firebase project ID
const ALGOLIA_APP_ID = 'WQJ5Z7N2SV';     // Required - your Algolia app ID
const ALGOLIA_SEARCH_KEY = '8172cbec423eced5e7ac8eda3cb4bf02'; // Optional - Only used for unauthenticated search



class filterCategories extends Component {
  constructor(props) {
    super(props);

        this.state = {
          loading: false,
          items: [],
          stores: '',
          copied: false,
          cta: '',
          where: [],
          query: '',
          response: [],
        };
      }

      componentDidMount(){
          document.title = "An online marketplace for local traders & micro businesses. | Tiny Trader"
          this.setState({ loading: true });
          this.getItems();
          this.fromDB();

      }

        fromDB = () => {
        const db = firebase.firestore();
        db.collection("items").get()
        .then(function(querySnapshot) {
              const itemData = [];
                querySnapshot.forEach(function(doc) {
                  itemData.push({
                    name: doc.data().name,
                    description: doc.data().description,
                    timestamp: doc.data().timestamp,
                    price: doc.data().price,
                    category: doc.data().category,
                    objectID: doc.id
                  })
                })
        })
      }

      getItems = () => {
        const db = firebase.firestore();

        db.collection("items").orderBy("timestamp", "desc").limit(25).get()
        .then(snap => {
          const items= {}
          snap.forEach(doc => {
          items[doc.id] = doc.data()
          })
          this.setState({items, loading: false});
        })
      }


      search = (event) => {
        const { where } = this.state;
        const query = where;

        this.props.history.push(`/search?query=${query}`);
      }

      onKeyPressSearch = (event) => {
        const {where} = this.state;
        const query = where;

        if(event.charCode == 13){
          event.preventDefault();
          this.props.history.push(`/search?query=${query}`);
        }
      }




      onChange = event => {
        this.setState({ [event.target.name]: event.target.value});
      };

      render () {

        const { items, loading, response } = this.state;
        const itemUrl = window.location.href;

        return (
            <Container fluid style={{paddingTop:`10px`}}>


              <Form className="homeSearch">

                <InputGroup
                  onKeyPress={this.onKeyPressSearch}
                >
                  <Form.Control
                    name="where"
                    value={this.state.where || ''}
                    onChange={this.onChange}
                    type="text"
                    className="formSearch"
                    placeholder="Try Food, Cars, Movers, etc"
                  />
                  <InputGroup.Append className="p-0">
                    <Button className="searchBtn"  onClick={this.search}>Go</Button>
                  </InputGroup.Append>
                </InputGroup>
              </Form>
                <ul>
                  {Object.keys(response).map((res, index) => {
                    return (
                      <li className="messages" key={res} index={res}>
                        <div className="chat">

                          <Row>
                            <Col xs={4} sm={3} md={3}>
                              <div className="itemImg">
                                {response[res].imgUrl && <Image src={response[res].imgUrl + `/-/scale_crop/500x500/center/` || ''}/>}

                              </div>
                            </Col>
                            <Col xs={8} sm={9} md={9} style={{ paddingLeft: `0` }}>
                              <Link to={`/items/${response[res].store.id}/${response[res].itemId}`}>
                                <h2>{response[res].name}</h2>
                                <span className="pricing">R{response[res].price}</span>
                                <TextTruncate
                                  className="timestamp"
                                  line={1}
                                  truncateText="…"
                                  text={response[res].description}
                                />
                              </Link>
                            </Col>

                          </Row>

                        </div>
                      </li>
                    );
                  })}
                </ul>           
              <CategoryList />
            </Container>
        );
      }

}

export default filterCategories;
