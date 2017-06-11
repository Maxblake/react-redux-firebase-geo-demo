import React, {Component} from 'react';
import {LocationStore} from '../Repository/Firebase';
import {online, offline, requestGeoLocation} from '../Redux/actions';
import { connect } from 'react-redux';

class Location extends Component {
  constructor(props) {
    super(props);

    this.handleOnline = this.handleOnline.bind(this);
    this.handleOffline = this.handleOffline.bind(this);
  }

  handleOnline() {
    this.props.dispatch(requestGeoLocation());
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser');
      return;
    }

    var that = this;
    navigator.geolocation.getCurrentPosition(function(position) {

      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      console.log("User is located at lat: " + latitude + " lng: " + longitude);

      LocationStore.saveLocation(that.props.userId, latitude, longitude)
        .then(() => {
          that.props.dispatch(online([latitude, longitude]));
        });
    });
  }

  handleOffline() {
    this.props.dispatch(offline());
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
  const { isOnline } = state.userReducer

  return {
    isOnline
  }
}

export default connect(mapStateToProps)(Location)
