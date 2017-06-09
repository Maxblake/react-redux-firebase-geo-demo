import React, { Component } from 'react';
import { connect } from 'react-redux';
import {login, logout, online, offline} from './Redux/actions';
import logo from './logo.svg';
import './App.css';
import Login from './Login/Login';
import Location from './Location/Location';
import OnlineUsers from "./Users/OnlineUsers"
import {FirebaseAuth} from './Repository/Firebase';
import {LocationStore} from './Repository/Firebase';

class App extends Component {

  constructor(props) {
    super(props);

    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.onLine = this.onLine.bind(this);
    this.offLine = this.offLine.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    console.log('App did mount');
    FirebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, "login without save"
        var userToAutoLogin = {
            "id": user.uid,
            "email": user.emailVerified,
            "name": user.displayName,
            "photoURL": user.photoURL
        };

        console.log("Already logged in as %s", userToAutoLogin.id);
        this.onLogin(userToAutoLogin);
      }
    });
  }

  onLogin(loggedInUser) {
    console.log('App has seen new login');

    this.props.dispatch(login(loggedInUser));

    // init APP state (isOnline) from the DB
    LocationStore.getLocation(loggedInUser.id)
      .then((location) => {
        var updatedState = {
          isLoggedIn: true,
          user: loggedInUser
        };
        if (location) {
          console.log("User is already online at %s", location);
          // TODO hook up this flow into Redux
          updatedState.userLocationPin = location;
          updatedState.isOnline = true;
        }
      });

  }

  onLogout() {
    LocationStore.removeLocation(this.props.user.id)
      .then(() => {
        this.props.dispatch(logout());
      });
  }

  onLine(userLocationPin) {
    console.log('App state moving online');
    this.props.dispatch(online(userLocationPin));
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
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <Login name={name} isLoggedIn={isLoggedIn} onLogin={this.onLogin} onLogout={this.onLogout}/>
        {isLoggedIn && <Location userId={user.id} isOnline={isOnline} onLine={this.onLine} offLine={this.offLine} />}
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

export default connect(mapStateToProps)(App)
