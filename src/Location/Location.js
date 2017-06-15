import React, {Component} from 'react';
import {LocationStore} from '../Repository/Firebase';
import {online, initOffline, initMoveOnline} from '../Redux/actions';
import { connect } from 'react-redux';

class Location extends Component {
  constructor(props) {
    super(props);

    this.handleOnline = this.handleOnline.bind(this);
    this.handleOffline = this.handleOffline.bind(this);
  }

  handleOnline() {
    this.props.dispatch(initMoveOnline(this.props.user.id));
  }

  handleOffline() {
    this.props.dispatch(initOffline(this.props.user.id));
  }

  render() {
    const isOnline = this.props.isOnline;
    let button = null;

    if (isOnline) {
      button = <button onClick={this.handleOffline}> Hide your location from other users </button>;
    } else {
      button = <button onClick={this.handleOnline}> Show your location to other users </button>;
    }

    return (
      <div className="LocationControl">{button}</div>
    )
  }
}

// TODO is there a nicer way of doing this per component?
function mapStateToProps(state) {
  const { isOnline, user } = state.userReducer

  return {
    isOnline,
    user
  }
}

export default connect(mapStateToProps)(Location)
