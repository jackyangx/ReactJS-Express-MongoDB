import React, {useContext, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import * as allAction from '../actions';
import styles from './component.module.scss';

const PageNavigation = (props) => {
  const {page = 1, totalPage = 1} = props || {};
  const toPage = (val) => {
    props.onChange && props.onChange(val);
  };
  return (
    <div className={styles.pageNavigation}>
      <div className="row">
        <button onClick={() => toPage(1)} disabled={page === 1}>
          {' '}
          {`|<<`}{' '}
        </button>
        <button onClick={() => toPage(page - 1)} disabled={page === 1}>
          {' '}
          {`<`}{' '}
        </button>
        <button onClick={() => toPage(page + 1)} disabled={page === totalPage}>
          {' '}
          {`>`}{' '}
        </button>
        <button onClick={() => toPage(totalPage)} disabled={page === totalPage}>
          {' '}
          {`>>|`}{' '}
        </button>
        <button disabled style={{padding: '5px 20px', width: '100px'}}>
          {page}/{totalPage}
        </button>
      </div>
    </div>
  );
};

export default connect((state) => ({...state}), {...allAction})(PageNavigation);
