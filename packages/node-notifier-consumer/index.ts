import notifier from 'node-notifier';
import createConsumer from '@kafka-playground/util-create-consumer';

const argv = process.argv.slice(2);
const topics = (argv[0] || 'topic').split(',');

const start = createConsumer('node-notifier', topics, message => {
  notifier.notify({
    title: 'Kafka',
    message: message.value.toString()
  });
});

start();
