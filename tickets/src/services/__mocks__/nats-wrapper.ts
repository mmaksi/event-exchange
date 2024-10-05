import { Payload, PubAck } from 'nats';

export const natsWrapper = {
  jsClient: {
    publish: jest.fn().mockImplementation((subject: string, payload: Payload) => {
      return Promise<PubAck>;
    }),
  },
  jsmManager: {
    streams: {
      info: (stream: string) => {
        return;
      },
    },
  },
};
