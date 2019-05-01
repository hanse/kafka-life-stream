import createProducer from './createProducer';

async function getEventLog() {
  const producer = await createProducer('event-log');
  return {
    dispatch(action: { type: string; payload: any }) {
      producer.produce(
        'app-event-log',
        null,
        Buffer.from(JSON.stringify(action)),
        null,
        Date.now()
      );
    }
  };
}

export default getEventLog;
