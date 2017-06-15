import React, { Component } from 'react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import {FirebaseAuth} from '../Repository/Firebase';

/**
 * If logged out:
 *  - display invitation to login and LoginButton
 *
 * If logged in:
 *  - display invitation to login and LoginButton
 **/
class Login extends Component {

  constructor(props) {
    super(props);

    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }

  handleLoginClick() {
    var provider = new FirebaseAuth.FacebookAuthProvider();

    provider.addScope('public_profile');
    provider.addScope('user_friends');
    provider.addScope('email');

    FirebaseAuth().signInWithRedirect(provider);
  }

  handleLogoutClick() {
    this.props.onLogout();
  }

  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const name = this.props.name;
    let button = null;

    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div className="LoginControl">
        {isLoggedIn ? (<h3>Logged in as {name}</h3>) : (<h3>Not logged in</h3>)}
        {button}
      </div>
    )
  }

  componentDidMount() {
    console.log('Login component mounted');
  }

  componentWillUnmount() {
    console.log('Login component will unmount');
  }
}

export default Login;
