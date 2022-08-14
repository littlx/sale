import { db } from '$lib/database'

export const PUT = async ({ params, request }) => {
  try {
    const table = params.table
    const id = params.id
    const data = await request.json();
    const related = data.related || []
    delete data.related

    if (related && related.field) {
      data[related.field] = { deleteMany: {}, create: related.data.map(i => ({ ...i })) }
    }

    const updated = await db[table].update({
      where: { id }, data
    });

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { message: '修改成功', data: updated, category: 'success' }
    };
  } catch (e) {
    console.log(e)
    return {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
      body: { message: `修改失败`, category: 'error' }
    };
  }
};