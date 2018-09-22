# Kafka Playground

> A collection of everything.

## Life Stream

A stream of events in my life. A bunch of producers will send messages the Kafka Cluster when interesting things (or anything at all) that relate to me occur.

Currently only supports [Strava](https://strava.com) Activities, but I imagine a lot more things to be implemented. This also serves as a place to learn new languages such as ReasonML, Elixir or Scala. Maybe I should require each producer to be written in a different language 🤔 But for now it is only JavaScript <3

## Create a `.env` file with a bunch of variables

```bash
export SBANKEN_APPLICATION_CLIENT_ID=xxx
export SBANKEN_USER_ID=xxxxxxxxxxx
export SBANKEN_SECRET=xxx
export STRAVA_ACCESS_TOKEN=xxxxx
```

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
