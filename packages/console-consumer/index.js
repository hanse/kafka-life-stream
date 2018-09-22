const Kafka = require('node-rdkafka');
const meow = require('meow');

const cli = meow('console-consumer topic1,topic2 [--debug]');

const topics = cli.input[0] || 'topic';
const debug = !!cli.flags.debug;

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
    consumer.subscribe(topics.split(',').map(topic => topic.trim()));
    consumer.consume();
  })
  .on('data', data => {
    const value = data.value.toString();
    const output = debug ? { ...data, value } : value;
    console.log(output);
  });
