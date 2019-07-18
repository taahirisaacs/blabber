import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TextTruncate from 'react-text-truncate';
import {Helmet} from "react-helmet";
import Moment from 'react-moment';

import Typography from '@material-ui/core/Typography';
import Uploader from './../Uploader';
import FooterNavigation from '../Navigation/footer';
import AlgoliaPlaces from 'algolia-places-react';
import Navbar from 'react-bootstrap/Navbar';

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
import Strapi from 'strapi-sdk-javascript/build/main';
import ReactMarkdown from 'react-markdown';

import firebase from 'firebase/app';

import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

const strapi = new Strapi('https://tinytrader.herokuapp.com');

class filterBlog extends Component {
  constructor(props) {
    super(props);
        this.state = {
           posts: [],
           loading: false,
         };
       }

      async componentDidMount() {
      this.setState({ loading: true });
       try {
         const posts = await strapi.getEntries('posts')
         this.setState({ posts, loading: false });
       }
       catch(err) {
        alert(err);
       }
      }

      render () {
        const { posts, loading } = this.state;
        return (
            <Container fluid style={{paddingTop:`10px`}}>
              <Helmet>
                <meta charSet="utf-8" />
                <title>TinyBlog for micro-businesses by TinyTrader</title>
                <meta name="description" content="A collection of posts & resources for micro & home-based businesses." />
              </Helmet>
                <h3 className="landingPitch">A collection of posts & resources for micro & home-based businesses.</h3>
              <h1 className="landingBlogTitle">TinyBlog ✍🏼</h1>
              {loading && <div style={{textAlign:`center`,}}><Spinner animation="grow" variant="light" /></div>}
              {Object.keys(posts).map((post, index) => {
                return (
                <Link className="chatLink" key={post} index={index} to={`/blog/${posts[post].id}/${posts[post].title}`}>
                <div className="chatBlock">
                 <h1>{posts[post].title}</h1>
                 <span className="timestamp">posted <Moment fromNow>{posts[post].createdAt}</Moment></span>
                   <TextTruncate
                     line={2}
                     truncateText="…"
                     text={posts[post].content}
                   />
                 <span className="cat">{posts[post].tags[0].name}</span>
               </div>
               </Link>
              );
              })}
            </Container>
        );
      }

}

export default filterBlog;
