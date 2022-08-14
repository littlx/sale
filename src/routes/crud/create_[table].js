import { db } from "$lib/database"
export const POST = async ({ request, params }) => {

  try {
    const table = params.table
    const data = await request.json()
    const result = await db[table].create({ data })

    return {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
      body: { 'message': '创建成功', data: result, 'category': 'success' }
    }
  } catch (e) {
    console.log(e)
    return {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
      body: { 'message': `创建失败`, 'category': 'error' }
    }

  }
}