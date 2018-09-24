const btoa = require('btoa');
const qs = require('qs');
const fetch = require('@hanse/util-fetch-json');

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

function getAccounts(accessToken, customerId) {
  return fetch(`https://api.sbanken.no/bank/api/v1/Accounts`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      customerId
    }
  }).then(response => response.jsonData.items);
}

function getCustomer(accessToken, customerId) {
  return fetch(`https://api.sbanken.no/customers/api/v1/Customers`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      customerId
    }
  }).then(response => response.jsonData.item);
}

function getTransactions(accessToken, customerId, accountId, query) {
  const queryString = query ? `?${qs.stringify(query)}` : '';
  return fetch(
    `https://api.sbanken.no/bank/api/v1/Transactions/${accountId}${queryString}`,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        customerId
      }
    }
  ).then(response => response.jsonData);
}

function transferBetweenAccounts(accessToken, customerId, transfer) {
  const { fromAccountId, toAccountId, message, amount } = transfer;
  if (amount < 1 || amount > 100000000000000000) {
    throw new Error(
      `The amount ${amount} is not inside the valid range of 1...100000000000000000`
    );
  }

  if (message && message.length > 30) {
    throw new Error('The message can not be longer than 30 chars');
  }

  return fetch(`https://api.sbanken.no/bank/api/v1/Transfers`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json-patch+json',
      Authorization: `Bearer ${accessToken}`,
      customerId
    },
    body: JSON.stringify({
      fromAccountId,
      toAccountId,
      message,
      amount
    })
  }).then(response => response.jsonData);
}

module.exports = {
  getAccessToken,
  getAccounts,
  getCustomer,
  getTransactions,
  transferBetweenAccounts
};
