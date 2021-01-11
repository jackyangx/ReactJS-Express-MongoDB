import React from 'react';
import {connect} from 'react-redux';
import styles from './pages.module.scss';
import * as allAction from '../actions';
import Utility from '../common/Utility';

const fmt = 'yyyy-MM-dd';
class ProjectAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {info: {taskList: []}, task: {task_name: ''}};

    this.state.info.project_begin_time = Utility.FormatDate(new Date().getTime(), fmt);
    this.state.info.project_end_time = Utility.FormatDate(new Date().getTime() + 1000 * 60 * 60 * 24 * 10, fmt);

    this.state.task.task_begin_time = Utility.FormatDate(new Date().getTime(), fmt);
    this.state.task.task_end_time = Utility.FormatDate(new Date().getTime() + 1000 * 60 * 60 * 24 * 10, fmt);

    this.state.info.taskList = [];
  }

  componentDidMount() {
    this.getTaskUserList();
  }

  update() {
    this.setState({ts: new Date()});
  }

  async getTaskUserList() {
    await this.props.taskUserList();
    this.update();
  }

  handleChange(field, source) {
    this.state.info[field] = source.target.value;
    this.update();
  }

  handleChangeTask(field, source) {
    this.state.task[field] = source.target.value;
    if (field === 'task_user_id') {
      this.state.task.task_username = source.target.selectedOptions[0].innerText;
    }
    this.update();
  }

  handleAddTask() {
    const {project_begin_time, project_end_time} = this.state.info;
    const {task_name, task_begin_time, task_end_time, task_user_id, task_username} = this.state.task;
    if (!task_name) {
      Utility.Alert('task name is not empty');
      return;
    }
    if (!task_username) {
      Utility.Alert('please select task people');
      return;
    }

    const pBeginTime = new Date(project_begin_time).getTime();
    const pEndTime = new Date(project_end_time).getTime();

    const tBeginTime = new Date(task_begin_time).getTime();
    const tEndTime = new Date(task_end_time).getTime();

    if (!(tBeginTime >= pBeginTime && tBeginTime <= pEndTime)) {
      Utility.Alert(`Task start time can only be within the project start time and end time`);
      return;
    }

    if (!(tEndTime >= pBeginTime && tEndTime <= pEndTime)) {
      Utility.Alert(`Task end time can only be within the project start time and end time`);
      return;
    }
    if (tBeginTime > tEndTime) {
      Utility.Alert(`The task start time cannot be greater than the end time`);
      return;
    }

    this.state.info.taskList.push({
      task_name,
      task_begin_time: Utility.FormatDate(task_begin_time, fmt),
      task_end_time: Utility.FormatDate(task_end_time, fmt),
      task_user_id,
      task_username,
    });
    this.state.task = {};
    this.state.task.task_begin_time = Utility.FormatDate(new Date().getTime(), fmt);
    this.state.task.task_end_time = Utility.FormatDate(new Date().getTime() + 1000 * 60 * 60 * 24 * 10, fmt);
    this.update();
  }

  buildTaskUserListHtml() {
    const {userList} = this.props.Task;

    if (!Utility.IsArray(userList)) {
      return;
    }
    return userList.map((row) => {
      return (
        <option key={row.id} value={row.id}>
          {row.username}
        </option>
      );
    });
  }

  handleDeleteTask(taskList, index) {
    const isDelete = confirm('Are you sure you want to delete it?');
    if (!isDelete) {
      return;
    }
    taskList.splice(index, 1);
    this.update();
  }

  buildTaskListHtml() {
    const {taskList = []} = this.state.info;
    if (taskList.length === 0) {
      return (
        <tr>
          <td colSpan={6}>
            <h3> Please add task list </h3>
          </td>
        </tr>
      );
    }
    return taskList.map((row, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{row.task_name}</td>
          <td>{row.task_username}</td>
          <td>{row.task_begin_time}</td>
          <td>111-{row.task_end_time}</td>
          <td>
            <button onClick={this.handleDeleteTask.bind(this, taskList, index)}>Delete</button>
          </td>
        </tr>
      );
    });
  }

  async handleSubmit() {
    //
    await this.props.projectAdd(this.state.info);
    Utility.Alert('add success');

    this.state.info = {taskList: []};
    this.state.info.project_begin_time = Utility.FormatDate(new Date().getTime(), fmt);
    this.state.info.project_end_time = Utility.FormatDate(new Date().getTime() + 1000 * 60 * 60 * 24 * 10, fmt);

    this.update();
  }

  render() {
    const info = this.state.info || {};
    const task = this.state.task || {};
    return (
      <div className={styles.projectAddCss}>
        <div className={`${styles.row} ${styles.alignCenter}`}>
          <div className={styles.projectLabel}>Project Name</div>
          <div className={styles.col}>
            <input placeholder="Please enter project name" value={info.project_name || ''} onChange={this.handleChange.bind(this, 'project_name')} />
          </div>
          <div className={styles.projectLabel}>Begin Time</div>
          <div className={styles.col}>
            <input type="date" value={info.project_begin_time || ''} placeholder="Please enter project begin time" onChange={this.handleChange.bind(this, 'project_begin_time')} />
          </div>
          <div className={styles.projectLabel}>End Time</div>
          <div className={styles.col}>
            <input type="date" value={info.project_end_time || ''} placeholder="Please enter project end time" onChange={this.handleChange.bind(this, 'project_end_time')} />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.projectLabel}>Describe</div>
          <div className={styles.col}>
            <textarea placeholder="Please enter project describe" value={info.project_describe || ''} onChange={this.handleChange.bind(this, 'project_describe')}></textarea>
          </div>
        </div>
        <div className={styles.row}></div>
        <div className={styles.splitLine}></div>
        <div className={styles.row}></div>

        <div className={styles.taskBody}>
          <div className={`${styles.row} ${styles.alignCenter}`}>
            <div className={styles.projectLabel}>Task Name</div>
            <div className={styles.col}>
              <input type="text" placeholder="Please enter task end time" value={task.task_name || ''} onChange={this.handleChangeTask.bind(this, 'task_name')} />
            </div>
            <div className={styles.projectLabel}>Begin Time</div>
            <div className={styles.col}>
              <input type="date" placeholder="Please enter task begin time" value={task.task_begin_time || ''} onChange={this.handleChangeTask.bind(this, 'task_begin_time')} />
            </div>
            <div className={styles.projectLabel}>End Time</div>
            <div className={styles.col}>
              <input type="date" placeholder="Please enter task end time" value={task.task_end_time || ''} onChange={this.handleChangeTask.bind(this, 'task_end_time')} />
            </div>
          </div>
          <div className={`${styles.row} ${styles.alignCenter}`}>
            <div className={styles.projectLabel}>People</div>
            <div className={styles.col}>
              <select value={task.task_user_id || ''} onChange={this.handleChangeTask.bind(this, 'task_user_id')}>
                <option value="">Select People</option>
                {this.buildTaskUserListHtml()}
              </select>
            </div>
            <div className={styles.projectLabel}>
              <button onClick={this.handleAddTask.bind(this)}>Add</button>
            </div>
            <div className={styles.col}></div>
            <div className={styles.projectLabel}> </div>
            <div className={styles.col}></div>
          </div>

          <div className={`${styles.row} ${styles.alignCenter}`}>
            <div className={styles.projectLabel}>Task List:</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Task Name</th>
                <th>People</th>
                <th>Begin Time</th>
                <th>End Time</th>
                <th>Operator</th>
              </tr>
            </thead>
            <tbody>{this.buildTaskListHtml()}</tbody>
          </table>
        </div>

        <div className={styles.row}>
          <div className={styles.projectLabel}> </div>
          <button onClick={this.handleSubmit.bind(this)}>Submit</button>
        </div>
      </div>
    );
  }
}

export default connect((state) => ({...state}), {...allAction})(ProjectAdd);
