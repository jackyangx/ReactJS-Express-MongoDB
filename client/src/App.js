import {createBrowserHistory} from 'history';
import {Router, Route, Switch} from 'react-router-dom';

import './App.css';
import pageLogin from './pages/page.login';
import pageDefault from './pages/page.default';
import pageSignup from './pages/page.signup';
import Header from './components/component.header';
import pageAbout from './pages/page.about';
import pageProjectAdd from './pages/page.project.add';
import pageProjectDetail from './pages/page.project.detail';
import pageProjectJoin from './pages/page.project.join';

const history = createBrowserHistory();

function App() {
  return (
    <div className="App">
      <Router history={history}>
        <div className="row">
          <div className="col"></div>
          <div className="pageBody">
            <Header history={history} />
            <Switch>
              <Route path="/" exact component={pageDefault} />
              <Route path="/signin" exact component={pageLogin} />
              <Route path="/signup" exact component={pageSignup} />
              <Route path="/project/list" exact component={pageProjectJoin} />
              <Route path="/project/add" exact component={pageProjectAdd} />
              <Route path="/project/detail/:id" exact component={pageProjectDetail} />
              <Route path="/about" exact component={pageAbout} />
            </Switch>
          </div>
          <div className="col"></div>
        </div>
      </Router>
    </div>
  );
}

export default App;
