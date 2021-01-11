import React from 'react';
import {connect} from 'react-redux';
import * as allAction from '../actions';
import Utility from '../common/Utility';
import styles from './component.module.scss';
import SockerClient from '../common/SockerClient';

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.messageList = [];
    this.refMsg = React.createRef();
    this.refBody = React.createRef();
  }

  componentDidMount() {
    this.init();
    Utility.NotifyChatMsg.subscribe((body) => {
      const {id} = this.props.projectInfo || {};
      const funName = `process_${body.cmdName}`;
      const {project_id} = body.data || {};
      if (id !== project_id) {
        return;
      }

      if (!this[funName]) {
        return;
      }
      this[funName](body.data);
    });
  }

  update() {
    this.setState({ts: new Date()});
  }

  process_MessageList(data) {
    this.state.messageList = data.list;
    this.update();
    this.updateScrollTop();
  }
  updateScrollTop() {
    setTimeout(() => {
      if (this.refBody.current) {
        this.refBody.current.scrollTop = 10000000;
      }
    }, 100);
  }
  process_Message(data) {
    //
    if (!data.data) {
      return;
    }
    this.state.messageList.push(data.data);
    this.update();
    this.updateScrollTop();
  }

  init() {
    const {id: project_id} = this.props.projectInfo || {};
    if (!project_id) {
      return;
    }
    SockerClient.MessageList(project_id);
  }

  handleChange(source) {
    this.state.message = source.target.value.trim();
  }

  handleSendMsg() {
    //
    const {message} = this.state;
    if (!message) {
      return;
    }
    const {id} = this.props.projectInfo || {};
    SockerClient.SendData({cmdName: 'Message', data: {project_id: id, message}});
    if (this.refMsg.current) {
      this.refMsg.current.value = '';
    }
  }

  buildContentHtml() {
    const {messageList} = this.state;

    const {id: user_id} = Utility.UserInfo || {};
    return messageList.map((item, index) => {
      return (
        <div key={index} className={styles.item}>
          <div className={styles.row}>
            <div className={`${styles.left} ${user_id !== item.user_id ? styles.head : ''} `}>{user_id !== item.user_id ? item.username : ''}</div>
            <div className={`${styles.col} ${user_id === item.user_id ? styles.textRight : ''}`}>
              <div className={styles.createTime}>{Utility.FormatDate(item.create_time)}</div>
              <div className={styles.content}>{item.content}</div>
            </div>
            <div className={`${styles.right} ${user_id === item.user_id ? styles.head : ''}`}>{user_id === item.user_id ? item.username : ''}</div>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div className={styles.chatCss}>
        <div ref={this.refBody} className={styles.bodyHeight}>
          {this.buildContentHtml()}
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <input ref={this.refMsg} onChange={this.handleChange.bind(this)} />
          </div>
          <div className={styles.col0}>
            <button onClick={this.handleSendMsg.bind(this)}>Send</button>
            <button
              onClick={() => {
                this.state.messageList = [];
                this.update();
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state) => ({...state}), {...allAction})(Chat);
