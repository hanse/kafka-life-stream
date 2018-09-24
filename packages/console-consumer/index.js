const meow = require('meow');
const createConsumer = require('@hanse/create-consumer');

const cli = meow('console-consumer topic1,topic2 [--debug]');

const topics = cli.input[0] || 'topic';
const debug = !!cli.flags.debug;

const start = createConsumer(
  topics.split(',').map(topic => topic.trim()),
  data => {
    const value = data.value.toString();
    const output = debug ? { ...data, value } : value;
    console.log(output);
  }
);

start();
