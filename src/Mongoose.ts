import { Mongoose, Model } from 'mongoose';
import { company } from './models/company';

export class MongooseAdapter {
  private static instance: MongooseAdapter;
  private mongoose: Mongoose;
  private connectionString: string;
  models: { [name: string]: Model<any> } = {};

  constructor() {
    this.mongoose = new Mongoose();
    this.connectionString =
      process.env.MONGO_CONNECTION_STRING ?? 'mongodb://localhost:27017';
    console.log('MongooseAdapter created');
  }

  static getInstance() {
    if (MongooseAdapter.instance) return MongooseAdapter.instance;
    MongooseAdapter.instance = new MongooseAdapter();
    return MongooseAdapter.instance;
  }

  connect() {
    this.mongoose
      .connect(this.connectionString, {
        authSource: 'admin',
      })
      .then(() => console.log('Mongoose connected successfully'))
      .catch(err => console.log(err));
  }

  async checkConnection() {
    return new Promise<string>((resolve, reject) => {
      this.mongoose.connection.on('connected', () => {
        resolve('Mongoose connected');
      });
      this.mongoose.connection.on('error', err => {
        reject("Mongoose connection error: ', err.message");
      });
      this.mongoose.connection.on('disconnected', () => {
        reject('Mongoose disconnected');
      });
    });
  }

  async registerSchemas() {
    this.models['Company'] = this.mongoose.model('Company', company);
  }
}
