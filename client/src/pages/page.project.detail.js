import React from 'react';
import {connect} from 'react-redux';
import styles from './pages.module.scss';
import * as allActions from '../actions';
import TaskTemplate from '../components/component.task';
import Chat from '../components/component.chat';
import Utility from '../common/Utility';
import BasePage from './page.base';

const fmt = 'yyyy-MM-dd';

class ProjectDetail extends BasePage {
  constructor(props) {
    super(props);
    this.state.info = {};
    this.state.task = {};
    this.state.isEdit = false;

    this.state.task.task_begin_time = Utility.FormatDate(new Date().getTime(), fmt);
    this.state.task.task_end_time = Utility.FormatDate(new Date().getTime() + 1000 * 60 * 60 * 24 * 10, fmt);
  }

  componentDidMount() {
    this.getTaskUserList();
    this.getDetail();
  }

  update() {
    this.setState({ts: new Date()});
  }

  async getTaskUserList() {
    await this.props.taskUserList();
    this.update();
  }

  async getDetail() {
    const id = this.props.match.params.id;
    await this.props.projectDetail(id);
    const detail = this.props.Project.detail;
    this.state.info = {...detail};
    this.state.task.task_begin_time = detail.project_begin_time;
    this.state.task.task_end_time = detail.project_end_time;

    const stateMap = {};
    const stateMapCn = {1: 'has not started', 2: 'processing', 3: 'completed', 4: 'delay'};

    detail.taskList.forEach((item) => {
      if (!stateMap[item.task_state]) {
        stateMap[item.task_state] = {name: stateMapCn[item.task_state], count: 0, children: []};
      }
      const row = stateMap[item.task_state];
      row.count++;
      row.children.push(item);
    });
    this.state.info.stateMap = Object.values(stateMap);
    console.log('stateMap:', this.state.info.stateMap);
    this.update();
  }

  handleChange(field, source) {
    this.state.info[field] = source.target.value;
    this.update();
  }

  handleEdit() {
    this.state.isEdit = !this.state.isEdit;
    this.update();
  }

  async handleUpdate() {
    await this.props.projectUpdate(this.state.info);
    Utility.Alert('update success');
    this.handleEdit();
  }

  handleChangeTask(field, source) {
    this.state.task[field] = source.target.value;
    if (field === 'task_user_id') {
      this.state.task.task_username = source.target.selectedOptions[0].innerText;
    }
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

  async handleAddTask() {
    const {detail = {}} = this.props.Project;
    const {id: project_id, project_begin_time, project_end_time} = detail;

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

    const data = {
      project_id,
      task_name,
      task_begin_time: Utility.FormatDate(task_begin_time, fmt),
      task_end_time: Utility.FormatDate(task_end_time, fmt),
      task_user_id,
      task_username,
    };
    console.log(data);
    await this.props.taskAdd(data);
    Utility.Alert('Add Success');

    this.state.task = {};

    this.state.task.task_begin_time = detail.project_begin_time;
    this.state.task.task_end_time = detail.project_end_time;

    this.getDetail();
  }

  render() {
    const {isEdit} = this.state;
    const info = this.state.info || {};
    const {userList} = this.props.Task;
    const {detail = {}} = this.props.Project;
    const {id: user_id} = Utility.UserInfo || {};

    const task = this.state.task || {};
    return (
      <div className={styles.projectDetail}>
        <div className={styles.row}>
          <div className={styles.col0}>{user_id === detail.user_id && <button onClick={this.handleEdit.bind(this)}>{isEdit ? 'Cancel' : 'Edit'}</button>}</div>
          <div className={styles.col}></div>
          <div className={styles.col0}>
            <button onClick={() => this.props.history.goBack()}>Back</button>
          </div>
        </div>

        <div className={`${styles.row} ${styles.alignCenter}`}>
          <div className={styles.projectLabel}>Project Name</div>
          <div className={styles.col}>
            <input disabled={!isEdit} placeholder="Please enter project name" value={info.project_name || ''} onChange={this.handleChange.bind(this, 'project_name')} />
          </div>
          <div className={styles.projectLabel}>Begin Time</div>
          <div className={styles.col}>
            <input
              disabled={!isEdit}
              type="date"
              value={info.project_begin_time || ''}
              placeholder="Please enter project begin time"
              onChange={this.handleChange.bind(this, 'project_begin_time')}
            />
          </div>
          <div className={styles.projectLabel}>End Time</div>
          <div className={styles.col}>
            <input
              disabled={!isEdit}
              type="date"
              value={info.project_end_time || ''}
              placeholder="Please enter project end time"
              onChange={this.handleChange.bind(this, 'project_end_time')}
            />
          </div>
          <div className={styles.projectLabel}>State</div>
          <div className={styles.col}>
            <select disabled={!isEdit} value={info.project_state} onChange={this.handleChange.bind(this, 'project_state')}>
              <option value={1}>has not started</option>
              <option value={2}>processing</option>
              <option value={3}>completed</option>
            </select>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.projectLabel}>Describe</div>
          <div className={styles.col}>
            {isEdit ? (
              <textarea placeholder="Please enter project describe" onChange={this.handleChange.bind(this, 'project_describe')} value={info.project_describe} />
            ) : (
              <div className={styles.project_describe}>{info.project_describe}</div>
            )}
          </div>
        </div>
        {isEdit && (
          <div className={`${styles.row} ${styles.alignCenter}`}>
            <div className={styles.projectLabel}> </div>
            <div className={styles.col}>
              <button onClick={this.handleUpdate.bind(this)}>Save</button>
            </div>
          </div>
        )}
        <div className={styles.row}></div>
        <div className={styles.splitLine}></div>
        <div className={styles.row}></div>

        {isEdit && (
          <div>
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
                <button onClick={this.handleAddTask.bind(this)}>Add Task</button>
              </div>
              <div className={styles.col}></div>
              <div className={styles.projectLabel}> </div>
              <div className={styles.col}></div>
            </div>

            <div className={styles.row}></div>
            <div className={styles.splitLine}></div>
            <div className={styles.row}></div>
          </div>
        )}

        <TaskTemplate taskList={info.taskList} {...info} isEdit={isEdit} userList={userList} onDelete={() => this.getDetail()} />

        <div className={styles.row}></div>
        <div className={styles.splitLine}></div>
        <div className={styles.row}></div>
        <div className={styles.row}>
          <div className={styles.col}>
            <div className={styles.row}>Join List: {info.project_people_list}</div>
            <div style={{marginTop: '20px'}}>
              {info &&
                info.stateMap &&
                info.stateMap.map((state) => {
                  return (
                    <div className={styles.row} key={state.name}>
                      <div style={{width: '110px'}}>{state.name}</div>
                      <div>{state.count}</div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className={styles.col0}>
            {info && info.id && (
              <div className={styles.chat600}>
                <Chat projectInfo={info} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state) => ({...state}), {...allActions})(ProjectDetail);
