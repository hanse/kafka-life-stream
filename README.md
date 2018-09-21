# Kafka Playground

# Life Stream

A stream of events in my life. A bunch of producers will send messages the Kafka Cluster when interesting things (or anything at all) that relate to me occur.

Currently only supports [Strava](https://strava.com) Activities, but I imagine a lot more things to be implemented. This also serves as a place to learn new languages such as ReasonML, Elixir or Scala. Maybe I should require each producer to be written in a different language 🤔 But for now it is only JavaScript <3

# Cookbook

## Install locally on macOS

```bash
brew install kafka
brew services start kafka
```

## Read messages from the topic `topic`

```bash
kafka-console-consumer --bootstrap-server localhost:9092 --from-beginning --topic topic
```

## Open a prompt for producing messages to the topic `chat`

```bash
kafka-console-producer --broker-list localhost:9092 --topic chat
```

## Create a topic with 2 partitions

```bash
kafka-topics --zookeeper localhost:2181 --create --topic topic2 --partitions 2 --replication-factor 1
```
