function fetchServerConfigJson() {
  let result;
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/server_config.json", false);
  xhr.onload = () => {
    console.log("Data received!");
    let json_data = JSON.parse(xhr.responseText);
    result = json_data;
  };
  xhr.send();
  console.log(result);

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
