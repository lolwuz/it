import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home  from './routes/Home' 
import Game from './routes/Game'
import './App.css';

function App() {
  return (
    <Router>
        <div>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/game' component={Game}/>
          </Switch>
        </div>
      </Router>
  );
}

export default App;
