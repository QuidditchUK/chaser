import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import {
  Route,
  Switch,
  BrowserRouter as Router,
} from 'react-router-dom';

import configureStore from './configureStore';

import Shell from './components/shell';
import App from './app';
import Prismic from './prismic';
import './app.css';

const store = configureStore();

render(
  <Provider store={store}>
    <Router>
      <Shell>
        <Switch>
          <Route exact path="/">
            <App />
          </Route>

          <Route path="/:uid">
            <Prismic />
          </Route>
        </Switch>
      </Shell>
    </Router>
  </Provider>, document.getElementById('root'),
);
