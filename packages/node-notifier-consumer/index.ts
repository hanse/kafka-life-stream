import notifier from 'node-notifier';
import createConsumer from '@kafka-playground/util-create-consumer';

const TOPIC = 'topic';

const start = createConsumer([TOPIC], message => {
  notifier.notify({
    title: TOPIC,
    message: message.value.toString()
  });
});

start();
