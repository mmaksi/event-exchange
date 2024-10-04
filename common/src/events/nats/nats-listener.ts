import {
  AckPolicy,
  connect,
  ConsumerMessages,
  DeliverPolicy,
  JetStreamClient,
  JetStreamManager,
  JsMsg,
  NatsConnection,
  StringCodec,
} from 'nats';
import { Subjects } from './subjects';

interface Message {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Message> {
  private sc = StringCodec();
  abstract subject: T['subject'];
  abstract onMessage(data: T['data']): void;
  abstract stream: string;
  abstract durableName: string;

  constructor(
    private nc: NatsConnection,
    private js: JetStreamClient,
    private jsm: JetStreamManager
  ) {}

  private async createConsumer() {
    const consumerConfig = {
      durable_name: this.durableName,
      deliver_policy: DeliverPolicy.All,
      ack_policy: AckPolicy.Explicit,
      max_deliver: -1, // Unlimited delivery attempts
    };

    try {
      const consumerInfo = await this.jsm.consumers.info(this.stream, this.durableName);
      console.log(`Consumer ${consumerInfo.name} already exists`);
    } catch (err) {
      const consumerInfo = await this.jsm.consumers.add(this.stream, consumerConfig);
      console.log(`Consumer ${consumerInfo.name} created`);
    }
  }

  private async getConsumerMessages() {
    try {
      const consumer = await this.js.consumers.get('orders', 'orders_consumer');
      const consumerMessages = await consumer.consume();
      return consumerMessages;
    } catch (error) {
      throw new Error(`Error while listening: ${error}`);
    }
  }

  private async processConsumerMessages(messages: ConsumerMessages) {
    for await (const msg of messages) {
      try {
        console.log(`Received message #${msg.seq}: ${msg.subject}/${msg.info.stream}`);
        const parsedData = this.parseMessage(msg);
        this.onMessage(parsedData);
        msg.ack();
      } catch (error) {
        console.error(`Failed to process message: ${(error as Error).message}`);
      }
    }
  }

  private parseMessage(msg: JsMsg) {
    const data = this.sc.decode(msg.data);
    return JSON.parse(data.toString());
  }

  async consume() {
    await this.createConsumer();
    const consumerMessages = await this.getConsumerMessages();
    await this.processConsumerMessages(consumerMessages);
  }
}
