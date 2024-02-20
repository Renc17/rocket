import { Mongoose } from 'mongoose';

export class MongooseAdapter {
  private static instance: MongooseAdapter;
  private mongoose: Mongoose;
  private connectionString: string;

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
      .connect(this.connectionString)
      .then(() => console.log('Mongoose connected successfully'))
      .catch(err => console.log(err));
  }

  async checkConnection() {
    return new Promise<void>((resolve, reject) => {
      this.mongoose.connection.on('connected', () => {
        console.log('Mongoose connected');
        resolve();
      });
      this.mongoose.connection.on('error', err => {
        console.log('Mongoose connection error: ', err.message);
        reject();
      });
      this.mongoose.connection.on('disconnected', () => {
        console.log('Mongoose disconnected');
        reject();
      });
    });
  }
}
