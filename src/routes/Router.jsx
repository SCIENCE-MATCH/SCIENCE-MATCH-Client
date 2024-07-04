import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./Signup";
import Admin from "../pages/Admin";
import Teacher from "../pages/Teacher";
import LogIn from "./LogIn";
import Student from "../pages/Student";
import TestPage from "../pages/TestPage";

const Router = () => {
  console.log(`I'm working on App`);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/student" element={<Student />} />
        <Route path="/" element={<LogIn />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
