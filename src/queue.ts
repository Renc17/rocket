import { Cluster, Redis } from 'ioredis';
import { Queue, Worker } from 'bullmq';
import path from 'path';
import { randomUUID } from 'crypto';

export class QueueController {
  private static instance: QueueController;
  private readonly redisConnection: Redis | Cluster;
  private readonly queue: Queue;

  constructor() {
    this.redisConnection = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      maxRetriesPerRequest: null,
    });
    this.queue = this.initialize();
  }

  static getInstance() {
    if (QueueController.instance) return QueueController.instance;
    QueueController.instance = new QueueController();
    return QueueController.instance;
  }

  initialize() {
    return new Queue('rocket-populate', {
      connection: this.redisConnection,
    });
  }

  addPopulateDatabaseWorker() {
    const processorFile = path.join(__dirname, 'jobs', 'populate.js');
    new Worker('rocket-populate', processorFile, {
      connection: this.redisConnection,
    });
  }

  async addPopulateJob() {
    if (!this.queue) throw new Error('Queue not initialized');
    await this.queue.add(
      randomUUID(),
      {},
      {
        removeOnComplete: {
          age: 3600,
          count: 1000,
        },
        removeOnFail: {
          age: 24 * 3600,
        },
        repeat: {
          pattern: '0 0 8 * * *',
          tz: 'Europe/Athens',
          startDate: new Date(2024, 2, 21),
          offset: new Date().getTimezoneOffset(),
          limit: 1,
        },
      }
    );
  }
}
