import React, { Component } from 'react';
import { connect } from 'react-redux';
import {initSocialLogin, login, logout, online, offline} from '../Redux/actions';
import Login from '../Login/Login';
import Location from '../Location/Location';
import OnlineUsers from "../Users/OnlineUsers"
import {FirebaseAuth} from '../Repository/Firebase';
import {LocationStore} from '../Repository/Firebase';

class AppPanel extends Component {

  constructor(props) {
    super(props);

    this.onLogout = this.onLogout.bind(this);
    this.offLine = this.offLine.bind(this);
  }

  onLogout() {
    LocationStore.removeLocation(this.props.user.id)
      .then(() => {
        this.props.dispatch(logout());
      });
  }

  offLine(userId) {
    console.log('App state moving offline');

    LocationStore.removeLocation(userId)
      .then(() => {
        this.props.dispatch(offline());
      });
  }

  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const isOnline = this.props.isLoggedIn && this.props.isOnline;
    const user = this.props.user;
    const name = this.props.user ? this.props.user.name : "Unknown";
    const userLocationPin = this.props.userLocationPin;

    return (
      <div>
      <Login name={name} isLoggedIn={isLoggedIn} onLogout={this.onLogout}/>
      {isLoggedIn && <Location userId={user.id} isOnline={isOnline} offLine={this.offLine} />}
      {isOnline && <OnlineUsers userLocationPin={userLocationPin} />}
      </div>
    );
  }
}

// TODO review this...
// App.propTypes = {
//
//   dispatch: PropTypes.func.isRequired
// }

function mapStateToProps(state) {
  const { isLoggedIn, isOnline, user, userLocationPin } = state.userReducer

  return {
    isLoggedIn,
    isOnline,
    user,
    userLocationPin
  }
}

export default connect(mapStateToProps)(AppPanel)
