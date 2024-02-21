import express, { Express, Router } from 'express';
import * as bodyParser from 'body-parser';
import { AppRouter } from './routes';
import { MongooseAdapter } from './Mongoose';
import { QueueController } from './queue';

export class App {
  express: Express;
  private mongooseAdapter = MongooseAdapter.getInstance();
  private queueController: QueueController;
  router: Router;

  constructor() {
    this.express = express();
    this.express.use(express.json());
    this.express.use(bodyParser.json());
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
