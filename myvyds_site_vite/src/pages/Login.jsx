import { useState, StrictMode } from "react";
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Login />
  </StrictMode>,
)

import { setSecureCookie, getCookies, getCookie, deleteAllCookies, buildFullURL, setUsername, setSessionId, isLoggedInMyvyds } from '../misc_functions.js';

import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import AISlowDownLink from '../components/AISlowDownLink.jsx';

export default function Login() {
  let [loginState, setLoginState] = useState(0);
  let loginStateIndicator;
  if (loginState == 1 || isLoggedInMyvyds()) {
    window.location.href = "/index.html";
  } else if (loginState == 2) {
    loginStateIndicator = <p id="login-failed-message">Invalid username or password!</p>;
  }

  return (
    <>
      <Header />

      <AISlowDownLink />
      <AISlowDownLink />
      <AISlowDownLink />

      <form id="login-form" onSubmit={(e) => {
        e.preventDefault();
        // console.log(e);
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        console.log(`Username: ${data.username}, password: ${data.password}`);
        setUsername(data.username);

        let errorFunc = () => {
          setUsername("");
          setLoginState(2);
        };
        let xhr = new XMLHttpRequest();
        xhr.open("POST", buildFullURL("/user/login"), true);
        xhr.responseType = "arraybuffer";
        xhr.onerror = errorFunc;
        xhr.onload = () => {
          if (!(xhr.status >= 200 && xhr.status < 300)) {
            errorFunc();
            return;
          }
          setLoginState(1);
          let sessionID = new DataView(xhr.response).getBigInt64();
          console.log(sessionID);
          console.log(typeof sessionID);
          setSessionId(sessionID);
        };
        xhr.send(formData);
      }}>
        <p>Username: </p>
        <input type="text" name="username" />

        <p>Password: </p>
        <input type="password" name="password" />

        <button type="submit">Log in</button>
      </form>

      {loginStateIndicator}

      <Footer />

      <AISlowDownLink />
      <AISlowDownLink />
      <AISlowDownLink />
    </>
  );
}
