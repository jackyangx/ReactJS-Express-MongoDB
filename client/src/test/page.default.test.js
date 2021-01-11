import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import {createStore, applyMiddleware, compose} from 'redux';
import reducers from '../reducers';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
import {Provider} from 'react-redux';
import reduxThunk from 'redux-thunk';

import {Router, Route, Switch} from 'react-router-dom';
import {createBrowserHistory} from 'history';
const history = createBrowserHistory();

import Default from '../pages/page.default';

it('page.default', () => {
  render(
    <Provider store={createStore(reducers, composeEnhancers(applyMiddleware(reduxThunk)))}>
      <Router history={history}>
        <Default history={history} />
      </Router>
    </Provider>,
  );

  expect(screen.getByText(/Search/i)).toBeInTheDocument();
});
