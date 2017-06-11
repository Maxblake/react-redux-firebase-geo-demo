import { combineReducers } from 'redux';
import { REQUEST_GEO_LOCATION, LOG_IN, LOG_OUT, ONLINE, OFFLINE } from './actions';

const initialState = {
  isLoading: true,
  isLoggedIn: false,
  isOnline: false,
  user: null,
  userLocationPin: null
};

function userReducer(state = initialState, action) {
  switch (action.type) {

    case REQUEST_GEO_LOCATION:
      return Object.assign({}, state, {
        isLoading: true
      })
      break;

    case LOG_IN:
      return Object.assign({}, state, {
        isLoggedIn: true,
        user: action.user
      })
      break;

    case LOG_OUT:
      return Object.assign({}, state, {
        isLoggedIn: false,
        isOnline: false,
        user: null,
        userLocationPin: null
      })
      break;

    case ONLINE:
      return Object.assign({}, state, {
        isLoading: false,
        isOnline: true,
        userLocationPin: action.userLocationPin
      })
      break;

    case OFFLINE:
      return Object.assign({}, state, {
        isLoading: false,
        isOnline: false,
        userLocationPin: null
      })
      break;

    default:
      return state;
  }
}

const rootReducer = combineReducers({
  userReducer
})

export default rootReducer;
