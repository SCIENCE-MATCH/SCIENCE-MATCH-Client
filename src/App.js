import { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import LogIn from "./routes/LogIn";
import SignUp from "./routes/Signup";
import Admin from "./routes/Admin";
import Teacher from "./routes/Teacher";
import Student from "./routes/Student";

function App() {
  console.log(`I'm working on App`);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  useEffect(() => {
    console.log(`refresh Token : ${refreshToken}`);
    console.log(`access Token : ${accessToken}`);
  }, [accessToken, refreshToken]);
  return (
    <Router>
      <Switch>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/admin">
          {/*접속자가 admin인지 확인해야함*/}
          <Admin
            accessToken={accessToken}
            setAccessToken={setAccessToken}
            refreshToken={refreshToken}
          />
        </Route>
        <Route path="/teacher">
          <Teacher
            accessToken={accessToken}
            setAccessToken={setAccessToken}
            refreshToken={refreshToken}
          />
        </Route>
        <Route path="/student">
          <Student
            accessToken={accessToken}
            setAccessToken={setAccessToken}
            refreshToken={refreshToken}
          />
        </Route>
        <Route path="/">
          <LogIn
            setAccessToken={setAccessToken}
            setRefreshToken={setRefreshToken}
          />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
//그냥 주석 변경
