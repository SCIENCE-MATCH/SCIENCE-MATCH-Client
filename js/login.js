const loginForm = document.querySelector("#loginForm");
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
