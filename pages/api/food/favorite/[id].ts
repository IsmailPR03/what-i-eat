import { unstable_getServerSession } from 'next-auth/next';

import prisma from '@/lib/prisma';
import { authOptions } from 'pages/api/auth/[...nextauth]';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { favorite } from '@prisma/client';
import type { ApiResponse } from '@/types/apiResponse';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<favorite> | { message: string }>
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const foodId = req.query.id;

  if (!session || !session.user?.email) {
    res.status(401).json({ message: 'Failed. Not authenticated' });
    return;
  }

  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res
      .status(405)
      .json({ message: 'Only POST or DELETE method allowed' });
  }

  if (!foodId) {
    return res.status(400).json({ message: 'No food id provided' });
  }

  const item = await prisma.food.findUnique({ where: { id: Number(foodId) } });

  if (!item) {
    return res
      .status(400)
      .json({ message: `Food with id ${foodId} not found` });
  }

  if (req.method === 'DELETE') {
    await prisma.favorite.deleteMany({
      where: {
        id: Number(foodId),
        user: session.user.email,
      },
    });
    res.json({ message: 'Success' });
    return;
  }

  const result = await prisma.favorite.create({
    data: {
      id: Number(foodId),
      user: session.user.email,
    },
  });

  res.json({ status: 'success', data: result });
}
