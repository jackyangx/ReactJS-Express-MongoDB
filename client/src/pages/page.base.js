import React from 'react';
import Utility from '../common/Utility';

export default class BasePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.JudgeIsLogin();
  }

  update() {
    this.setState({ts: new Date()});
  }

  JudgeIsLogin() {
    const {id} = Utility.UserInfo || {};
    if (id) {
      return;
    }
    if (!['/signup', '/signin'].includes(this.props.history.location.pathname)) {
      // console.log('to login page');
      this.props.history.push('/signin');
    }
  }
}
