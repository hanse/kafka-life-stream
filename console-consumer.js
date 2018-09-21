const Kafka = require('node-rdkafka');

const consumer = new Kafka.KafkaConsumer(
  {
    'group.id': 'kafka',
    'metadata.broker.list': 'localhost:9092'
  },
  {}
);

consumer.connect();

consumer
  .on('ready', () => {
    consumer.subscribe(['topic']);
    consumer.consume();
  })
  .on('data', data => {
    console.log(data.value.toString());
  });
