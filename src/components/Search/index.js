import React, { Component } from 'react';
import { LinkContainer } from "react-router-bootstrap";
import { NavLink, Link } from 'react-router-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import TextTruncate from 'react-text-truncate';
import queryString from 'query-string';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Uploader from './../Uploader';
import FooterNavigation from '../Navigation/footer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

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

import firebase from 'firebase/app';

import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

const algoliasearch = require('algoliasearch');
const PROJECT_ID = 'blabber-2fef9';          // Required - your Firebase project ID
const ALGOLIA_APP_ID = 'WQJ5Z7N2SV';     // Required - your Algolia app ID
const ALGOLIA_SEARCH_KEY = '8172cbec423eced5e7ac8eda3cb4bf02'; // Optional - Only used for unauthenticated search

class Search extends Component {
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
          index: 0,
        };

        this.search= this.search.bind(this);
      }

      componentDidMount(){

          this.setState({ loading: true });
          this.getItems();
          this.fromDB();
          this.unauthenticated_search();
      }

      componentWillUnmount() {
        if(this.unsubscribe)
          this.unsubscribe();
      }

        fromDB = () => {
        const db = firebase.firestore();
        const itemDatas = db.collection("items").get()
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

        this.subscribe = db.collection("items").orderBy("timestamp", "desc").limit(25).get()
        .then(snap => {
          const items= {}
          snap.forEach(doc => {
          items[doc.id] = doc.data()
          })
          this.setState({items, loading: false})
        })
      }

      unauthenticated_search = () => {

        const values = queryString.parse(this.props.location.search)
        const query = values.query;
        // [START search_index_unsecure]
        const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
        const index = client.initIndex('items');

        // Perform an Algolia search:
        // https://www.algolia.com/doc/api-reference/api-methods/search/
        index
          .search({
            query: query,
            attributesToRetrieve: ['*'],
            attributesToHighlight: ['*'],
            facets: ['*'],
            hitsPerPage: 50,
            minWordSizefor1Typo: 4,
            typoTolerance: true

          })
          .then((responses) => this.setState({ response: responses.hits }));
        // [END search_index_unsecure]
      }

      search = (event) => {
        const {where} = this.state;
        const query = where;
        console.log(query);
        if (!PROJECT_ID) {
          console.warn('Please set PROJECT_ID in /index.js!');
        } else if (!ALGOLIA_APP_ID) {
          console.warn('Please set ALGOLIA_APP_ID in /index.js!');
        } else if (ALGOLIA_SEARCH_KEY) {
          console.log('Performing unauthenticated search...');
          return this.unauthenticated_search(query);
        }
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

      onChange = event => {
        this.setState({ [event.target.name]: event.target.value});
      };

      render () {

        const { items, loading, response, index } = this.state;
        const itemUrl = window.location.href;
        const values = queryString.parse(this.props.location.search)
        const query = values.query;
        console.log(response);

        return (
            <Container fluid style={{paddingTop:`10px`}}>
              <Row>
                <Col className="mt-2">
                <h4 className="catTitle">"{query}" in your area</h4>
                <Row className="tabbar mx-0">
                  <Col md>
                    <Tabs TabIndicatorProps={{style: {backgroundColor:`#6a7b95`}}} value={index} variant="fullWidth"  onChange={this.handleChange} >
                      <Tab label="Items" />
                      <Tab label="Stores" />
                    </Tabs>
                  </Col>
                </Row>
                <SwipeableViews index={index} onChangeIndex={this.handleChangeIndex}>

                  <Row className="px-2">
                  <Col md={{span:6, offset:3}}>
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
                  </Col>
                  </Row>

                  <Row className="px-2">
                  <Col md={{span:6, offset:3}}>
                  {Object.keys(response).map((res, index) => {
                    return (
                      <li className="messages" key={res} index={res}>
                        <div className="chat">

                          <Row>
                            <Col xs={4} sm={3} md={3}>
                              <div className="itemImg storeList">
                                {response[res].imgUrl && <Image src={response[res].imgUrl + `/-/scale_crop/500x500/center/` || ''}/>}

                              </div>
                            </Col>
                            <Col xs={8} sm={9} md={9} style={{ paddingLeft: `0` }}>
                              <Link to={`/store/${response[res].user}/${response[res].store.id}`}>
                                <h2>{response[res].store.name}</h2>
                                <TextTruncate
                                  className="timestamp"
                                  line={1}
                                  truncateText="…"
                                  text="Milnerton, Cape Town"
                                />
                                <span className="stars">
                                  <FontAwesomeIcon icon={faStar} />
                                  <FontAwesomeIcon icon={faStar} />
                                  <FontAwesomeIcon icon={faStar} />
                                  <FontAwesomeIcon icon={faStar} />
                                  <FontAwesomeIcon icon={faStar} />
                                </span>
                              </Link>
                            </Col>

                          </Row>

                        </div>
                      </li>
                    );
                  })}
                  </Col>
                  </Row>

                </SwipeableViews>

                </Col>
              </Row>

            </Container>
        );
      }

}

export default Search;
