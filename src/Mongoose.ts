import { Mongoose, Model } from 'mongoose';
import { company } from './models/company';
import { HubSpotSdk } from './hubSpotSdk';
import { CollectionResponseSimplePublicObjectWithAssociationsForwardPaging } from '@hubspot/api-client/lib/codegen/crm/companies';

export class MongooseAdapter {
  private static instance: MongooseAdapter;
  private mongoose: Mongoose;
  private connectionString: string;
  private hubSpotSdk: HubSpotSdk;
  models: { [name: string]: Model<any> } = {};

  constructor() {
    this.mongoose = new Mongoose();
    this.connectionString =
      process.env.MONGO_CONNECTION_STRING ?? 'mongodb://localhost:27017';
    this.hubSpotSdk = HubSpotSdk.getInstances();
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

  async populate() {
    let data = await this.hubSpotSdk
      .getAllCompanies({ limit: 100 })
      .then(companies => {
        return {
          next: companies.paging?.next?.after,
          results: this.companiesTransform(companies),
        };
      });
    await this.models['Company'].collection.insertMany(data.results, {
      ordered: false,
    });

    while (data.next) {
      data = await this.hubSpotSdk
        .getAllCompanies({
          after: data.next,
          limit: 100,
        })
        .then(companies => {
          return {
            next: companies.paging?.next?.after,
            results: this.companiesTransform(companies),
          };
        });
      await this.models['Company'].collection.insertMany(data.results, {
        ordered: false,
      });
    }
  }

  private companiesTransform(
    companies: CollectionResponseSimplePublicObjectWithAssociationsForwardPaging
  ) {
    return companies.results.flatMap(company => {
      if (!company.properties.name) return [];
      return {
        name: company.properties.name,
        ...(company.properties.domain && {
          domain: company.properties.domain,
        }),
        hs: {
          id: company.id,
          createdAt: company.createdAt,
          updatedAt: company.updatedAt,
        },
        archived: company.archived,
      };
    });
  }

  // API methods

  async getCompanies(
    query: { [p: string]: any },
    options: {
      skip?: number;
      limit?: number;
      // sort
    }
  ) {
    const companies = await this.models['Company']
      .find(query, undefined, { skip: options.skip, limit: options.limit })
      .lean()
      .exec();
    const totalCount = await this.models['Company'].countDocuments({});
    return {
      companies,
      totalCount,
    };
  }

  async getCompanyById(args: { id: string }) {
    const query = await this.models['Company']
      .findOne({ _id: args.id })
      .lean()
      .exec();
    const totalCount = await this.models['Company'].countDocuments({
      _id: args.id,
    });
    return {
      company: query,
      totalCount,
    };
  }
}
