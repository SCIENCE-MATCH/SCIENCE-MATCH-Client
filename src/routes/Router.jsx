import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./Signup";
import Admin from "../pages/Admin";
import Teacher from "../pages/Teacher";
import LogIn from "./LogIn";
import Student from "../pages/Student";
import TestPage from "../pages/TestPage";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={`${process.env.PUBLIC_URL}/signup`} element={<SignUp />} />
        <Route path={`${process.env.PUBLIC_URL}/admin`} element={<Admin />} />
        <Route path={`${process.env.PUBLIC_URL}/teacher`} element={<Teacher />} />
        <Route path={`${process.env.PUBLIC_URL}/student`} element={<Student />} />
        <Route path={`${process.env.PUBLIC_URL}/`} element={<LogIn />} />
        <Route path={`${process.env.PUBLIC_URL}/test`} element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
