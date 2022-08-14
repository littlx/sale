import { db } from '$lib/database';

export const GET = async ({ url }) => {
	const search = url.searchParams.get('search');
	const current = url.searchParams.get('current') || 1;
	const size = url.searchParams.get('size') || 20;
	const where = {};
	if (search) where['name'] = { contains: search, };

	const customer = {
		select: {
			name: true

		}
	}
	const products = {
		select: {
			price: true,
			product_name: true,
			number: true,
			product: {
				select: {
					name: true,
					price: true
				}
			}
		}
	}

	const sales = await db.sale.findMany({
		orderBy: [{ createdAt: 'desc' }],
		take: +size,
		skip: +size * (+current - 1),
		where,
		include: { customer, products },
	});
	return {
		headers: { 'Content-Type': 'application/json' },
		status: 200,
		body: { sales }
	};
};