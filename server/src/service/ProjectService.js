import ModelProject from '../model/model.project';
import BaseService from './BaseService';
import TaskService from './TaskService';
import UserService from './UserService';

class ProjectService extends BaseService {
  constructor() {
    super(ModelProject);
  }

  async UpdateProjectState(userInfo) {

    await TaskService.UpdateState(userInfo);

    const {id: user_id} = userInfo;
    const myProjectList = await this.find({user_id, project_state: {$ne: 4}});
    const currentDate = new Date(this.formatDate(new Date(), 'yyyy-MM-dd')).getTime();

    for (let i = 0; i < myProjectList.length; i += 1) {
      const row = myProjectList[i];
      const {id, project_end_time, state} = row;
      const endTime = new Date(project_end_time).getTime();

      if (endTime < currentDate) {
        await this.findByIdAndUpdate(id, {task_state: 4});
      }
    }
  }

  /**
   * add project
   *
   * @param {*} data
   * @returns
   * @memberof ProjectService
   */
  async AddProject(data) {
    const {userInfo, taskList, project_name, project_describe, project_begin_time, project_end_time} = data;
    const {id: user_id, username} = userInfo;

    if (!project_name) {
      this.failure('project name is not empty');
    }
    if (!project_begin_time) {
      this.failure('project begin time is not empty');
    }
    if (!project_end_time) {
      this.failure('project end time is not empty');
    }
    if (!project_describe) {
      this.failure('project describe is not empty');
    }

    const cycleTime = new Date(project_end_time).getTime() - new Date(project_begin_time).getTime();
    const dayTime = 1000 * 60 * 60 * 24;
    const project_cycle = cycleTime === 0 ? 1 : Math.ceil(cycleTime / dayTime);
    if (!taskList || taskList.length === 0) {
      this.failure('please add task list');
    }

    let project_people_list = [];
    for (let i = 0; i < taskList.length; i += 1) {
      const {task_name, task_begin_time, task_end_time, task_user_id, task_username} = taskList[i];
      if (!task_name) {
        this.failure('task name is not empty');
      }
      if (!task_begin_time) {
        this.failure('task begin time is not empty');
      }
      if (!task_end_time) {
        this.failure('task end time is not empty');
      }
      if (!task_user_id) {
        this.failure('please select task people');
      }
      if (!task_username) {
        const taskUserInfo = await UserService.findById(task_user_id);
        if (!taskUserInfo) {
          this.failure('task people is not exists');
        }
        if (!project_people_list.includes(taskUserInfo.username)) {
          project_people_list.push(taskUserInfo.username);
        }
      } else {
        if (!project_people_list.includes(task_username)) {
          project_people_list.push(task_username);
        }
      }
    }
    this.log('project_people_list:', project_people_list);
    const taskInfo = {user_id, username, project_name, project_describe, project_begin_time, project_end_time, project_cycle, project_people_list: project_people_list.join(', ')};

    const doc = await this.create(taskInfo);
    const {id: project_id} = doc;

    taskList.forEach((row) => {
      row.project_id = project_id;
      row.project_name = project_name;
      row.own_id = user_id;
      row.own_username = username;
    });

    await TaskService.create(taskList);
    return this.success('add success');
  }

  /**
   * update project infomation
   *
   * @param {*} data
   * @returns
   * @memberof ProjectService
   */
  async UpdateProject(data) {
    const {id: _id, userInfo, project_name, project_describe, project_begin_time, project_end_time, project_state} = data;
    const {id: user_id, username} = userInfo;
    const updateField = {};
    if (project_name) {
      updateField.project_name = project_name;
    }
    if (project_describe) {
      updateField.project_describe = project_describe;
    }
    if (project_begin_time) {
      updateField.project_begin_time = project_begin_time;
    }
    if (project_end_time) {
      updateField.project_end_time = project_end_time;
    }
    if (project_state) {
      updateField.project_state = Number(project_state);
    }
    await this.updateByCondition({_id, user_id}, updateField);
    // update task project_name
    if (project_name) {
      await TaskService.updateMany({project_id: _id, own_id: user_id}, {project_name});
    }
    return this.success('update success');
  }

  /**
   * get my project list
   *
   * @param {*} options
   * @returns
   * @memberof ProjectService
   */
  async MineList(options) {
    const {user_id, page = 1, size = 20, keyword = '', state} = options;

    const info = {page: Number(page), size: Number(size)};

    const taskList = await TaskService.find({task_user_id: user_id});

    if (!taskList || taskList.length == 0) {
      info.list = [];
      info.total = 0;
      info.totalPage0;
      return info;
    }

    const project_ids = taskList.map((row) => row.project_id);

    const opt = {};
    if (state) {
      opt.project_state = Number(state);
    }
    opt._id = {$in: [...project_ids]};

    if (keyword) {
      opt.$or = [];
      opt.$or.push({project_name: {$regex: keyword, $options: '$i'}});
      opt.$or.push({project_describe: {$regex: keyword, $options: '$i'}});
      opt.$or.push({project_people_list: {$regex: keyword, $options: '$i'}});
    }

    const limit = Number(size);
    const skip = (Number(page) - 1) * limit;
    const list = await this.find(opt, {create_time: 0, update_time: 0}, {limit, skip, sort: {create_time: -1}});
    const total = await this.count(opt);
    const totalPage = Math.ceil(total / Number(size));
    //
    info.total = total;
    info.totalPage = totalPage;
    info.list = list;
    return info;
  }
}

export default new ProjectService();
