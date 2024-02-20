import { MongooseAdapter } from '../Mongoose';
import { Request, Response } from 'express';

export class RouteHandlers {
  constructor(private readonly adapter: MongooseAdapter) {}

  async getCompanies(req: Request, res: Response) {
    let { query } = req.params as { [key: string]: any };
    const { skip, limit } = req.query as { [key: string]: any };
    if (!query && query.length === 0) {
      query = {};
    }
    const results = await this.adapter.getCompanies(query, {
      skip: skip ?? 0,
      limit: limit ?? 50,
    });
    res.json(results);
  }

  async getCompanyById(req: Request, res: Response) {
    const id = req.params.id;
    const result = await this.adapter.getCompanyById({ id });
    res.json(result);
  }
}
