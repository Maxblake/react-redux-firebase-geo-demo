export const LOG_IN = 'LOG_IN';
export const LOG_OUT = 'LOG_OUT';
export const ONLINE = 'ONLINE';
export const OFFLINE = 'OFFLINE';

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
