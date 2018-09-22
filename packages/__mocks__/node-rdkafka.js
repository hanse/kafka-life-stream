const mockProduce = jest.fn();

const Producer = jest.fn().mockImplementation(() => {
  return {
    produce: mockProduce
  };
});

const KafkaConsumer = jest.fn();

module.exports = {
  mockProduce,
  Producer,
  KafkaConsumer
};
