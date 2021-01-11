import React from 'react';
import {connect} from 'react-redux';
import styles from './pages.module.scss';
import * as allAction from '../actions';
import PageNavigation from '../components/component.page.navigation';
import Utility from '../common/Utility';
import BasePage from './page.base';

class About extends BasePage {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(props, state) {}

  componentDidMount() {}

  update() {
    this.setState({ts: new Date()});
  }

  render() {
    return <div className={styles.defaultCss}>About</div>;
  }
}

export default connect((state) => ({...state}), {...allAction})(About);
