import { db } from '$lib/database';

export const GET = async ({ url }) => {
	const search = url.searchParams.get('search');
	const supplier_name = url.searchParams.get('supplier_name')
	const current = url.searchParams.get('current') || 1;
	const size = url.searchParams.get('size') || 20;
	const where = {};
	if (search) where['supplier_name'] = { contains: search, };
	if (supplier_name) where['supplier_name'] = supplier_name

	const supplier = {
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

	const buys = await db.buy.findMany({
		orderBy: [{ createdAt: 'desc' }],
		take: +size,
		skip: +size * (+current - 1),
		where,
		include: { supplier, products },
	});
	return {
		headers: { 'Content-Type': 'application/json' },
		status: 200,
		body: { buys }
	};
};