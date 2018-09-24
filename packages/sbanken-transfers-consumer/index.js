const {
  getAccessToken,
  getAccounts,
  transferBetweenAccounts
} = require('@hanse/sbanken-api-client');
const { getActivity } = require('@hanse/strava-api-client');
const createConsumer = require('@hanse/util-create-consumer');
const logger = require('@hanse/util-logger');

const TARGET_ELAPSED_MINUTES = 20;

async function transferFromCheckingToSavings(customerId, amount) {
  const { access_token: accessToken } = await getAccessToken();
  const accounts = await getAccounts(accessToken, customerId);

  const checkingAccount = accounts.find(
    account => account.accountType === 'Standard account'
  );

  const savingsAccount = accounts.find(
    account => account.accountType === 'High interest account'
  );

  if (!checkingAccount || !savingsAccount) {
    throw new Error(
      'You need both a savings account and a checkings account to do this.'
    );
  }

  return transferBetweenAccounts(accessToken, customerId, {
    fromAccountId: checkingAccount.accountId,
    toAccountId: savingsAccount.accountId,
    amount,
    message: 'Strava Initiated Payment'
  });
}

// You probably don't want to let this consumer
// read from the beginning when you start it hahah
const start = createConsumer(['strava'], async message => {
  const event = JSON.parse(message.value.toString());
  if (event.aspect_type !== 'create') {
    return;
  }

  const activityId = event.object_id;
  try {
    const activity = await getActivity(
      process.env.STRAVA_ACCESS_TOKEN,
      activityId
    );
    const { elapsed_time: elapsed } = activity;

    const minutes = Math.floor(elapsed / 60);
    if (minutes > TARGET_ELAPSED_MINUTES) {
      const amount = minutes - TARGET_ELAPSED_MINUTES;
      logger.info(
        `Attempting to transfer ${amount} NOK from Checking to Savings.`
      );
      await transferFromCheckingToSavings(process.env.SBANKEN_USER_ID, amount);
      logger.info(
        `Successfully transferred ${amount} NOK from Checking to Savings.`
      );
    }
  } catch (error) {
    logger.error(error);
  }
});

start();
