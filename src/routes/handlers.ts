import { MongooseAdapter } from '../Mongoose';
import { Request, Response } from 'express';

export class RouteHandlers {
  getCompanies(req: Request, res: Response) {
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

    MongooseAdapter.getInstance()
      .getCompanies(filer, {
        skip: parseInt(skip) ?? 0,
        limit: parseInt(limit) ?? 50,
      })
      .then(companies => res.json(companies))
      .catch(err => res.status(500).json({ error: err.message }));
  }

  getCompanyById(req: Request, res: Response) {
    const id = req.params.id;
    MongooseAdapter.getInstance()
      .getCompanyById({ id })
      .then(company => res.json(company))
      .catch(err => res.status(500).json({ error: err.message }));
  }
}
