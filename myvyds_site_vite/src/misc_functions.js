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
      return BigInt(context.source);
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
