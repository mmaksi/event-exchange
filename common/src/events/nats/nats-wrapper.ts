import { JetStreamClient, JetStreamManager, NatsConnection, connect } from 'nats';

export class NatsWrapper {
  private _nc!: NatsConnection;
  private _jsClient!: JetStreamClient;
  private _jsmClient!: JetStreamManager;

  get client() {
    if (this._nc) return this._nc;
    throw new Error('Cannot access NATS client before connecting.');
  }

  get jsClient() {
    if (this._jsClient) return this._jsClient;
    throw new Error('Cannot access JetStream client before connecting.');
  }

  get jsmManager() {
    if (this._jsmClient) return this._jsmClient;
    throw new Error('Cannot access JetStream Manager before connecting.');
  }

  async connect(url: string, name: string): Promise<void> {
    try {
      this._nc = await connect({ servers: [url], name });
      this._jsClient = this.client.jetstream();
      this._jsmClient = await this.client.jetstreamManager();
      console.log('Successfully connected to NATS and initialized JetStream.');
    } catch (err) {
      console.error('Error in connecting to NATS: ', err);
      throw err;
    }
  }

  async close() {
    if (this.client) {
      await this.client.close();
      console.log('NATS connection closed.');
    }
  }
}
