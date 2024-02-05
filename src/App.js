import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogIn from "./routes/LogIn";
import SignUp from "./routes/Signup";
import Admin from "./routes/adminRoutes/Admin";
import Teacher from "./routes/teacherRoutes/Teacher";
import Student from "./routes/studentRoutes/Student";

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
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/admin"
          element={
            <Admin
              accessToken={accessToken}
              setAccessToken={setAccessToken}
              refreshToken={refreshToken}
            />
          }
        />
        <Route
          path="/teacher"
          element={
            <Teacher
              accessToken={accessToken}
              setAccessToken={setAccessToken}
              refreshToken={refreshToken}
            />
          }
        />
        <Route
          path="/student"
          element={
            <Student
              accessToken={accessToken}
              setAccessToken={setAccessToken}
              refreshToken={refreshToken}
            />
          }
        />
        <Route
          path="/"
          element={
            <LogIn
              setAccessToken={setAccessToken}
              setRefreshToken={setRefreshToken}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
//그냥 주석 변경
