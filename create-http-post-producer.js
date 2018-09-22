const micro = require('micro');
const { buffer, createError } = micro;

const Kafka = require('node-rdkafka');

function createHttpPostProducer(nonPostHandler) {
  const producer = new Kafka.Producer({
    'metadata.broker.list': 'localhost:9092',
    dr_cb: true
  });

  const handler = async (req, res) => {
    if (req.method !== 'POST') {
      if (nonPostHandler == null) {
        throw createError(405, 'Method not supported');
      }

      await nonPostHandler(req);
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

  return {
    handler,
    start() {
      producer.on('ready', () => {
        console.log('Producer is ready');
        micro(handler).listen(process.env.PORT || 3000);
      });

      producer.on('event.error', err => {
        console.error('Kafka Producer error', err);
      });

      producer.connect();
    }
  };
}

module.exports = createHttpPostProducer;
