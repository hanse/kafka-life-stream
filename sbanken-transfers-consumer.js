const { getAccessToken, getAccounts } = require('./sbanken-api-client');

getAccessToken()
  .then(data => getAccounts(data.access_token))
  .then(accounts => console.log(accounts));
