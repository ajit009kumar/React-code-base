import React from 'react'
import {render} from 'react-dom'
import {Router, Route, browserHistory, Redirect} from 'react-router'
import {BrowserRouter, Switch} from 'react-router-dom';
import GameList from './components/GameList';
import AppBar from 'material-ui/AppBar';


const styles = {
  title: {
    cursor: 'pointer',
  },
};


const App = ( {children} ) => (
  <Switch>
    <Route
      exact
      path='/'
      render={() => {
      return(
        <GameList />
      )
      }}
    />
  </Switch>
)

export default App
