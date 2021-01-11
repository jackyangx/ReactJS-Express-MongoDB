import { TypeMap } from '../actions/index';
export default (state = {}, action) => {
  const { payload } = action;
  switch (action.type) {
    case TypeMap.USER_UPDATE:
    case TypeMap.USER_LOGIN:
      state.info = payload; // = {...state, ...payload};
      break;
    case TypeMap.USER_SIGNUP:
      state.signUp = payload;
      break;
    case TypeMap.USER_401:
      delete state.info
      delete state.signUp;
      break;
    default:
  }

  return state;
};
