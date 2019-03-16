const {
  getAccessToken,
  getAccounts,
  getCustomer,
  getTransactions
} = require('./');

async function exploreApi() {
  const customerId = process.env.SBANKEN_USER_ID;
  const { access_token: accessToken } = await getAccessToken();

  const accounts = await getAccounts(accessToken, customerId);
  const customer = await getCustomer(accessToken, customerId);

  const transactions = [];
  for (const account of accounts) {
    transactions.push(
      await getTransactions(accessToken, customerId, account.accountId)
    );
  }

  console.log(
    JSON.stringify(
      {
        customer,
        accounts,
        transactions
      },
      null,
      2
    )
  );
}

exploreApi().catch(error => console.error(error.message));
