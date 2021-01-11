import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import * as allActions from '../actions';
import Utility from '../common/Utility';
import styles from './component.module.scss';
import {Manager} from 'socket.io-client';
import SockerClient from '../common/SockerClient';

window.__IO__ = Manager;

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.judgeLogin();
    this.createSocketConnect();

    Utility.NotifyUpdate.subscribe((item) => {
      this.props.userUpdate(item);
      this.update();
    });

    Utility.NotifyLogin.subscribe((user) => {
      console.log('user info', user);
      SockerClient.Login();
      this.props.userUpdate(Utility.UserInfo);
      this.update();
    });

    Utility.NotifyLogout.subscribe((args) => {
      this.logout();
    });
    Utility.NotifyChatMsg.subscribe((args) => {
      // console.log(args);
    });
  }

  createSocketConnect() {
    window.SC = SockerClient;

    SockerClient.Create();
  }

  judgeLogin() {
    const {user} = this.props;
    const {info} = user || {};
    const {id} = info || {};
    if (id) {
      console.log('user info exists');
      return;
    }
    const {id: user_id} = Utility.UserInfo || {};
    if (!user_id) {
      if (!['/signup', '/signin'].includes(this.props.history.location.pathname)) {
        // console.log('to login page');
        this.props.history.push('/signin');
      }
      return;
    }

    SockerClient.Login();
    this.props.userUpdate(Utility.UserInfo);
    this.update();
  }

  update() {
    this.setState({ts: new Date()});
  }

  // get category list
  async getCategoryList() {
    await this.props.categoryList();
    this.update();
  }

  searchCategory(keyword) {
    if (keyword) {
      this.props.history.push('/?keyword=' + keyword);
    } else {
      this.props.history.push('/');
    }
    this.props.bookSearchKeyword(keyword, 1, 20);
  }

  logout() {
    this.props.userUpdate(null);
    Utility.UserInfo = null;
    Utility.Token = null;
    this.update();

    this.props.history.push('/signin');
  }

  buildMyHtml() {
    const {username, email} = this.props.User.info || {};
    return (
      <div className={styles.col0 + ' ' + styles.row}>
        <div className={styles.col0 + ' ' + styles.username}>
          Welcome <span> {username || email}</span>
        </div>
        <div className={styles.col0 + ' ' + styles.categoryName} onClick={this.logout.bind(this)}>
          Logout
        </div>
      </div>
    );
  }

  render() {
    const {id: user_id} = Utility.UserInfo || {};

    return (
      <div className={styles.header}>
        <div className={styles.logo}>{`project management platform`.toUpperCase()}</div>
        {user_id && (
          <div className={`${styles.row} ${styles.alignCenter} ${styles.nav}`}>
            <div className={styles.col0}>
              <Link to="/"> My Project list</Link>
            </div>
            <div className={styles.col0}>
              <Link to="/project/list">My Join Project list</Link>
            </div>
            <div className={styles.col0}>
              <Link to="/project/add">Add Project Plan</Link>
            </div>
            <div className={styles.col0}>
              <Link to="/about"> About</Link>
            </div>

            <div className={`${styles.col} ${styles.row}`}></div>
            {this.buildMyHtml()}
          </div>
        )}
      </div>
    );
  }
}

export default connect((state) => ({...state}), {...allActions})(Header);
