const micro = require('micro');
const logger = require('@hanse/util-logger');
const { buffer, createError } = micro;

const Kafka = require('node-rdkafka');

const defaultNonPostHandler = () => {
  throw createError(405, 'Method not supported');
};

const defaultIsValidRequestOrigin = () => true;

function createHttpPostProducer({
  nonPostHandler = defaultNonPostHandler,
  isValidRequestOrigin = defaultIsValidRequestOrigin
}) {
  const producer = new Kafka.Producer({
    'metadata.broker.list': 'localhost:9092',
    dr_cb: true
  });

  const handler = async (req, res) => {
    if (!isValidRequestOrigin(req)) {
      throw createError(404, 'Nothing here');
    }

    if (req.method !== 'POST') {
      return nonPostHandler(req);
    }

    const topic = req.url.replace(/\/$/, '').slice(1);

    if (!topic) {
      throw createError(404, 'A topic must be provided as part of the URL.');
    }

    const message = await buffer(req);

    const origin = req.headers['x-forwarded-for'] || req.headers.host;
    logger.info(`Received event from ${origin}: ${message.toString()}`);

    try {
      producer.produce(topic, null, message, null, Date.now());
    } catch (error) {
      logger.error('Failed to forward message to Kafka.');
    }

    res.statusCode = 200;
    res.end();
  };

  return {
    handler,
    start() {
      producer.on('ready', () => {
        logger.info('Producer is ready');
        micro(handler).listen(process.env.PORT || 3000);
      });

      producer.on('event.error', err => {
        logger.error('Kafka Producer error', err);
      });

      producer.connect();
    }
  };
}

module.exports = createHttpPostProducer;
