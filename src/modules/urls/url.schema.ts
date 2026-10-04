import { z } from 'zod';

export const createUrlSchema = z.object({
  originalUrl: z.string().url("Invalid URL format. Must be a valid HTTP/HTTPS URL."),
});

// TypeScript type infer kar rahe hain
export type CreateUrlInput = z.infer<typeof createUrlSchema>;