const url = require('url');
const qs = require('qs');
const createHttpPostProducer = require('@hanse/create-http-post-producer');

const producer = createHttpPostProducer(req => {
  const query = qs.parse(url.parse(req.url).search, {
    ignoreQueryPrefix: true
  });

  return {
    'hub.challenge': query['hub.challenge']
  };
});

module.exports = producer.handler;

if (require.main === module) {
  producer.start();
}
