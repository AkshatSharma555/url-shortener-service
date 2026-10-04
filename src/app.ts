import Fastify from 'fastify';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { urlRoutes } from './modules/urls/url.routes';
import { redirectUrlHandler } from './modules/urls/url.controller';
import { redis } from './core/redis';
import { handleAppError } from './core/errors';

export function buildApp() {
  const app = Fastify({
    logger: {
      level: 'info',
      // Production me log format ko clean aur JSON-structured rakhne ke liye
      transport: process.env.NODE_ENV === 'development' ? {
        target: 'pino-pretty',
        options: { translateTime: 'HH:mm:ss Z', ignore: 'pid,hostname' }
      } : undefined
    },
    // Har incoming request ko ek unique ID assign karega tracing ke liye
    genReqId: () => crypto.randomUUID()
  });

  // 1. Swagger Documentation Setup
  app.register(swagger, {
    openapi: {
      info: {
        title: 'URL Shortener Microservice API',
        description: 'Production-grade independent URL shortener microservice for cross-application consumption.',
        version: '1.0.0'
      },
      servers: [
        { url: 'http://localhost:3000', description: 'Local Development Server' }
      ],
      components: {
        securitySchemes: {
          ApiKeyAuth: {
            type: 'apiKey',
            name: 'x-api-key',
            in: 'header'
          }
        }
      }
    }
  });

  app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    }
  });

  // 2. Rate Limiter via Redis
  app.register(rateLimit, {
    max: 5,
    timeWindow: '1 minute',
    redis: redis,
    errorResponseBuilder: function (request, context) {
      return {
        statusCode: 429,
        error: {
          code: 'TOO_MANY_REQUESTS',
          message: `Rate limit exceeded. Retry in ${context.after}`
        }
      };
    }
  });

  // 3. Central Error Handler
  app.setErrorHandler(handleAppError);

  // 4. Health Check Endpoint
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // 5. Routes Registration
  app.register(urlRoutes, { prefix: '/api/v1/urls' });
  app.get('/:code', redirectUrlHandler);

  return app;
}