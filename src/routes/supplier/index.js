import { db } from '$lib/database';

export const GET = async ({ url }) => {
	const search = url.searchParams.get('search');
	const current = url.searchParams.get('current') || 1;
	const size = url.searchParams.get('size') || 20;
	const where = {};
	if (search) where['name'] = { contains: search };
	const suppliers = await db.supplier.findMany({
		orderBy: [{ createdAt: 'desc' }],
		where,
		take: +size,
		skip: +size * (+current - 1)
	});
	return {
		headers: { 'Content-Type': 'application/json' },
		status: 200,
		body: { suppliers }
	};
};