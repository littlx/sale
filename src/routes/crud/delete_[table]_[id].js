import { db } from '$lib/database'

export const DELETE = async ({ params, request }) => {
  try {
    const table = params.table
    const id = params.id
    const payload = await request.json()
    const delRelated = (payload['related'] || []).map(r => db[r.table].deleteMany({
      where: {
        [r.ref_field]: id,
      },
    }))
    // const delRelated = db.productOnBuy.deleteMany({
    //   where: {
    //     buy_id: id,
    //   },
    // })
    const delMain = db[table].delete({ where: { id } });


    const transaction = await db.$transaction([...delRelated, delMain])

    return {
      status: 204,
      headers: { 'Content-Type': 'application/json' },
      body: { message: '删除成功', category: 'success' }
    };
  } catch (e) {
    console.log(e)
    return {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
      body: { message: `删除失败`, category: 'error' }
    };
  }
};