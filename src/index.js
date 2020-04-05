import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import {
  Route,
  Switch,
} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

import configureStore, { history } from './configureStore';

import Shell from './containers/partials/shell';
import App from './app';
import './app.css';

const store = configureStore();

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <>
        <Switch>
          <Route exact path="/">
            <Shell>
              <App />
            </Shell>
          </Route>
        </Switch>
      </>
    </ConnectedRouter>
  </Provider>, document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
