kafka-console-consumer --bootstrap-server localhost:9092 --from-beginning --topic topic

kafka-console-producer --broker-list localhost:9092 --topic topic

kafka-topics --zookeeper localhost:2181 --create --topic topic2 --partitions 2 --replication-factor 1
