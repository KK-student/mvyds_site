function fetchServerConfigJson() {
  let result;
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/server_config.json", false);
  xhr.onload = () => {
    let json_data = JSON.parse(xhr.responseText);
    result = json_data;
  };
  xhr.send();

  return result;
}

class NecessaryClass {
  static serverConfig = fetchServerConfigJson();

  static get() {
    // if (NecessaryClass.server_config == null) {
    //   NecessaryClass.server_config = fetchServerConfigJson();
    // }
    return NecessaryClass.serverConfig;
  }
}

export function getServerConfig() {
  return NecessaryClass.get();
}

export function buildFullURL(endpoint) {
  let server_config = getServerConfig();
  // console.log(server_config);
  return server_config.protocol + "://" + server_config.hostname + ":" + server_config.port + endpoint;
}

export function parseJSONTextWithBigInt(text) {
  return JSON.parse(text, (key, value, context) => {
    if (typeof value === 'number' && Number.isInteger(value) && !Number.isSafeInteger(value)) {
      let bi = BigInt(context.source);
      return BigInt.asUintN(64, bi);
    }
    return value;
  });
}

export function getUrlParameters() {
  const queryString = window.location.search;
  return new URLSearchParams(queryString);
}

// Source - https://stackoverflow.com/a/32108184
// Posted by Adam Zerner, modified by community. See post 'Timeline' for change history
// Retrieved 2026-11-18, License - CC BY-SA 4.0
function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

// Source - https://stackoverflow.com/a/32108184
// Posted by Adam Zerner, modified by community. See post 'Timeline' for change history
// Retrieved 2026-11-18, License - CC BY-SA 4.0
export function isEmptyObject(value) {
  if (value == null) {
    // null or undefined
    return false;
  }

  if (typeof value !== 'object') {
    // boolean, number, string, function, etc.
    return false;
  }

  const proto = Object.getPrototypeOf(value);

  // consider `Object.create(null)`, commonly used as a safe map
  // before `Map` support, an empty object as well as `{}`
  if (proto !== null && proto !== Object.prototype) {
    return false;
  }

  return isEmpty(value);
}


//Gets all of the current accessible cookies. 
export function getCookies() {
  let result = {};
  for (let cookie_pair_string of document.cookie.split("; ")) {
    let cookie_pair = cookie_pair_string.split("=");
    let cookie_name = decodeURIComponent(cookie_pair[0]);
    let cookie_value = decodeURIComponent(cookie_pair[1]);
    result[cookie_name] = cookie_value;
  }
  return result;
}

// returns the cookie with the given name,
// or undefined if not found
// From: javascript.info. 
export function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Sets a cookie with the given name to the given value with path=/ by default. 
// From: javascript.info. 
export function setCookie(name, value, attributes = {}, cookie_path = "/") {

  attributes = {
    path: cookie_path,
    // add other defaults here if necessary
    ...attributes
  };

  if (attributes.expires instanceof Date) {
    attributes.expires = attributes.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let attributeKey in attributes) {
    updatedCookie += "; " + attributeKey;
    let attributeValue = attributes[attributeKey];
    if (attributeValue !== true) {
      updatedCookie += "=" + attributeValue;
    }
  }

  document.cookie = updatedCookie;
}

// Source - https://stackoverflow.com/a/179514
// Posted by Robert J. Walker, modified by community. See post 'Timeline' for change history
// Retrieved 2026-11-19, License - CC BY-SA 4.0
// Deletes all currently accessible cookies. 
export function deleteAllCookies() {
    document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });
}

// Sets a cookie with the given name to the given value with the following attributes: secure (if setSecureFlag == true), expires (default value: 2h from now), path (default value: "/"), and samesite = "strict". 
export function setSecureCookie(cookie_name, cookie_value, setSecureFlag = true, time_length = 2 * 60 * 60 * 1000, path = "/") {
  let attributes = {};
  if (setSecureFlag) {
    attributes.secure = true;
  }
  attributes.expires = new Date(Date.now() + time_length);
  attributes.samesite = "strict";
  setCookie(cookie_name, cookie_value, attributes, path);
}

export function setUsername(username) {
  setSecureCookie("username", username);
}

export function getUsername() {
  getCookie("username");
}

export function setSessionId(session_id) {
  let session_id_conv = BigInt.asUintN(64, session_id);
  setSecureCookie("session_id", `${session_id_conv}`);
}

export function getSessionId() {
  let bi = BigInt(getCookie("session_id"));
  return BigInt.asUintN(64, bi);
}

export function isLoggedIn(check_login_function) {
  const username = getUsername();
  const session_id_string = getCookie("session_id");
  if (username == "" || session_id_string == "") {
    return false;
  }
  return check_login_function(username, getSessionId());
}

export function isLoggedInMyvyds() {
  return isLoggedIn((username, session_id) => {
    let result;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", buildFullURL("/user/is_logged_in"), false);
    xhr.onload = () => {
      result = xhr.responseText.charCodeAt(xhr.responseText.length - 1) == 1;
    };
    let form = new FormData();
    form.append("username", username);
    form.append("session_id", session_id);
    xhr.send(form);
    return result;
  });
}

