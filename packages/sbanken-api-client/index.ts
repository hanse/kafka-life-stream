import btoa from 'btoa';
import qs from 'qs';
import fetch from '@hanse/util-fetch-json';
import { Customer, Account, Transfer } from './types';

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

export function getAccessToken(): Promise<{ access_token: string }> {
  validateConfig();
  const url = 'https://auth.sbanken.no/identityserver/connect/token';

  const basicAuth = btoa(
    `${encodeURIComponent(config.clientId)}:${encodeURIComponent(
      config.secret
    )}`
  );

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

export function getAccounts(
  accessToken: string,
  customerId: string
): Promise<Array<Account>> {
  return fetch(`https://api.sbanken.no/bank/api/v1/Accounts`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      customerId
    }
  }).then(response => response.jsonData.items);
}

export function getCustomer(
  accessToken: string,
  customerId: string
): Promise<Customer> {
  return fetch(`https://api.sbanken.no/customers/api/v1/Customers`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      customerId
    }
  }).then(response => response.jsonData.item);
}

export function getTransactions(
  accessToken: string,
  customerId: string,
  accountId: string,
  query: { [key: string]: string }
) {
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

export function transferBetweenAccounts(
  accessToken: string,
  customerId: string,
  transfer: Transfer
) {
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
