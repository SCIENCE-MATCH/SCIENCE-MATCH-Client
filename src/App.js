import { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import LogIn from "./routes/LogIn";
import SignUp from "./routes/Signup";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/">
          <LogIn />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
