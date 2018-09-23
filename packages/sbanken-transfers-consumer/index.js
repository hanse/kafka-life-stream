const {
  getAccessToken,
  getAccounts,
  getCustomer
} = require('../sbanken-api-client');

async function exploreApi() {
  const { access_token: accessToken } = await getAccessToken();

  console.log(await getAccounts(accessToken, process.env.SBANKEN_USER_ID));
  console.log(await getCustomer(accessToken, process.env.SBANKEN_USER_ID));
}

exploreApi();
