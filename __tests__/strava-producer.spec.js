const micro = require('micro');
const listen = require('test-listen');
const fetch = require('node-fetch');
const app = require('../strava-producer');
const Kafka = require('node-rdkafka');

const { mockProduce } = Kafka;

const WEBHOOK_EVENT = JSON.stringify({
  aspect_type: 'update',
  event_time: 1516126040,
  object_id: 1360128428,
  object_type: 'activity',
  owner_id: 134815,
  subscription_id: 120475,
  updates: {
    title: 'Test'
  }
});

describe('Strava Producer', () => {
  const testService = async (method, body) => {
    const service = micro(app);
    const url = await listen(service);
    const response = await fetch(url, {
      method,
      headers: {
        'Content-type': 'application/json'
      },
      body
    });
    service.close();

    return response;
  };

  beforeEach(() => {
    mockProduce.mockClear();
    Date.now = jest.fn();
  });

  it('should respond with empty 200 for webhook events', async () => {
    const response = await testService('POST', WEBHOOK_EVENT);
    expect(response.status).toEqual(200);
    expect(await response.text()).toEqual('');
  });

  it('should return 405 for non-POST requests and do nothing', async () => {
    console.error = () => {};
    for (const method of ['GET', 'PUT', 'PATCH', 'DELETE']) {
      const response = await testService(method);
      expect(response.status).toEqual(405);
    }

    expect(mockProduce).not.toHaveBeenCalled();
  });

  it('should forward messages to Kafka', async () => {
    await testService('POST', WEBHOOK_EVENT);

    expect(mockProduce).toHaveBeenCalledWith(
      'strava',
      null,
      new Buffer(WEBHOOK_EVENT),
      null,
      Date.now()
    );
  });
});
