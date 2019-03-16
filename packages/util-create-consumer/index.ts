import Kafka, { ConsumerStreamMessage } from 'node-rdkafka';
import * as logger from '@hanse/util-logger';

function createConsumer(
  topics: Array<string>,
  onMessage: (data: ConsumerStreamMessage) => void
) {
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

export default createConsumer;
