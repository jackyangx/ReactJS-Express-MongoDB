import ModelTask from '../model/model.task';
import BaseService from './BaseService';
import ProjectService from './ProjectService';
import UserService from './UserService';

class TaskService extends BaseService {
  constructor() {
    super(ModelTask);
  }

  async UpdateState(userInfo) {
    const {id: user_id} = userInfo;

    const currentDate = new Date(this.formatDate(new Date(), 'yyyy-MM-dd')).getTime();
    const list = await this.find({own_id: user_id, task_state: {$ne: 4}});

    for (let i = 0; i < list.length; i += 1) {
      const {id, task_end_time} = list[i];

      const endTime = new Date(task_end_time).getTime();
      if (endTime < currentDate) {
       
        await this.findByIdAndUpdate(id, {task_state: 4});
      }
    }
  }

  /**
   * create new task and save database
   *
   * @param {*} data
   * @returns
   * @memberof TaskService
   */
  async AddTask(data) {
    const {project_id, task_name, task_begin_time, task_end_time, task_user_id, task_username, userInfo} = data;
    const {id: own_id, username: own_username} = userInfo;
    if (!project_id) {
      this.failure('task project id is not empty');
    }
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
      this.failure('task people is not empty');
    }
    if (!task_username) {
      const uInfo = await UserService.findById(task_user_id);
      if (!uInfo) {
        this.failure('task people is not exists');
      }
      data.task_username = task_username;
    }

    const projectInfo = await ProjectService.findById(project_id);
    if (!projectInfo) {
      this.failure('task project is not exists');
    }
    data.project_name = projectInfo.project_name;
    data.own_id = own_id;
    data.own_username = own_username;

    if (projectInfo.project_people_list.indexOf(data.task_username) === -1) {
      projectInfo.project_people_list = `${projectInfo.project_people_list}, ${data.task_username}`;
    }
    // upddate people list
    await ProjectService.findByIdAndUpdate(project_id, {project_people_list: projectInfo.project_people_list});
    // createt task
    const info = await this.create(data);
    return this.success(info);
  }

  /**
   * delete task by id
   *
   * @param {*} id
   * @param {*} user_id
   * @returns
   * @memberof TaskService
   */
  async DeleteTask(id, user_id) {
    const taskInfo = await this.findById(id);
    if (!taskInfo) {
      this.failure('task is not exists');
    }

    if (taskInfo.own_id !== user_id) {
      this.failure(`It's not yours. I don't have the right to operate it`);
    }
    await this.findByIdAndDelete(id);
    return this.success('delete task success');
  }

  /**
   * update task information
   *
   * @param {*} data
   * @returns
   * @memberof TaskService
   */
  async UpdateTask(data) {
    const {id, task_name, task_begin_time, task_end_time, task_state, task_describe} = data;
    const updateField = {};
    if (task_name) {
      updateField.task_name = task_name;
    }
    if (task_begin_time) {
      updateField.task_begin_time = task_begin_time;
    }
    if (task_end_time) {
      updateField.task_end_time = task_end_time;
    }
    if (task_state) {
      updateField.task_state = task_state;
    }
    if (task_describe) {
      updateField.task_describe = task_describe;
    }

    await this.findByIdAndUpdate(id, updateField);
    return this.success('update task success');
  }
}

export default new TaskService();
