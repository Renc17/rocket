import express from 'express';
import { MongooseAdapter } from '../Mongoose';
import { RouteHandlers } from './handlers';

export const router = express.Router();
const mongooseAdapter = MongooseAdapter.getInstance();
const routeHandlers = new RouteHandlers(mongooseAdapter);

router.route('/companies').get(routeHandlers.getCompanies);
router.route('/companies/:id').get(routeHandlers.getCompanyById);
