const url = require('url');
const micro = require('micro');
const qs = require('qs');
const { buffer, createError } = micro;

const Kafka = require('node-rdkafka');

const producer = new Kafka.Producer({
  'metadata.broker.list': 'localhost:9092',
  dr_cb: true
});

function hasNoHubChallenge() {
  return (
    process.argv.includes('--no-hub-challenge') ||
    !!process.env.WEBHOOK_SKIP_HUB_CHALLENGE
  );
}

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    if (hasNoHubChallenge()) {
      throw createError(405, 'Method not supported');
    }

    const query = qs.parse(url.parse(req.url).search, {
      ignoreQueryPrefix: true
    });

    return {
      'hub.challenge': query['hub.challenge']
    };
  }

  const topic = req.url.replace(/\/$/, '').slice(1);

  if (!topic) {
    throw createError(404, 'A topic must be provided as part of the URL.');
  }

  const message = await buffer(req);

  const origin = req.headers['x-forwarded-for'] || req.headers.host;
  console.log(`Received event from ${origin}: ${message.toString()}`);

  try {
    producer.produce(topic, null, message, null, Date.now());
  } catch (error) {
    console.log('Failed to forward message to Kafka.');
  }

  res.statusCode = 200;
  res.end();
};

module.exports = handler;
if (require.main === module) {
  producer.on('ready', () => {
    micro(handler).listen(process.env.PORT || 3000);
  });

  producer.on('event.error', err => {
    console.error('Kafka Producer error', err);
  });

  producer.connect();
}
