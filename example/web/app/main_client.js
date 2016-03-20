import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import App from './components/App.jsx';
import Home from './components/Routes/Home.jsx';
import Todos from './components/Routes/Todos.jsx';
import ImageFile from './components/Routes/ImageFile.jsx';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});

import publications from './publications';
publications();

Meteor.startup(() => {
  render(
    (
      <App>
        <Router history={browserHistory}>
          <Route path="/" component={Home}/>
          <Route path="todos" component={Todos}/>
          <Route path="image" component={ImageFile}/>
        </Router>
      </App>
    ), document.getElementById('root')
  );
});
