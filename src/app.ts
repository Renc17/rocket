import express, { Express, Router } from 'express';
import * as bodyParser from 'body-parser';
import { AppRouter } from './routes';
import { MongooseAdapter } from './mongoose';
import { QueueController } from './queue';
import helmet from 'helmet';
import cors from 'cors';
import { RateLimiter } from './middlewares/rateLimiter';

export class App {
  express: Express;
  private mongooseAdapter = MongooseAdapter.getInstance();
  private readonly rateLimiter: RateLimiter = new RateLimiter();
  private queueController: QueueController;
  router: Router;

  constructor() {
    this.express = express();
    this.express.use(express.json());
    this.express.use(bodyParser.json({ limit: '1mb' }));
    this.express.use(helmet());
    this.express.disable('x-powered-by');
    this.express.use(cors());
    this.express.use(this.rateLimiter.limiter);
    this.router = AppRouter.getInstance().router;
    this.queueController = QueueController.getInstance();
    this.queueController.addPopulateDatabaseWorker();
    this.registerRoutes();
  }

  async run() {
    this.mongooseAdapter.connect();
    await this.mongooseAdapter.checkConnection();
    await this.mongooseAdapter.registerSchemas();
    await this.queueController.addPopulateJob();
    this.express.listen(process.env.PORT || 3000, () => {
      console.log(
        `[server]: Server is running at http://localhost:${process.env.PORT || 3000}`
      );
    });
  }

  private registerRoutes() {
    this.express.use('/api', this.router);
  }
}
