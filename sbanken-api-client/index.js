const fetch = require('../node-fetch-json');
const btoa = require('btoa');

const config = {
  clientId: process.env.SBANKEN_APPLICATION_CLIENT_ID,
  secret: process.env.SBANKEN_SECRET
};

function validateConfig() {
  if (config.clientId == null || config.secret == null) {
    throw new Error(
      'The Sbanken API Client requires both SBANKEN_APPLICATION_CLIENT_ID and SBANKEN_SECRET environment variables.'
    );
  }
}

function getAccessToken() {
  validateConfig();
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
  }).then(response => response.jsonData);
}

function getAccounts(accessToken, accountId) {
  validateConfig();

  return fetch(`https://api.sbanken.no/bank/api/v1/accounts/${accountId}`, {
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken
    }
  }).then(response => response.jsonData);
}

module.exports = {
  getAccessToken,
  getAccounts
};
