import Kafka, { ConsumerStreamMessage } from 'node-rdkafka';
import * as logger from '@kafka-playground/util-logger';

function createConsumer(
  groupId: string,
  topics: Array<string>,
  onMessage: (data: ConsumerStreamMessage) => void
) {
  const consumer = new Kafka.KafkaConsumer(
    {
      'group.id': groupId,
      'metadata.broker.list': 'localhost:9092'
    },
    {}
  );

  return () => {
    consumer
      .on('ready', () => {
        logger.info(`consumer with group.id ${groupId} is ready`);
        consumer.subscribe(topics);
        consumer.consume();
      })
      .on('data', data => onMessage(data))
      .on('event.error', error => console.error('librdkafka error', error));

    consumer.connect();
  };
}

export default createConsumer;
