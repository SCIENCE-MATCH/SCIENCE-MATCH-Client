const root = document.getElementById("root");
function renderThings() {
  ReactDOM.render(<Login />, root);
}
function Login() {
  return (
    <form id="loginForm">
      <h1>Science match</h1>
      <input
        required
        maxlength="15"
        type="text"
        name="loginId"
        placeholder="ID"
        id="loginId"
        value="member@gmail.com"
      ></input>
      <input
        required
        maxlength="12"
        type="password"
        name="loginPw"
        placeholder="PW"
        id="loginPw"
        value="Iammember10!"
      ></input>
      <h3>sign in</h3>
      <input type="submit" value="Log in" />
    </form>
  );
}
renderThings();

/*==============Fetch===============*/
function onLoginSubmit(event) {
  event.preventDefault();
  console.log("Submit event Occured");
  loginFetch();
}
loginForm.addEventListener("submit", onLoginSubmit);

const url = "https://www.sophy.p-e.kr/auth/login";
const Data = {
  email: document.getElementById("loginId").value,
  password: document.getElementById("loginPw").value,
  access_token_expired_time: 3000,
  refresh_token_expired_time: 3000,
};
const otherParams = {
  method: "post",
  headers: {
    "content-type": "application/json; charset=UTF-8",
  },
  body: JSON.stringify(Data),
};
function loginFetch() {
  fetch(url, otherParams)
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => console.log(error));
}

/*member@gmail.com
  Iammember10!
  */
