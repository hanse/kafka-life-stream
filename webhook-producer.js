const micro = require('micro');
const { buffer, createError } = micro;

const Kafka = require('node-rdkafka');

const producer = new Kafka.Producer({
  'metadata.broker.list': 'localhost:9092',
  dr_cb: true
});

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    throw createError(405, 'Method not supported');
  }

  const topic = req.url.replace(/\/$/, '').slice(1);

  if (!topic) {
    throw createError(404, 'A topic must be provided as part of the URL.');
  }

  const message = await buffer(req);

  producer.produce(topic, null, message, null, Date.now());

  res.statusCode = 200;
  res.end();
};

module.exports = handler;
if (require.main === module) {
  producer.on('ready', () => {
    micro(handler).listen(process.env.PORT || 3000);
  });

  producer.on('event.error', err => {
    console.error('Error from Strava Producer');
    console.error(err);
  });

  producer.connect();
}
