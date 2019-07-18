import React, { Component } from 'react';

import { withAuthorization } from '../Session';

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  componentDidMount() {
     this.setState({ loading: true });

     this.props.firebase.users().on('value', snapshot => {
       const usersObject = snapshot.val();

       const usersList = Object.keys(usersObject).map(key => ({
         ...usersObject[key],
         uid: key,
       }));

       this.setState({
         users: usersList,
         loading: false,
       });
     });
   }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    const { users, loading } = this.state;

    return (
      <div>

      </div>
    );
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AdminPage);
