import url from 'url';
import qs from 'qs';
import createHttpPostProducer from '@kafka-playground/util-create-http-post-producer';
import * as logger from '@kafka-playground/util-logger';
import { IncomingMessage } from 'http';

const last = <T>(xs: Array<T>) => xs[xs.length - 1];
const trim = (x: string) => x.trim();

function isValidRequestOrigin(req: IncomingMessage) {
  const whitelistedIps = (process.env.STRAVA_WHITELISTED_IPS || '')
    .split(',')
    .map(trim);

  const ip = last(
    ((req.headers['x-forwarded-for'] || '') as string).split(',').map(trim)
  );

  logger.info(`Validating ${ip} against [${whitelistedIps}]`);
  return whitelistedIps.includes(ip);
}

const producer = createHttpPostProducer({
  nonPostHandler: req => {
    const query = qs.parse(url.parse(req.url).search, {
      ignoreQueryPrefix: true
    });

    return {
      'hub.challenge': query['hub.challenge']
    };
  },
  isValidRequestOrigin
});

export default producer.handler;

if (require.main === module) {
  producer.start();
}
