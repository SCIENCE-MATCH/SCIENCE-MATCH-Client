import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./Signup";
import Admin from "./adminRoutes/Admin";
import Teacher from "./teacherRoutes/Teacher";
import LogIn from "./LogIn";
import Student from "./studentRoutes/Student";

const Router = () => {
  console.log(`I'm working on App`);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  useEffect(() => {
    console.log(`refresh Token : ${refreshToken}`);
    console.log(`access Token : ${accessToken}`);
  }, [accessToken, refreshToken]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/admin"
          element={<Admin accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />}
        />
        <Route
          path="/teacher"
          element={<Teacher accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />}
        />
        <Route
          path="/student"
          element={<Student accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />}
        />
        <Route path="/" element={<LogIn setAccessToken={setAccessToken} setRefreshToken={setRefreshToken} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
