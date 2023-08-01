import { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import LogIn from "./routes/LogIn";
import SignUp from "./routes/Signup";
import Admin from "./routes/Admin";
import Teacher from "./routes/Teacher";
import Student from "./routes/Student";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/admin">
          //접속자가 admin인지 확인해야함
          <Admin />
        </Route>
        <Route path="/teacher">
          <Teacher />
        </Route>
        <Route path="/student">
          <Student />
        </Route>
        <Route path="/">
          <LogIn />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
//그냥 주석 변경
