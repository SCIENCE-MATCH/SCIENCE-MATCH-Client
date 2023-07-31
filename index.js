const babelOptions = {
  presets: ["@babel/preset-react"],
};
const jsxCode = `
import React from "react";
import ReactDOM from "react-dom";

const ScienceMatch = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle login form submission logic here
  };

  return (
    <div>
      <form id="loginForm" onSubmit={handleSubmit}>
        <h1>Science match</h1>
        <input
          required
          maxLength="15"
          type="text"
          name="loginId"
          placeholder="ID"
          id="loginId"
          defaultValue="member@gmail.com"
        />
        <input
          required
          maxLength="12"
          type="password"
          name="loginPw"
          placeholder="PW"
          id="loginPw"
          defaultValue="Iammember10!"
        />
        <h3>sign in</h3>
        <input type="submit" value="Log in" />
      </form>
    </div>
  );
};

ReactDOM.render(<ScienceMatch />, document.getElementById("root"));
`;

const transpiledCode = Babel.transform(jsxCode, babelOptions).code;

// Execute the transpiled code
eval(transpiledCode);
