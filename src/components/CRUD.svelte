<script>
	import { crud } from '$root/lib/api';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Modal from '$root/components/Modal.svelte';
	import Pagination from '$root/components/Pagination.svelte';
	import PageHeader from '$root/components/PageHeader.svelte';
	import Table from '$root/components/Table.svelte';

	export let records;
	export let htmlTitle = '进货销售管理';
	export let table; // 数据库中table
	export let tableHeaders;
	export let formInit;

	let form = { ...formInit };
	let showModal = false;
	let editOrAdd;
	let editIdx;
	let title = '新增';
	let selected = records.map(() => false);

	function edit(idx) {
		const supplier = records[idx];
		for (const k in form) {
			form[k] = supplier[k];
		}
		showModal = true;
		title = `编辑 ${form.name} 信息`;
		editOrAdd = 'edit';
		editIdx = idx;
	}

	function add() {
		form = { ...formInit };
		title = '新增';
		showModal = true;
		editOrAdd = 'add';
	}
	async function del(id) {
		await crud(`/${table}/${id}`, { method: 'DELETE' });
	}
	async function submit() {
		if (editOrAdd == 'add') {
			await crud(`/${table}/add`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form)
			});
		} else {
			await crud(`/${table}/${records[editIdx].id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form)
			});
		}
	}

	function search(e) {
		const val = e.detail.value;
		const urlSearchParams = new URLSearchParams($page.url.searchParams);
		if (val.length === 0) {
			urlSearchParams.delete('search');
		} else {
			urlSearchParams.set('search', val);
		}
		goto(`?${urlSearchParams.toString()}`, {
			keepfocus: true,
			replaceState: true,
			noscroll: true
		});
	}

	function selectAllChanged(e) {
		selected = records.map(() => e.detail);
	}
</script>

<svelte:head>
	<title>{htmlTitle}</title>
</svelte:head>

<div class="overflow-x-auto relative sm:rounded-lg bg-white">
	<PageHeader on:search={search} on:add={add} />
	<Table bind:headers={tableHeaders} on:selectAllChanged={selectAllChanged}>
		<slot />
	</Table>

	<div class="text-center py-4">
		<Pagination />
	</div>
</div>
