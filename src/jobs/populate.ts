import { MongooseAdapter } from '../mongoose';
import { Company } from '../types';

module.exports = async () => {
  const mongooseAdapter = MongooseAdapter.getInstance();
  mongooseAdapter.connect();
  await mongooseAdapter.checkConnection();
  await mongooseAdapter.registerSchemas();

  const lastCompany = await mongooseAdapter.models['Company']
    .findOne<Company>()
    .skip(0)
    .limit(1)
    .sort({ 'hs.id': -1 })
    .lean()
    .exec();
  if (!lastCompany) {
    await mongooseAdapter.populate();
    return;
  }
  if (lastCompany) {
    await mongooseAdapter.populate({
      after: (lastCompany as unknown as Company).hs.id,
    });
  }
};
