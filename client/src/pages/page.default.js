import React from 'react';
import {connect} from 'react-redux';
import styles from './pages.module.scss';
import * as allAction from '../actions';
import PageNavigation from '../components/component.page.navigation';
import Utility from '../common/Utility';
import {Link} from 'react-router-dom';
import BasePage from './page.base';

class Default extends BasePage {
  constructor(props) {
    super(props);

    this.state.keyword = '';
    this.state.isLoading = false;
    this.state.size = 10;

    this.keywordRef = React.createRef();

    this.JudgeIsLogin();
  }

  componentDidUpdate(props, state) {
    this.getSearch();
  }

  componentDidMount() {
    this.getSearch();
  }

  update() {
    this.setState({ts: new Date()});
  }

  handleKeyword(source) {
    this.state.keyword = source.target.value.trim();
  }

  async getSearch() {
    if (!!this.state.isLoading) {
      return;
    }

    this.state.isLoading = true;
    const {keyword = '', page = 1, size = 10} = this.props.Project;
    this.keywordRef.current.value = keyword;

    this.state.keyword = keyword;
    await this.props.projectSearch({keyword, page, size});
    this.update();
    this.state.isLoading = false;
  }

  async handleDelete(row, index) {
    const isDelete = confirm('Are you sure you want to delete it?');
    if (!isDelete) {
      return;
    }
    await this.props.projectDelete(row, index);
    Utility.Alert('delete success');
    this.update();
  }

  buildSearchResultHtml() {
    const {search, keyword, page = 1, size} = this.props.Project;

    const {list} = search || {};
    if (!Utility.IsArray(list)) {
      return (
        <tr>
          <td colSpan={8}>
            <div>
              <h3>{keyword ? 'No items found' : `You don't have your own project yet. Add it`} </h3>
            </div>
          </td>
        </tr>
      );
    }

    return list.map((row, index) => {
      const stateMap = {1: 'has not started', 2: 'processing', 3: 'completed', 4: 'delay'};
      return (
        <tr key={row.id} className={ styles[`project_state_${row.project_state}`]}>
          <td>{(page - 1) * size + index + 1}</td>
          <td>{row.project_name}</td>
          <td>{row.project_begin_time}</td>
          <td>{row.project_end_time}</td>
          <td>{row.project_cycle}</td>
          <td>{row.project_people_list}</td>
          <td>{stateMap[row.project_state] || stateMap[1]}</td>
          <td>
            <Link to={`/project/detail/${row.id}`}>
              <button>Detail</button>
            </Link>
            <button onClick={this.handleDelete.bind(this, row, index)}>Delete</button>
          </td>
        </tr>
      );
    });
  }

  handleSearch(page = 1) {
    this.props.projectSearchKeyword({keyword: this.state.keyword || '', page, size: this.state.size});
    this.props.history.push('/?keyword=' + this.state.keyword);
    this.keywordRef.current.value = this.state.keyword;
  }

  handleReset() {
    this.state.keyword = '';
    this.state.size = 10;
    this.handleSearch(1);
    this.keywordRef.current.value = '';
  }

  render() {
    const {page, totalPage} = this.props.Project.search || {};

    return (
      <div className={styles.defaultCss}>
        <div className={styles.row + ' ' + styles.search}>
          <input ref={this.keywordRef} placeholder="Enter search keyword" onChange={this.handleKeyword.bind(this)} />
          <button onClick={this.handleSearch.bind(this, 1)}>Search</button>
          <button onClick={this.handleReset.bind(this, 1)}>Reset</button>
        </div>
        <div className={styles.seachResult}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Project Name</th>
                <th>Begin time</th>
                <th>End time</th>
                <th>Cycle</th>
                <th>People list</th>
                <th>State</th>
                <th>Operator</th>
              </tr>
            </thead>
            <tbody>{this.buildSearchResultHtml()}</tbody>
          </table>
        </div>
        <div style={{marginTop: '20px'}}>
          {totalPage && totalPage > 1 && <PageNavigation history={this.props.history} page={page} totalPage={totalPage} onChange={this.handleSearch.bind(this)} />}
        </div>
      </div>
    );
  }
}

export default connect((state) => ({...state}), {...allAction})(Default);
