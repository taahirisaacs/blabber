import React from 'react';
import { BrowserRouter as Router, Route, } from 'react-router-dom';

import '../bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import LandingCat from '../Landing/filterCategories';
import FilterFood from '../Landing/filterFood';
import FilterClothing from '../Landing/filterClothing';
import FilterElec from '../Landing/filterElec';
import FilterCars from '../Landing/filterCars';
import FilterServices from '../Landing/filterServices';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import BlobPage from '../Blob';
import StoresPage from '../Stores';
import StoresPageNonAuth from '../StoresNonAuth';
import Orders from '../Orders';
import Explore from '../Explore';
import Settings from '../Settings';
import NewItem from '../NewItem';
import Profile from '../Profile';
import Items from '../Items';
import Search from '../Search';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

const App = () => (
      <Router>
        <Navigation />
        <Container fluid className="px-0 pb-5 mb-2">
          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <Route exact path={ROUTES.LANDING_CAT} component={LandingCat} />
          <Route exact path={ROUTES.FILT_FOOD} component={FilterFood} />
          <Route exact path={ROUTES.FILT_CLOTHING} component={FilterClothing} />
          <Route exact path={ROUTES.FILT_ELEC} component={FilterElec} />
          <Route exact path={ROUTES.FILT_CAR} component={FilterCars} />
          <Route exact path={ROUTES.FILT_SERVICES} component={FilterServices} />
          <Route path={ROUTES.ORDERS} component={Orders} />
          <Route path={ROUTES.EXPLORE} component={Explore} />
          <Route path={ROUTES.SETTINGS} component={Settings} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
          <Route path={ROUTES.HOME} component={HomePage}/>
          <Route path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route path={ROUTES.ADMIN} component={AdminPage} />
          <Route path={ROUTES.NEWITEM} component={NewItem} />
          <Route path="/blob/:dataId" component={BlobPage} />
          <Route path={"/search"} component={Search} />
          <Route exact path="/store/:userid/:uid" component={Profile} />
          <Route exact path="/items/:storeid/:itemid" component={Items} />
        </Container>
      </Router>
);

export default withAuthentication(App);
