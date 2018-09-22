require('isomorphic-fetch');

const btoa = require('btoa');

const config = {
  clientId: process.env.SBANKEN_APPLICATION_CLIENT_ID,
  secret: process.env.SBANKEN_SECRET
};

function getAccessToken() {
  const url = 'https://auth.sbanken.no/identityserver/connect/token';

  const basicAuth = btoa(`${config.clientId}:${config.secret}`);

  return fetch(url, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: 'Basic ' + basicAuth,
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(response => {
    if (!response.ok) {
      const error = new Error('Error from Sbanken');
      error.response = response;
      throw error;
    }

    return response.json();
  });
}

function getAccounts(accessToken, accountId) {
  return fetch(`https://api.sbanken.no/bank/api/v1/accounts/${accountId}`, {
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken
    }
  }).then(response => response.json());
}

module.exports = {
  getAccessToken,
  getAccounts
};
