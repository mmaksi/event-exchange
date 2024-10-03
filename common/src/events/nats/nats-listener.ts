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
  private nc!: NatsConnection;
  private jsm!: JetStreamManager;
  private js!: JetStreamClient;
  private sc = StringCodec();
  abstract subject: T['subject'];
  abstract onMessage(data: T['data']): void;
  abstract stream: string;
  abstract durableName: string;

  constructor() {}

  private async buildClients() {
    this.nc = await connect();
    this.jsm = await this.nc.jetstreamManager();
    this.js = this.nc.jetstream();
    const clientId = this.nc.info?.client_id as number;
    console.log(`Consumer ${clientId} connected to NATS server`);
  }

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

  async consume() {
    await this.buildClients();
    await this.createConsumer();
    const consumerMessages = await this.getConsumerMessages();
    await this.processConsumerMessages(consumerMessages);

    // TODO test SIGINT and SIGTERM
    process.on('SIGINT', async () => {
      console.info('Received SIGINT. Shutting down...');
      await this.nc.drain();
      console.log('NATS connection drained and closed');
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.info('Received SIGTERM. Shutting down...');
      await this.nc.drain();
      console.log('NATS connection drained and closed');
      process.exit(0);
    });
  }

  private parseMessage(msg: JsMsg) {
    const data = this.sc.decode(msg.data);
    return JSON.parse(data.toString());
  }
}
