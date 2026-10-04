import { FastifyInstance } from 'fastify';
import { createUrlHandler, getUrlHandler } from './url.controller';
import { requireAuth } from '../../core/auth';

export async function urlRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: [requireAuth] }, createUrlHandler);
  app.get<{ Params: { code: string } }>('/:code', { preHandler: [requireAuth] }, getUrlHandler);
}