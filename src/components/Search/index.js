import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TextTruncate from 'react-text-truncate';
import queryString from 'query-string';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { reverse } from 'named-urls';

import CategoryList from '../Category';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';

import firebase from 'firebase/app';

import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

const algoliasearch = require('algoliasearch');
const PROJECT_ID = 'blabber-2fef9';          // Required - your Firebase project ID
const ALGOLIA_APP_ID = 'WQJ5Z7N2SV';     // Required - your Algolia app ID
const ALGOLIA_SEARCH_KEY = '8172cbec423eced5e7ac8eda3cb4bf02'; // Optional - Only used for unauthenticated search

const INITIAL_STATE = {
  loading: false,
};

class Search extends Component {
  constructor(props) {
    super(props);

        this.state = { ...INITIAL_STATE };
        this.state = {
          items: [],
          stores: '',
          copied: false,
          cta: '',
          where: [],
          query: '',
          responseItems: [],
          responseStores: [],
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

        const values = queryString.parse(this.props.location.search);
        const query = values.query;
        // [START search_index_unsecure]
        const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);

        const queries = [{
              indexName: 'items',
              query: query,
              params: {
                attributesToRetrieve: ['*'],
                attributesToHighlight: ['*'],
                facets: ['*'],
                hitsPerPage: 10,
                minWordSizefor1Typo: 4,
                typoTolerance: true
              }
            }, {
              indexName: 'stores',
              query: query,
              params: {
                attributesToRetrieve: ['*'],
                attributesToHighlight: ['*'],
                facets: ['*'],
                hitsPerPage: 10,
                minWordSizefor1Typo: 4,
                typoTolerance: true
              }
            }];

            client.search(queries, (err, { results } = {}) => {
            if (err) throw err;
            console.log(results);
            this.setState({ responseItems: results[0].hits, responseStores: results[1].hits  });
          });
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

        const { loading, responseItems, responseStores, index } = this.state;
        const values = queryString.parse(this.props.location.search)
        const query = values.query;

        return (
            <Container fluid style={{paddingTop:`10px`}}>
              {loading && <div style={{textAlign:`center`,}}><Spinner animation="grow" variant="light" /></div>}
              <Row>

                <Col className="mt-2">
                  <h4 className="catTitle">"{query}" near you</h4>

                  <Row className="tabbar mx-0">
                    <Col md>
                      <Tabs TabIndicatorProps={{style: {backgroundColor:`#6a7b95`}}} value={index} variant="fullWidth"  onChange={this.handleChange} >
                        <Tab label={"Traders " + "(" + responseStores.length + ")"} />
                        <Tab label={"Items " + "(" + responseItems.length + ")"} />

                      </Tabs>
                    </Col>
                  </Row>

                  <SwipeableViews animateHeight index={index} onChangeIndex={this.handleChangeIndex}>

                    <Row className="px-2">
                      {responseStores.length ? (
                        <Col md={{span:6, offset:3}}>

                          {Object.keys(responseStores).map((res, index) => {
                            return (
                              <li className="messages" key={res} index={res}>
                                <div className="chat">

                                  <Row>
                                    <Col xs={4} sm={3} md={3}>
                                      <div className="itemImg storeList">
                                        {responseStores[res].imgUrl && <Image src={responseStores[res].imgUrl} fluid/>}

                                      </div>
                                    </Col>
                                    <Col xs={8} sm={9} md={9} style={{ paddingLeft: `0` }}>
                                      <Link to={`/store/${responseStores[res].user}/${responseStores[res].objectID}`}>
                                        <h2>{responseStores[res].name}</h2>
                                        <TextTruncate
                                          className="timestamp"
                                          line={1}
                                          truncateText="…"
                                          text={responseStores[res].description}
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
                      ) : (
                        <Col className="mt-2">
                          <h4 className="badSearchTitle"><span className="badSearchIcon">😟</span>Sorry, no "{query}" traders found near you</h4>

                        </Col>
                      )}
                    </Row>

                    <Row className="px-2">
                      {responseItems.length ? (
                        <Col md={{span:6, offset:3}}>

                          {Object.keys(responseItems).map((res, index) => {
                            return (
                              <li className="messages" key={res} index={res}>
                                <div className="chat">

                                  <Row>
                                    <Col xs={4} sm={3} md={3}>
                                      <div className="itemImg">
                                        {responseItems[res].imgUrl && <Image src={responseItems[res].imgUrl + `/-/scale_crop/500x500/center/` || ''} fluid />}

                                      </div>
                                    </Col>
                                    <Col xs={8} sm={9} md={9} style={{ paddingLeft: `0` }}>
                                      <Link to={`/items/${responseItems[res].store.id}/${responseItems[res].itemId}`}>
                                        <h2>{responseItems[res].name}</h2>
                                        <span className="pricing">R{responseItems[res].price}</span>
                                        <TextTruncate
                                          className="timestamp"
                                          line={1}
                                          truncateText="…"
                                          text={responseItems[res].description}
                                        />
                                      </Link>
                                    </Col>

                                  </Row>

                                </div>
                              </li>
                            );
                          })}

                        </Col>
                      ) : (
                        <Col className="mt-2">
                          <h4 className="badSearchTitle"><span className="badSearchIcon">😟</span>Sorry, no items found for "{query}"</h4>
                        </Col>
                      )}
                    </Row>

                  </SwipeableViews>

                </Col>

              </Row>
              <Row>
                <Col className="mt-2">
                  <Link to={ROUTES.BETA}>
                    <span className="poweredby">Join +250 traders ready for business →</span>
                  </Link>
                </Col>
              </Row>

            </Container>
        );
      }

}

export default Search;
