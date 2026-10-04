import { FastifyReply, FastifyRequest } from 'fastify';

export function handleAppError(error: unknown, request: FastifyRequest, reply: FastifyReply) {
  request.log.error(error);

  // Zod Validation Error handling
  if (error && typeof error === 'object' && 'validation' in error) {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request payload validation failed.',
        details: error.validation
      }
    });
  }

  // Default Internal Server Error (Never leak stack traces in production)
  return reply.status(500).send({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred on the server.'
    }
  });
}