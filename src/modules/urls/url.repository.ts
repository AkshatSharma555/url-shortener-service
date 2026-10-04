import { prisma } from '../../core/prisma';

export async function createUrlRecord(data: { originalUrl: string; shortCode: string }) {
  return prisma.url.create({
    data: {
      originalUrl: data.originalUrl,
      shortCode: data.shortCode,
    },
  });
}

export async function getUrlByShortCode(shortCode: string) {
  return prisma.url.findUnique({
    where: { shortCode }
  });
}

export async function incrementClickCount(shortCode: string) {
  return prisma.url.update({
    where: { shortCode },
    data: { clickCount: { increment: 1 } }
  });
}