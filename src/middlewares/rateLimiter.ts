import { rateLimit, RateLimitRequestHandler } from 'express-rate-limit';

export class RateLimiter {
  private readonly _limiter: RateLimitRequestHandler;

  constructor() {
    this._limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 50,
      legacyHeaders: true,
      standardHeaders: true,
    });
  }

  get limiter() {
    return this._limiter;
  }
}
