import Kafka, { ConsumerStreamMessage } from 'node-rdkafka';
import * as logger from '@kafka-playground/util-logger';

export default function createProducer(name: string): Promise<Kafka.Producer> {
  return new Promise(resolve => {
    const producer = new Kafka.Producer(
      {
        'metadata.broker.list': 'localhost:9092',
        dr_cb: true
      },
      {}
    );

    producer.on('ready', () => {
      logger.info(`producer ${name} is ready`);
      resolve(producer);
    });

    producer.on('event.error', error => {
      logger.error({ name: 'Kafka Producer Error', error });
    });

    producer.connect();
  });
}
