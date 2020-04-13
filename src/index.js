import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import {
  Route,
  Switch,
  BrowserRouter as Router,
} from 'react-router-dom';

import configureStore from './configureStore';

import Shell from './components/shell';
import Prismic from './prismic';
import Search from './search';
import News from './news';
import GlobalStyle from './styles/reset';
import theme from './styles/theme';

const store = configureStore();


const Root = () => (
  <>
    <GlobalStyle />

    <Provider store={store}>
      <Router basename={process.env.PUBLIC_URL}>

        <ThemeProvider theme={theme}>
          <Shell>
            <Switch>
              <Route exact path="/">
                <Prismic />
              </Route>

              <Route exact path="/clubs">
                <Search />
              </Route>

              <Route exact path="/news">
                <News />
              </Route>
              <Route path="/:uid">
                <Prismic />
              </Route>
            </Switch>
          </Shell>
        </ThemeProvider>
      </Router>
    </Provider>
  </>
);

render(<Root />, document.getElementById('root'));
