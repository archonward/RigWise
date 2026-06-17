import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import { getParts } from '../db';

const partRouter = Router();

partRouter.get(
  '/',
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const category =
        typeof request.query.category === 'string' ? request.query.category : undefined;
      const search =
        typeof request.query.search === 'string' ? request.query.search : undefined;

      // Keep filtering straightforward so the route stays easy to follow.
      const parts = await getParts({ category, search });

      response.json(parts);
    } catch (error) {
      next(error);
    }
  },
);

export default partRouter;
