import { db } from '$lib/database';

export const GET = async ({ url, params }) => {
  const table = params.table
  const where = { active: true };
  const items = await db[table].findMany({
    orderBy: [{ createdAt: 'desc' }],
    where,
    select: { id: true, name: true }
  });
  return {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
    body: items
  };
};