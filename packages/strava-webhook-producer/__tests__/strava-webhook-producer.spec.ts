import micro from 'micro';
import Kafka from 'node-rdkafka';
import listen from 'test-listen';
import fetch from '@kafka-playground/util-fetch-json';
import app from '../';

const { mockProduce } = Kafka as any;

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
  process.env.STRAVA_WHITELISTED_IPS = '1';
  const testService = async (method: string, body: any) => {
    const service = micro(app as any);
    const url = await listen(service);
    const response = await fetch(url + '/strava', {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': '1'
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
    expect(await response.textString).toEqual('');
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
