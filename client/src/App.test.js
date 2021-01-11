import App from './App';
import {render, screen} from '@testing-library/react';
import {createStore, applyMiddleware, compose} from 'redux';
import reducers from './reducers';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
import {Provider} from 'react-redux';
import reduxThunk from 'redux-thunk';

test('renders learn react link', () => {
  render(
    <Provider store={createStore(reducers, composeEnhancers(applyMiddleware(reduxThunk)))}>
      <App />
    </Provider>,
  );
  const linkElement = screen.getByText(/PROJECT MANAGEMENT PLATFORM/i);
  expect(linkElement).toBeInTheDocument();
});
