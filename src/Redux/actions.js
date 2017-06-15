import {FirebaseAuth} from '../Repository/Firebase';
import {UserStore} from '../Repository/Firebase';
import {LocationStore} from '../Repository/Firebase';

export const REQUEST_SOCIAL_USER = 'REQUEST_SOCIAL_USER';
export const REQUEST_LOCATION = 'REQUEST_LOCATION';
export const REQUEST_GEO_LOCATION = 'REQUEST_GEO_LOCATION';
export const LOG_IN = 'LOG_IN';

export const REQUEST_LOG_OUT = 'REQUEST_LOG_OUT';
export const LOG_OUT = 'LOG_OUT';

export const ONLINE = 'ONLINE';

export const REQUEST_OFFLINE = 'REQUEST_OFFLINE';
export const OFFLINE = 'OFFLINE';

/**
  FLOW:
  Init app "loading"
  checkForNewLogin  -> FB Login Found -> Save User -> login state
                    -> OR FB login not found -> Wait for Firebase Login -> login state

*/

/**
  Commands: something we want to happen
*/

export function requestSocialUser() {
  return {
    type: REQUEST_SOCIAL_USER
  }
};

export function requestLocation(userId) {
  return {
    type: REQUEST_LOCATION,
    userId: userId
  }
};

export function requestGeoLocation() {
  return {
    type: REQUEST_GEO_LOCATION
  }
};

export function requestOffline() {
  return {
    type: REQUEST_OFFLINE
  }
};

export function requestLogout() {
  return {
    type: REQUEST_LOG_OUT
  }
};

/**
  Events: something happened
*/

export function login(user) {
  return {
    type: LOG_IN,
    user: user
  }
};

export function logout() {
  return {
    type: LOG_OUT
  }
};

export function online(userLocationPin) {
  return {
    type: ONLINE,
    userLocationPin: userLocationPin
  }
};

export function offline() {
  return {
    type: OFFLINE
  }
};

/**
  Action thunks: dispatch actions and do stuff
*/

// TODO handle error states
export function initSocialLogin() {
  return (dispatch) => {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.
    dispatch(requestSocialUser());

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.
    FirebaseAuth().getRedirectResult()
      .then(loginResult => {
        if (loginResult.credential) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = loginResult.credential.accessToken;
            console.log('Received Facebook access token %s', token);
        }

        // The signed-in user info.
        var user = loginResult.user;
        if (!user) {
          console.log('No social login redirect found');
          dispatch(initFirebaseLogin());
          return;
        }

        console.log("*** Logged in as user: " + user.displayName + " ***");

        UserStore.saveUser(user.uid, user.email, user.displayName, user.photoURL)
          .then(savedUser => dispatch(initLogin(savedUser)));
      })
      .catch(error => {
          console.error('Failed to find auth result: %s', error.message);
      });
  }
}

export function initFirebaseLogin() {
  return (dispatch) => {
    FirebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, "login without save"
        var userToAutoLogin = {
            "id": user.uid,
            "email": user.email,
            "name": user.displayName,
            "photoURL": user.photoURL
        };

        console.log("Already logged in as %s", userToAutoLogin.id);
        dispatch(initLogin(userToAutoLogin));
      } else {
        // for now don't bother with a new action for "anonymous login"
        dispatch(logout());
      }
    });
  };
}

export function initLogin(user) {
  return (dispatch) => {
    dispatch(login(user));
    // TODO is this bad practice - two dispatch in a row?
    dispatch(initOnlineCheck(user.id));
  };
};

// init APP state (isOnline) from the DB
export function initOnlineCheck(userId) {
  return (dispatch) => {
    dispatch(requestLocation(userId));
    LocationStore.getLocation(userId)
      .then((userLocationPin) => {
        if (userLocationPin) {
          console.log("User is already online at %s", userLocationPin);
          dispatch(online(userLocationPin));
        } else {
          dispatch(offline());
        }
      });
  };
}

export function initMoveOnline(userId) {
  return (dispatch) => {
    dispatch(requestGeoLocation());
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser');
      return;
    }

    var that = this;
    navigator.geolocation.getCurrentPosition((position) => {

      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      console.log("User is located at lat: " + latitude + " lng: " + longitude);

      LocationStore.saveLocation(userId, latitude, longitude)
        .then(() => dispatch(online([latitude, longitude])));
    });
  };
};

export function initOffline(userId) {
  return (dispatch) => {
    dispatch(requestOffline(userId));
    LocationStore.removeLocation(userId)
      .then(() => {
        dispatch(offline());
      });
  };
};

export function initLogout(userId) {
  return (dispatch) => {
    dispatch(requestLogout());
    // first go offline
    LocationStore.removeLocation(userId)
      .then(() => {
        // then actually logout
        FirebaseAuth().signOut()
          .then(() => dispatch(logout()));
      });
  };
};
