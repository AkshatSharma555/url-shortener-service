import { FastifyRequest, FastifyReply } from 'fastify';

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  // Client ne jo key bheji hai
  const apiKey = request.headers['x-api-key'];
  // Hamare server par jo key set hai
  const validKey = process.env.API_KEY;

  if (!validKey) {
    request.log.error('CRITICAL: API_KEY environment variable is missing.');
    return reply.status(500).send({ error: 'INTERNAL_SERVER_ERROR' });
  }

  // Agar key nahi bheji ya galat bheji
  if (!apiKey || apiKey !== validKey) {
    return reply.status(401).send({ 
      error: 'UNAUTHORIZED', 
      message: 'Invalid or missing x-api-key header' 
    });
  }
}