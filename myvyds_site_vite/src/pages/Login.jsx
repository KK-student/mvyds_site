import { useState, StrictMode } from "react";
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Login />
  </StrictMode>,
)

import { setSecureCookie, getCookies, getCookie, deleteAllCookies } from '../misc_functions.js';

export default function Login() {
  let sec_cookie_name = "secure_cookie";
  let sec_cookie_val = "sdf;alsk";
  deleteAllCookies();
  setSecureCookie(sec_cookie_name, sec_cookie_val);
  console.log("Secure cookie: ");
  console.log(getCookie(sec_cookie_name));
  console.log("All cookies: ");
  console.log(getCookies());
  return (
    <>
      <h1>Hello World!</h1>
    </>
  );
}
