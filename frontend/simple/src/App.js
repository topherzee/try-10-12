import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

// import logo from './logo.svg';
// import './App.css';

import HandBuilder from './HandBuilder.js';
import Board from './Board.js';
import Home from './Home.js';
import Game from './Game.js';

// import FBase from './Firebase1.js';

function App() {


  return (
<Router>
      <div className="App">

        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/boards">Boards</Link>
            </li>
            <li>
              <Link to="/hands">Hands</Link>
            </li>
            <li>
              <Link to="/game">Game</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/hands">
            <HandBuilder />
          </Route>
          <Route path="/boards">
            <Board />
          </Route>
          <Route path="/game">
            <Game />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        
      </div>

    </Router>

    
    // <FBase />
  );
}

export default App;
