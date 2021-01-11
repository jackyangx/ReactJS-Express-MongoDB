import React, {useState} from 'react';
import {connect} from 'react-redux';
import * as allAction from '../actions';
import Utility from '../common/Utility';
import styles from './component.module.scss';

const TaskTemplate = (props) => {
  const {taskList, isEdit} = props;
  const [count, setCount] = useState(0);
  const [currentTask, setCurrentTask] = useState({});
  const [edit, setEdit] = useState(false);

  // delete task
  const deleteTask = async (index, task) => {
    const isDelete = confirm('Are you sure you want to delete it?');
    if (!isDelete) {
      return;
    }
    await props.taskDelete(task.id, task.project_id, index);
    Utility.Alert('delete success');
    setCount(new Date().getTime());

    props.onDelete && props.onDelete();
  };

  // update task info
  const updateTaskInfo = async () => {
    //
    await props.taskUpdate(currentTask);
    const {index} = currentTask;
    delete currentTask.index;
    props.taskList[index] = currentTask;
    const nCount = count + 1;
    setCount(nCount);
    setEdit(false);

    props.onDelete && props.onDelete();
    Utility.Alert('update success');
  };

  const changeTaskValue = async (source, field) => {
    currentTask[field] = source.target.value;
    if (field === 'task_user_id') {
      this.state.task.task_username = source.target.selectedOptions[0].innerText;
    }
    setCurrentTask({...currentTask});
  };

  const buildTaskUserListHtml = () => {
    if (!Utility.IsArray(props.userList)) {
      return;
    }
    return props.userList.map((row) => {
      return (
        <option key={row.id} value={row.id}>
          {row.username}
        </option>
      );
    });
  };

  const buildTaskListHtml = () => {
    if (!taskList || taskList.length === 0) {
      return (
        <tr>
          <td colSpan={7}>
            <h3> Please add task list </h3>
          </td>
        </tr>
      );
    }
    const updateEdit = (row, index) => {
      setCurrentTask({...row, index});
      setEdit(true);
    };
    const {id} = Utility.UserInfo;

    return taskList.map((row, index) => {
      const stateMap = {1: 'has not started', 2: 'processing', 3: 'completed', 4: 'delay'};
      return (
        <tr key={index} className={styles[`task_state_${row.task_state}`]}>
          <td>
            {(isEdit || id === row.task_user_id) && <button onClick={() => updateEdit(row, index)}>Edit</button>}
            {isEdit && <button onClick={() => deleteTask(index, row)}>Delete</button>}
          </td>
          <td>{index + 1}</td>
          <td>{row.task_name}</td>
          <td>{row.task_username}</td>
          <td>{row.task_begin_time}</td>
          <td>{row.task_end_time}</td>
          <td>{stateMap[row.task_state] || stateMap[1]}</td>
        </tr>
      );
    });
  };
  // console.log('currentTask.task_state:', currentTask.task_state);
  return (
    <div>
      <div className={styles.taskCss}>
        {edit && (
          <div>
            <div className={`${styles.row} ${styles.alignCenter}`}>
              <div className={styles.projectLabel}>Task Name</div>
              <div className={styles.col}>
                <input type="text" placeholder="Please enter task end time" value={currentTask.task_name || ''} onChange={(e) => changeTaskValue(e, 'task_name')} />
              </div>
              <div className={styles.projectLabel}>Begin Time</div>
              <div className={styles.col}>
                <input type="date" placeholder="Please enter task begin time" value={currentTask.task_begin_time} onChange={(e) => changeTaskValue(e, 'task_begin_time')} />
              </div>
              <div className={styles.projectLabel}>End Time</div>
              <div className={styles.col}>
                <input type="date" placeholder="Please enter task end time" value={currentTask.task_end_time} onChange={(e) => changeTaskValue(e, 'task_end_time')} />
              </div>
              <div className={styles.projectLabel}>State</div>
              <div className={styles.col}>
                <select value={currentTask.task_state} onChange={(e) => changeTaskValue(e, 'task_state')}>
                  <option value={1}>has not started</option>
                  <option value={2}>processing</option>
                  <option value={3}>completed</option>
                </select>
              </div>
            </div>
            <div className={`${styles.row} ${styles.alignCenter}`}>
              <div className={styles.projectLabel}>People</div>
              <div className={styles.col}>
                <select value={currentTask.task_user_id || ''} onChange={(e) => changeTaskValue(e, 'task_user_id')}>
                  <option value="">Select People</option>
                  {buildTaskUserListHtml()}
                </select>
              </div>
              <div className={styles.projectLabel}>
                <button onClick={() => updateTaskInfo()}>Save</button>
              </div>
              <div className={styles.col}>
                <button onClick={() => setEdit(false)}>Cancel</button>
              </div>
              <div className={styles.projectLabel}> </div>
              <div className={styles.col}></div>
              <div className={styles.projectLabel}> </div>
              <div className={styles.col}></div>
            </div>
          </div>
        )}
        <div className={`${styles.row} ${styles.alignCenter}`}>
          <div className={styles.projectLabel}>Task List:</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Operator</th>
              <th>ID</th>
              <th>Task Name</th>
              <th>People</th>
              <th>Begin Time</th>
              <th>End Time</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>{buildTaskListHtml()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default connect((state) => ({...state}), {...allAction})(TaskTemplate);
