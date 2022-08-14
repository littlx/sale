import { popMessage } from "./store/message";


export async function send(form) {
	const res = await fetch(form.action, {
		method: form.method,
		body: new FormData(form),
		headers: { accept: 'application/json' }
	});

	return await res.json();
}

export async function crud(input, init) {
	const resp = await fetch(input, init)
	switch(init.method?.toUpperCase()) {
		case 'POST':
			if (resp.status === 201) {
				window.location.reload()
			} else {
				popMessage('创建失败' )
			}
			break
		case 'PUT':
			if (resp.status === 200) {
				window.location.reload()
			} else {
				popMessage('修改失败')
			}
			break
		case 'DELETE':
			if (resp.status === 204) {
				window.location.reload()
			} else {
				popMessage('删除失败')
			}
			break
	}
}
