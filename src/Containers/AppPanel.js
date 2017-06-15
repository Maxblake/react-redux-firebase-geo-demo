import React, { Component } from 'react';
import { connect } from 'react-redux';
import {initLogout, initOffline} from '../Redux/actions';
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
    this.props.dispatch(initLogout(this.props.user.id));
  }

  offLine(userId) {
    this.props.dispatch(initOffline(this.props.user.id));
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
