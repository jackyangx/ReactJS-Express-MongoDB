import {TypeMap} from '../actions/index';
export default (state = {}, action) => {
  const {payload} = action;
  switch (action.type) {
    case TypeMap.PROJECT_SEARCH_CONDITION:
      const {keyword, page, size} = payload;
      state.keyword = keyword || '';
      state.page = page;
      state.size = size;
      break;
    case TypeMap.PROJECT_SEARCH:
      state.search = payload;
      break;
    case TypeMap.PROJECT_SEARCH_MY_JOIN:
      state.myJoin = payload;
      break;
    case TypeMap.PROJECT_SEARCH_MY_JOIN_CONDITION:
      state.myJoinCondition = {...payload};
      break;
    case TypeMap.PROJECT_ADD:
      state.add = payload;
      break;
    case TypeMap.PROJECT_DELETE:
      state.search.list.splice(payload.index, 1);
      state.delete = payload;
      break;
    case TypeMap.PROJECT_DETAIL:
      state.detail = payload;
      break;
    case TypeMap.PROJECT_UPDATE:
      state.detail = payload;
      break;
    case TypeMap.PROJECT_DELETE_TASK:
      state.detail.taskList.splice(payload.index, 1);
      break;
    case TypeMap.PROJECT_UPDATE_TASK:
      const taskList = state.detail.taskList;
      for (let i = 0; i < taskList.length; i += 1) {
        if (taskList[i].id === payload.result.id) {
          taskList[i] = payload.result;
        }
      }
      break;
    default:
  }

  return state;
};
