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
    return (
      <div className={styles.defaultCss}>
        <div className="row">
          <div className="col">
            <div>1) User login</div>
            <div>2) User registration</div>
            <div>3) User log out</div>
            <div>4) User search items</div>
            <div>5) Users view projects they create</div>
            <div>6) Users view their projects</div>
            <div>7) Users create, modify and delete their own projects</div>
            <div>8) Project includes name, time, period, participants, project status and project description</div>
            <div>9) Users view tasks they create</div>
            <div>10) Users view the tasks they participate in</div>
            <div>11) Project sponsor create task</div>
            <div>12) Tasks include sequence number, name, person, time and status</div>
            <div>13) User modify task status</div>
            <div>14) Project sponsor modify and delete task</div>
            <div>15) Users view project data statistics</div>
            <div>16) Online communication of project team members</div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state) => ({...state}), {...allAction})(About);
