import { db } from '$lib/database';

export const POST= async ({ request }) => {
	const data = await request.json()

	try {
		const result = await db.supplier.create({ data })

		return {
			status: 201,
			headers: { 'Content-Type': 'application/json' },
			body: { 'message': '创建成功', data: result, 'category': 'success' }
		}
	} catch (e) {
		return {
			headers: { 'Content-Type': 'application/json' },
			status: 500,
			body: { 'message': `创建失败`, 'category': 'error' }
		}

	}
}