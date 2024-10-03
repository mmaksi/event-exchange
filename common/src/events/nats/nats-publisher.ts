import {
  connect,
  DiscardPolicy,
  JetStreamClient,
  JetStreamManager,
  NatsConnection,
  RetentionPolicy,
  StringCodec,
} from 'nats';
import { Subjects } from './subjects';

console.clear();

interface Message {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Message> {
  private nc!: NatsConnection;
  private jsm!: JetStreamManager;
  private js!: JetStreamClient;
  private sc = StringCodec();
  abstract subject: T['subject'];

  private async buildClients() {
    this.nc = await connect();
    this.jsm = await this.nc.jetstreamManager();
    this.js = this.nc.jetstream();
    const clientId = this.nc.info?.client_id as number;
    console.log(`Publisher ${clientId} connected to NATS server`);
  }

  private async createPublisher() {
    try {
      await this.jsm.streams.info('orders');
      console.log(`Stream ${'orders'} already exists`);
    } catch (err) {
      await this.jsm.streams.add({
        name: 'orders',
        subjects: ['order.created'],
        retention: RetentionPolicy.Workqueue,
        max_consumers: -1, // Unlimited consumers
        max_msgs: -1, // Unlimited messages
        max_bytes: -1, // Unlimited bytes
        discard: DiscardPolicy.Old,
      });
      console.log(`Stream ${'orders'} created`);
    }
  }

  async publish(data: T['data']) {
    const sc = StringCodec();
    const stringifiedData = JSON.stringify(data);
    const pa = await this.js.publish(this.subject, this.sc.encode(stringifiedData));
    console.log(`Message published and stored in stream: ${pa.stream}`);
  }
}
