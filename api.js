const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());

// Send messages to the webhook-producer who will forward them to Kafka
const sendMessage = (topic, message) => {
  return fetch(`http://localhost:3001/${topic}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  });
};

app.use((req, res, next) => {
  sendMessage('topic', {
    type: 'page-visit',
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    url: req.originalUrl
  });

  next();
});

app.get('/', async (req, res) => {
  sendMessage('topic', {
    type: 'greeting',
    message: `Hello ${req.query.name || 'World'}!`
  });

  res.send({
    message: 'HELLO',
    receivedAt: Date.now()
  });
});

app.use((err, req, res, next /*eslint-disable-line*/) => {
  res.status(500).send({
    message: err.message,
    stack: err.stack
  });
});

app.listen(app.get('port'), () =>
  console.log(`API listening on ${app.get('port')}`)
);
