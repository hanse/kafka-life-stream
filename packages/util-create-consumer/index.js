const Kafka = require('node-rdkafka');
const logger = require('@hanse/util-logger');

function createConsumer(topics, onMessage) {
  const consumer = new Kafka.KafkaConsumer(
    {
      'group.id': 'kafka',
      'metadata.broker.list': 'localhost:9092'
    },
    {}
  );

  return () => {
    consumer
      .on('ready', () => {
        logger.info('Consumer is ready');
        consumer.subscribe(topics);
        consumer.consume();
      })
      .on('data', data => onMessage(data));

    consumer.connect();
  };
}

module.exports = createConsumer;
