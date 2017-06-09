import { combineReducers } from 'redux';
import { LOG_IN, LOG_OUT, ONLINE, OFFLINE } from './actions';

const initialState = {
  isLoggedIn: false,
  isOnline: false,
  user: null,
  userLocationPin: null
};

function userReducer(state = initialState, action) {
  console.log('userReducer! - %s', action.type);
  switch (action.type) {

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
        isOnline: true,
        userLocationPin: action.userLocationPin
      })
      break;

    case OFFLINE:
      return Object.assign({}, state, {
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
