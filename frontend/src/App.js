import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/home" render={() => console.log('WELCOME')} />
      </Switch>
    </Router>
  );
}

export default App;
