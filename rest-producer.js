const express = require('express');
const Kafka = require('node-rdkafka');
const bodyParser = require('body-parser');

const producer = new Kafka.Producer({
  'metadata.broker.list': 'localhost:9092',
  dr_cb: true
});

const app = express();
app.set('port', process.env.PORT || 3001);
app.use(bodyParser.json());

// Connect to the broker manually
producer.connect();

app.post('/:topic', (req, res, next) => {
  try {
    const message = JSON.stringify(req.body);
    producer.produce(
      req.params.topic,
      null,
      new Buffer(message),
      null,
      Date.now()
    );
  } catch (err) {
    next(err);
  }

  res.send({
    status: 'sent'
  });
});

producer.on('ready', () => {
  app.listen(app.get('port'), () =>
    console.log(`Producer listening on ${app.get('port')}`)
  );
});

producer.on('event.error', err => {
  console.error('Error from producer');
  console.error(err);
});
