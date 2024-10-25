import {
  DiscardPolicy,
  JetStreamClient,
  JetStreamManager,
  RetentionPolicy,
  StringCodec,
} from 'nats';
import { Subjects } from './subjects';
import { STREAMS } from './constants/nats-streams';

console.clear();

interface Message {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Message> {
  private sc = StringCodec();
  abstract subject: T['subject'];
  abstract stream: STREAMS;

  constructor(private js: JetStreamClient, private jsm: JetStreamManager) {}

  private async createPublisher() {
    try {
      await this.jsm.streams.info(this.stream);
      console.log(`Stream ${this.stream} already exists`);
    } catch (err) {
      await this.jsm.streams.add({
        name: this.stream,
        subjects: [this.subject],
        retention: RetentionPolicy.Workqueue,
        max_consumers: -1, // Unlimited consumers
        max_msgs: -1, // Unlimited messages
        max_bytes: -1, // Unlimited bytes
        discard: DiscardPolicy.Old,
      });
      console.log(`Stream ${this.stream} created`);
    }
  }

  async publish(data: T['data']) {
    await this.createPublisher();
    const stringifiedData = JSON.stringify(data);
    try {
      const pa = await this.js.publish(this.subject, this.sc.encode(stringifiedData));
      console.log(`Message published and stored in stream: ${pa.stream}`);
    } catch (error) {
      console.log(error);
    }
  }
}
