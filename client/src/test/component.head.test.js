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

import Header from '../components/component.header';

it('component.header', () => {
  render(
    <Provider store={createStore(reducers, composeEnhancers(applyMiddleware(reduxThunk)))}>
      <Router history={history}>
        <Header history={history} />
      </Router>
    </Provider>,
  );
  
  expect(screen.getByText(/project management platform/i)).toBeInTheDocument();
});
