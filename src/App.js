import React, { Component } from 'react';
import { connect } from 'react-redux';
import {initSocialLogin} from './Redux/actions';
import logo from './logo.svg';
import './App.css';
import Loading from './Generic/Loading';
import AppPanel from './Containers/AppPanel';

class App extends Component {

  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    console.log('App did mount');
    const { dispatch } = this.props;
    dispatch(initSocialLogin());
  }

  render() {
    const isLoading = this.props.isLoading;

    let appPanel = null;
    if (isLoading) {
      appPanel = <Loading />;
    } else {
      appPanel = <AppPanel />;
    }

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        {appPanel}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isLoading } = state.userReducer
  return {
    isLoading
  }
}

export default connect(mapStateToProps)(App)
