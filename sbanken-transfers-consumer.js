const { getAccessToken, getAccounts } = require('./sbanken-api-client');

getAccessToken()
  .then(data => getAccounts(data.access_token))
  .then(accounts => console.log(accounts))
  .catch(error => {
    if (error.response) {
      console.error(error.response.status);
      console.error(error.response.jsonData);
    } else {
      console.error(error.message);
    }
  });
