import {async} from 'rxjs';
import Httphelper from '../common/Httphelper';
import Utility from '../common/Utility';
export const TypeMap = {
  LOADING: 'COMMON_LOADING',
  LOADING_HIDE: 'COMMON_LOADING_HIDE',
  USER_LOGIN: 'USER_LOGIN',
  USER_401: 'USER_401',
  USER_UPDATE: 'USER_UPDATE',
  USER_SIGNUP: 'USER_SIGNUP',

  TASK_USER_LIST: 'TASK_USER_LIST',
  TASK_UPDATE: 'TASK_UPDATE',
  TASK_DETAIL: 'TASK_DETAIL',
  TASK_DELETE: 'TASK_DELETE',
  TASK_ADD: 'TASK_ADD',

  PROJECT_ADD: 'PROJECT_ADD',
  PROJECT_DETAIL: 'PROJECT_DETAIL',
  PROJECT_DELETE: 'PROJECT_DELETE',
  PROJECT_DELETE_TASK: 'PROJECT_DELETE_TASK',
  PROJECT_UPDATE_TASK: 'PROJECT_UPDATE_TASK',
  PROJECT_ADD_TASK: 'PROJECT_ADD_TASK',
  PROJECT_UPDATE: 'PROJECT_UPDATE',
  PROJECT_SEARCH: 'PROJECT_SEARCH',
  PROJECT_SEARCH_CONDITION: 'PROJECT_SEARCH_CONDITION',
  PROJECT_SEARCH_MY_JOIN: 'PROJECT_SEARCH_MY_JOIN',
  PROJECT_SEARCH_MY_JOIN_CONDITION: 'PROJECT_SEARCH_MY_JOIN_CONDITION',
};

// add project task
export const taskAdd = (data) => {
  return async (dispatch) => {
    dispatch({type: TypeMap.LOADING});
    try {
      const result = await Httphelper.onPost('/api/task/' + data.project_id, {data}, dispatch);
      dispatch({type: TypeMap.PROJECT_ADD_TASK, payload: result});
      return result;
    } finally {
      dispatch({type: TypeMap.LOADING_HIDE});
    }
  };
};

// delete task by id
export const taskDelete = (id, project_id, index) => {
  return async (dispatch) => {
    dispatch({type: TypeMap.LOADING});
    try {
      const result = await Httphelper.onDelete('/api/task/' + id, {}, dispatch);
      dispatch({type: TypeMap.PROJECT_DELETE_TASK, payload: {id, project_id, index}});
      return result;
    } finally {
      dispatch({type: TypeMap.LOADING_HIDE});
    }
  };
};
// get task detail
export const taskDetail = (id) => {
  return async (dispatch) => {
    dispatch({type: TypeMap.LOADING});
    try {
      const result = await Httphelper.onGet('/api/task/' + id, {data}, dispatch);
      dispatch({type: TypeMap.TASK_DETAIL, payload: result});
      return result;
    } finally {
      dispatch({type: TypeMap.LOADING_HIDE});
    }
  };
};
// update task info
export const taskUpdate = (data, index) => {
  return async (dispatch) => {
    dispatch({type: TypeMap.LOADING});
    try {
      const result = await Httphelper.onPut('/api/task/' + data.id, {data}, dispatch);
      dispatch({type: TypeMap.PROJECT_UPDATE_TASK, payload: {result: data, index}});
      return result;
    } finally {
      dispatch({type: TypeMap.LOADING_HIDE});
    }
  };
};

// update project by id
export const projectUpdate = (data) => {
  return async (dispatch) => {
    dispatch({type: TypeMap.LOADING});
    try {
      const result = await Httphelper.onPut('/api/project/' + data.id, {data}, dispatch);
      dispatch({type: TypeMap.PROJECT_UPDATE, payload: data});
      return result;
    } finally {
      dispatch({type: TypeMap.LOADING_HIDE});
    }
  };
};

// delete project by id
export const projectDelete = (row, index) => {
  return async (dispatch) => {
    dispatch({type: TypeMap.LOADING});
    try {
      const result = await Httphelper.onDelete('/api/project/' + row.id, {}, dispatch);
      dispatch({type: TypeMap.PROJECT_DELETE, payload: {row, index}});
      return result;
    } finally {
      dispatch({type: TypeMap.LOADING_HIDE});
    }
  };
};

// get project detail by id
export const projectDetail = (id) => {
  return async (dispatch) => {
    dispatch({type: TypeMap.LOADING});
    try {
      const result = await Httphelper.onGet('/api/project/' + id, {}, dispatch);
      dispatch({type: TypeMap.PROJECT_DETAIL, payload: result});
      return result;
    } finally {
      dispatch({type: TypeMap.LOADING_HIDE});
    }
  };
};

// add project
export const projectAdd = (data) => {
  return async (dispatch) => {
    dispatch({type: TypeMap.LOADING});
    try {
      const result = await Httphelper.onPost('/api/project/', {data}, dispatch);
      dispatch({type: TypeMap.PROJECT_ADD, payload: result});
      return result;
    } finally {
      dispatch({type: TypeMap.LOADING_HIDE});
    }
  };
};

export const projectSearchKeyword = (condition) => {
  return {type: TypeMap.PROJECT_SEARCH_CONDITION, payload: condition};
};

// get my project
export const projectSearch = (data) => {
  return async (dispatch) => {
    dispatch({type: TypeMap.LOADING});
    try {
      dispatch({type: TypeMap.PROJECT_SEARCH_CONDITION, payload: data});
      const result = await Httphelper.onGet('/api/project/search', {params: data}, dispatch);
      dispatch({type: TypeMap.PROJECT_SEARCH, payload: result});
      return result;
    } finally {
      dispatch({type: TypeMap.LOADING_HIDE});
    }
  };
};
// get my join project
export const projectMyJoin = (data) => {
  return async (dispatch) => {
    dispatch({type: TypeMap.LOADING});
    try {
      dispatch({type: TypeMap.PROJECT_SEARCH_MY_JOIN_CONDITION, payload: data});
      const result = await Httphelper.onGet('/api/project/mine/list', {params: data}, dispatch);
      dispatch({type: TypeMap.PROJECT_SEARCH_MY_JOIN, payload: result});
      return result;
    } finally {
      dispatch({type: TypeMap.LOADING_HIDE});
    }
  };
};
// get my join project search condition
export const projectMyJoinCondition = (condition) => {
  return {type: TypeMap.PROJECT_SEARCH_MY_JOIN_CONDITION, payload: condition};
};

// get choosce task user list
export const taskUserList = () => {
  return async (dispatch) => {
    dispatch({type: TypeMap.LOADING});
    try {
      const data = await Httphelper.onGet('/api/task/users/list', {}, dispatch);
      dispatch({type: TypeMap.TASK_USER_LIST, payload: data});
      return data;
    } finally {
      dispatch({type: TypeMap.LOADING_HIDE});
    }
  };
};

// update user info
export const userUpdate = (userInfo) => {
  return {type: TypeMap.USER_UPDATE, payload: userInfo};
};

/**
 * user login
 * @param {*} info
 */
export const userLogin = (options) => {
  return async (dispatch) => {
    const data = JSON.parse(JSON.stringify(options));
    data.password = Httphelper.Md5(data.password);
    const userInfo = await Httphelper.onPost('/api/user/signin', {data}, dispatch);
    Utility.Token = userInfo.token;
    Utility.UserInfo = userInfo;
    Utility.NotifyLogin.next(userInfo);
    Utility.NotifyUpdate.next(userInfo);
    dispatch({type: TypeMap.USER_LOGIN, payload: userInfo});
    return userInfo;
  };
};

/**
 * user signup
 * @param {*} info
 */
export const userSignUp = (options) => {
  return async (dispatch) => {
    dispatch({type: TypeMap.LOADING});
    try {
      const data = JSON.parse(JSON.stringify(options));
      data.password = Httphelper.Md5(data.password);
      data.confirmPwd = Httphelper.Md5(data.confirmPwd);
      const item = await Httphelper.onPost('/api/user/signup', {data}, dispatch);
      dispatch({type: TypeMap.USER_SIGNUP, payload: item});
      return item;
    } finally {
      dispatch({type: TypeMap.LOADING_HIDE});
    }
  };
};
