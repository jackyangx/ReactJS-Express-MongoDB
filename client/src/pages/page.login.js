import React from 'react';
import {connect} from 'react-redux';
import styles from './pages.module.scss';
import {userLogin} from '../actions/index';
import Utility from '../common/Utility';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {info: {}};
  }

  handleChange(field, source) {
    this.state.info[field] = source.target.value;
  }

  async handleLogin() {
    await this.props.userLogin(this.state.info);
    this.props.history.push('/');
  }

  render() {
    return (
      <div className={`${styles.pageBody} ${styles.gCenter}`}>
        <div className={styles.login}>
          <div className="row align-center">
            <div className={styles.loginLabel}>Username:</div>
            <div className={styles.col}>
              <input placeholder="Please enter username" onChange={this.handleChange.bind(this, 'username')} />
            </div>
          </div>
          <div className="row align-center">
            <div className={styles.loginLabel}>Password:</div>
            <div className={styles.col}>
              <input type="password" placeholder="Please enter password" onChange={this.handleChange.bind(this, 'password')} />
            </div>
          </div>
          <div className="row align-center">
            <div className={styles.loginLabel}></div>
            <div className={styles.col}>
              <button onClick={this.handleLogin.bind(this)}>SignIn</button>
              <button onClick={() => this.props.history.push('/signup')}>SignUp</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state) => ({...state}), {userLogin})(Login);
