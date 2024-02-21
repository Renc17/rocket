import { Router } from 'express';
import { RouteHandlers } from './handlers';

export class AppRouter {
  private static _instance: AppRouter;
  router: Router;
  private routeHandlers: RouteHandlers;

  constructor() {
    this.router = Router();
    this.routeHandlers = new RouteHandlers();
    this.registerRoutes();
  }

  static getInstance() {
    if (AppRouter._instance) return AppRouter._instance;
    AppRouter._instance = new AppRouter();
    return AppRouter._instance;
  }

  registerRoutes() {
    this.router.route('/companies').get(this.routeHandlers.getCompanies);
    this.router.route('/companies/:id').get(this.routeHandlers.getCompanyById);
  }
}
