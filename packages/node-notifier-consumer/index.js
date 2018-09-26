const notifier = require('node-notifier');
const createConsumer = require('@kafka-playground/util-create-consumer');

const TOPIC = 'topic';

const start = createConsumer([TOPIC], message => {
  notifier.notify({
    title: TOPIC,
    message: message.value.toString()
  });
});

start();
