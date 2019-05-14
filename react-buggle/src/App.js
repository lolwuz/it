import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home  from './routes/Home' 
import Game from './routes/Game'
import './App.css';
import Overview from './routes/Overview';

function App() {
  return (
    <Router>
        <div>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/game/:game_code' component={Game}/>
            <Route path='/scores/:game_code' component={Overview}/>
          </Switch>
        </div>
      </Router>
  );
}

export default App;
