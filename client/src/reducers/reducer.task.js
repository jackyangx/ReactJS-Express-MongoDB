import {TypeMap} from '../actions';

export default (state = {}, action) => {
  const {payload} = action;
  switch (action.type) {
    case TypeMap.TASK_USER_LIST:
      state.userList = payload;
      break;
    case TypeMap.LOADING_HIDE:
      state.isLoading = false;
      break;
    default:
      return state;
  }

  return state;
};
