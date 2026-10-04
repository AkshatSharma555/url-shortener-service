import { FastifyRequest, FastifyReply } from 'fastify';
import { createUrlSchema } from './url.schema';
import { shortenUrl, resolveUrl } from './url.service';

export async function createUrlHandler(request: FastifyRequest, reply: FastifyReply) {
  const parsed = createUrlSchema.safeParse(request.body);
  
  if (!parsed.success) {
    return reply.status(400).send({
      error: 'VALIDATION_FAILED',
      details: parsed.error.format()
    });
  }

  try {
    const result = await shortenUrl(parsed.data.originalUrl);
    
    return reply.status(201).send({
      message: 'URL shortened successfully',
      data: {
        id: result.id,
        shortCode: result.shortCode,
        originalUrl: result.originalUrl,
        shortUrl: `http://localhost:${process.env.PORT || 3000}/${result.shortCode}`,
        createdAt: result.createdAt
      }
    });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'INTERNAL_SERVER_ERROR' });
  }
}

export async function getUrlHandler(request: FastifyRequest<{ Params: { code: string } }>, reply: FastifyReply) {
  const { code } = request.params;
  
  try {
    const record = await resolveUrl(code);
    
    if (!record) {
      return reply.status(404).send({ error: 'URL_NOT_FOUND' });
    }

    return reply.status(200).send({
      message: 'URL retrieved successfully',
      data: record
    });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'INTERNAL_SERVER_ERROR' });
  }
}

export async function redirectUrlHandler(request: FastifyRequest<{ Params: { code: string } }>, reply: FastifyReply) {
  const { code } = request.params;
  
  try {
    const record = await resolveUrl(code);
    
    if (!record) {
      return reply.status(404).send({ error: 'URL_NOT_FOUND' });
    }

    return reply.redirect(record.originalUrl);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'INTERNAL_SERVER_ERROR' });
  }
}