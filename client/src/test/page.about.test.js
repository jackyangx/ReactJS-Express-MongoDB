import React from 'react';
import {render, screen} from '@testing-library/react';
import {createStore, applyMiddleware, compose} from 'redux';
import reducers from '../reducers';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
import {Provider} from 'react-redux';
import reduxThunk from 'redux-thunk';

import {Router} from 'react-router-dom';
import {createBrowserHistory} from 'history';
const history = createBrowserHistory();

import Signup from '../pages/page.signup';

it('page.signup', () => {
  render(
    <Provider store={createStore(reducers, composeEnhancers(applyMiddleware(reduxThunk)))}>
      <Router history={history}>
        <Signup history={history} />
      </Router>
    </Provider>,
  );

  expect(screen.getByText(/signup/i)).toBeInTheDocument();
});
