import { db } from '$lib/database';

export const DELETE = async ({ params }) => {
	try {
		const result = await db.supplier.delete({ where: { id: params.id } });

		return {
			status: 204,
			headers: { 'Content-Type': 'application/json' },
			body: { message: '删除成功', category: 'success' }
		};
	} catch (e) {
		return {
			headers: { 'Content-Type': 'application/json' },
			status: 500,
			body: { message: `删除失败`, category: 'error' }
		};
	}
};

export const PUT = async ({ params, request }) => {
	try {
		const data = await request.json();
		const result = await db.supplier.update({ where: { id: params.id }, data });

		return {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
			body: { message: '修改成功', data: result, category: 'success' }
		};
	} catch (e) {
		return {
			headers: { 'Content-Type': 'application/json' },
			status: 500,
			body: { message: `修改失败`, category: 'error' }
		};
	}
};
