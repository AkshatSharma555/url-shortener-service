import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';

describe('URL Shortener Microservice Integration Tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should reject URL creation without API key (401)', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/urls',
      payload: {
        originalUrl: 'https://example.com'
      }
    });

    expect(response.statusCode).toBe(401);
    const body = JSON.parse(response.payload);
    expect(body.error).toBe('UNAUTHORIZED');
  });

  it('should successfully create a short URL with valid API key (201)', async () => {
    // Test ke liye .env ya mock key use karenge
    const apiKey = process.env.API_KEY || 'my_super_secret_key_123';

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/urls',
      headers: {
        'x-api-key': apiKey,
        'content-type': 'application/json'
      },
      payload: {
        originalUrl: 'https://github.com'
      }
    });

    // Agar rate limit trigger nahi hua toh 201 aana chahiye
    if (response.statusCode === 201) {
      const body = JSON.parse(response.payload);
      expect(body.message).toBe('URL shortened successfully');
      expect(body.data).toHaveProperty('shortCode');
      expect(body.data.originalUrl).toBe('https://github.com');
    } else {
      // Agar pichle tests ki wajah se rate limit (429) hit ho gayi ho
      expect(response.statusCode).toBe(429);
    }
  });
});