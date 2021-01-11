import {combineReducers} from 'redux';
import reducerUser from './reducer.user';
import reducerProject from './reducer.project';
import reducerTask from './reducer.task';

export default combineReducers({
  User: reducerUser,
  Project: reducerProject,
  Task: reducerTask,
});
