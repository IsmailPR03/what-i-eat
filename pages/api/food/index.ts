import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';

import type { ApiResponse } from '@/types/apiResponse';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse | { message: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET method allowed' });
  }

  const items = await prisma.food.findMany();
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=3600');
  res.json({ status: 'success', data: items });
}
