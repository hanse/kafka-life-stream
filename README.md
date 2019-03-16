# Kafka Playground

> A collection of everything.

## Life Stream

Collect and act on events occuring in the life of an individual.

## Packages

- [Sbanken API Client](./blob/master/packages/sbanken-api-client/index.ts)
- [Sbanken Transfers Consumer](./blob/master/packages/sbanken-transfers-consumer/index.ts)
- [Strava API Client](./blob/master/packages/strava-api-client/index.ts)
- [Strava Webhook Producer](./blob/master/packages/strava-webhook-producer/index.ts)
- [Node Notifier Consumer](./blob/master/packages/node-notifier-consumer/index.ts)
- [Console Consumer](./blob/master/packages/console-consumer/index.ts)

## Create a `.env` file with a bunch of variables

```bash
export SBANKEN_APPLICATION_CLIENT_ID=xxx
export SBANKEN_USER_ID=xxxxxxxxxxx
export SBANKEN_SECRET=xxx
export STRAVA_ACCESS_TOKEN=xxxxx
```

## Components

### Strava Webhook Producer

The Strava webhook producer receives webhook events from [Strava](https://developers.strava.com/docs/webhooks/) and forwards them to Kafka.

#### Running it locally

1. Expose the running process

```bash
PORT=3000 node packages/strava-webhook-producer
autossh -M 0 -R 80:localhost:3000 serveo.net
```

2. Register it with Strava

Replace `client_id`, `client_secret` and `verify_token` with something else. The `callback_url` should match what the previous command gave you. You might also need to contact the Strava Developer team via email to have them enable webhooks for you.

```
curl -X POST \
  https://api.strava.com/api/v3/push_subscriptions \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -F client_id=xxxxx \
  -F client_secret=xxxx \
  -F callback_url=https://xxxxx.serveo.net/strava \
  -F verify_token=hanse
```

After the registration is finished you should start receving events whenever things happen on Strava such as creating a new activity or changing the title of an exisiting. You must also remember to authorize your app with your account or else you won't get any data.

Start the console consumer (`node packages/console-consumer strava`) to see the messages in this topic.

## Sbanken Transfers Consumer

The Sbanken Transfers Consumer reads messages from the `strava` topic and does something cool whenever a new Strava activity is created.

```bash
node packages/strava-transfers-consumer
```

The cool things it does is to move an amount of money equal do the difference between the elapsed time and the configured target time from a **checking** account to a **savings** account utilizing [Sbanken Open Banking APIs](https://sbanken.no/bruke/utviklerportalen/).

E.g. given a configured target of 20 minutes, **10 NOK** will be transferred if I run for 30 minutes. How useful 🍾.

## Cookbook

### Install locally on macOS

```bash
brew install kafka
brew services start zookeeper
brew services start kafka
```

```bash
# node-rdkafka needs this (see: https://github.com/Blizzard/node-rdkafka#mac-os-high-sierra)
export CPPFLAGS=-I/usr/local/opt/openssl/include
export LDFLAGS=-L/usr/local/opt/openssl/lib

yarn
```

### Read messages from the topic `topic`

```bash
kafka-console-consumer --bootstrap-server localhost:9092 --from-beginning --topic topic
```

### Open a prompt for producing messages to the topic `chat`

```bash
kafka-console-producer --broker-list localhost:9092 --topic chat
```

### Create a topic with 2 partitions

```bash
kafka-topics --zookeeper localhost:2181 --create --topic topic2 --partitions 2 --replication-factor 1
```
