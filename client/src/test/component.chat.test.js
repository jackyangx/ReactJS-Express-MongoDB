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

import Chat from '../components/component.chat';

it('component.chat', () => {
  render(
    <Provider store={createStore(reducers, composeEnhancers(applyMiddleware(reduxThunk)))}>
      <Router history={history}>
        <Chat history={history} />
      </Router>
    </Provider>,
  );
  expect(screen.getByText(/send/i)).toBeInTheDocument();
});
