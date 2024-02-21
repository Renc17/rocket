import { MongooseAdapter } from '../Mongoose';
import { Request, Response } from 'express';

export class RouteHandlers {
  async getCompanies(req: Request, res: Response) {
    const { skip, limit, name, domain, hsId } = req.query as {
      [key: string]: any;
    };
    let filer: { $and: any[] } = { $and: [{}] };
    if (hsId) {
      filer.$and.push({ 'hs.id': hsId });
    }
    if (name) {
      filer.$and.push({ name });
    }
    if (domain) {
      filer.$and.push({ domain });
    }
    const results = await MongooseAdapter.getInstance().getCompanies(filer, {
      skip: parseInt(skip) ?? 0,
      limit: parseInt(limit) ?? 50,
    });
    res.json(results);
  }

  async getCompanyById(req: Request, res: Response) {
    const id = req.params.id;
    const result = await MongooseAdapter.getInstance().getCompanyById({ id });
    res.json(result);
  }
}
