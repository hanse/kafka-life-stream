require('isomorphic-fetch');

function fetchJSON(url, options) {
  return fetch(url, options).then(response => {
    return response.text().then(responseText => {
      try {
        response.jsonData = JSON.parse(responseText);
      } catch (error) {}

      response.textString = responseText;

      if (!response.ok) {
        const error = new Error(`${response.status}: ${response.textString}`);
        error.response = response;
        throw error;
      }

      return response;
    });
  });
}

module.exports = fetchJSON;
