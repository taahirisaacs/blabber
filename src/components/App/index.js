import React from 'react';
import { BrowserRouter as Router, Route, } from 'react-router-dom';

import '../bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import BlobPage from '../Blob';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

const App = () => (
      <Router>
        <Container fluid >
            <Navigation />
          <Row>
            <Col md={{ span: 6, offset: 3 }}>
                <Route path={ROUTES.LANDING} component={LandingPage} />
                <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
                <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
                <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
                <Route path={ROUTES.HOME} component={HomePage} />
                <Route path={ROUTES.ACCOUNT} component={AccountPage} />
                <Route path={ROUTES.ADMIN} component={AdminPage} />
                <Route path="/blob/:dataId" component={BlobPage} />
            </Col>
          </Row>
        </Container>
      </Router>
);

export default withAuthentication(App);
