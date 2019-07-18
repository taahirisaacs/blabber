import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TextTruncate from 'react-text-truncate';
import {Helmet} from "react-helmet";
import Moment from 'react-moment';

import Typography from '@material-ui/core/Typography';
import Uploader from './../Uploader';
import FooterNavigation from '../Navigation/footer';
import AlgoliaPlaces from 'algolia-places-react';

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

class filterBlogSingle extends Component {
  constructor(props) {
    super(props);
        this.state = {
           loading: false,
           posts: [],
           id: this.props.match.params.id,
         };
       }

      async componentDidMount() {
        this.setState({ loading: true });
        const {id} = this.state;
       try {
         const posts = await strapi.getEntries(`posts/${id}`)
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
                <title>{`${posts.title}`} | TinyBlog by TinyTrader</title>
              </Helmet>
              {loading && <div style={{textAlign:`center`,}}><Spinner animation="grow" variant="light" /></div>}
              <h1 className="landingBlogTitle">{posts.title}</h1>
              <h3 className="pageSubTitleCat">posted <Moment fromNow>{posts.createdAt}</Moment></h3>
                <div className="chatBlock">
                 <ReactMarkdown source={posts.content} />
               </div>
               <Link to={ROUTES.SIGN_UP}>
                 <span className="poweredby">Join +250 traders ready for business →</span>
               </Link>
            </Container>
        );
      }

}

export default filterBlogSingle;
