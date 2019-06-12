import React from 'react';
import { LinkContainer } from "react-router-bootstrap";

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import StoresPage from '../Stores';
import StoresPageNonAuth from '../StoresNonAuth';
import StoresPageAuth from '../Stores';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

const Profile = (props) => (
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <StoresPageAuth {...props} /> : <StoresPageNonAuth {...props} />
      }
    </AuthUserContext.Consumer>
);

export default Profile;
