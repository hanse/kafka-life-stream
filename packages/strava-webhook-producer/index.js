const url = require('url');
const qs = require('qs');
const createHttpPostProducer = require('@hanse/util-create-http-post-producer');
const logger = require('@hanse/util-logger');

const last = xs => xs[xs.length - 1];
const trim = x => x.trim();

function isValidRequestOrigin(req) {
  const whitelistedIps = (process.env.STRAVA_WHITELISTED_IPS || '')
    .split(',')
    .map(trim);

  const ip = last((req.headers['x-forwarded-for'] || '').split(',').map(trim));
  logger.info(`Validating ${ip} against [${whitelistedIps}]`);
  return whitelistedIps.includes(ip);
}

const producer = createHttpPostProducer(req => {
  const query = qs.parse(url.parse(req.url).search, {
    ignoreQueryPrefix: true
  });

  return {
    'hub.challenge': query['hub.challenge']
  };
}, isValidRequestOrigin);

module.exports = producer.handler;

if (require.main === module) {
  producer.start();
}
