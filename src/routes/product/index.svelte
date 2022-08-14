<script>
	import PageHeader from '$root/components/PageHeader.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Pagination from '$root/components/Pagination.svelte';
	import Modal from '$root/components/Modal.svelte';
	import { crud } from '$root/lib/api';
	import Table from '$root/components/Table.svelte';

	export let products;
	export let dbTable = 'product';
	const formInit = {
		name: '',
		price: '',
		active: true
	};
	let form = { ...formInit };
	let showModal = false;
	let editOrAdd;
	let editIdx;
	let title = '新增';
	let tableHeaders = ['品名', '价格', '状态', '操作'];
	let selected = products.map(() => false);

	function edit(idx) {
		const product = products[idx];
		for (const k in form) {
			form[k] = product[k];
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
		await crud(`/crud/delete_${dbTable}_${id}`, { method: 'DELETE' });
	}
	async function submit() {
		if (editOrAdd == 'add') {
			await crud(`/crud/create_${dbTable}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form)
			});
		} else {
			await crud(`/crud/update_${dbTable}_${products[editIdx].id}`, {
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
		selected = products.map(() => e.detail);
	}
</script>

<svelte:head>
	<title>商品管理</title>
</svelte:head>

<div class="overflow-x-auto relative sm:rounded-lg bg-white">
	<PageHeader on:search={search} on:add={add} />
	<Table bind:headers={tableHeaders} on:selectAllChanged={selectAllChanged}>
		{#each products as product, idx}
			<tr
				class="border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
			>
				<td class="p-4 w-4 ">
					<div class="flex items-center">
						<input
							id="checkbox-table-search-1"
							bind:checked={selected[idx]}
							type="checkbox"
							class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
						/>
						<label for="checkbox-table-search-1" class="sr-only">checkbox</label>
					</div>
				</td>
				<th class="flex items-center py-4 px-6 whitespace-nowrap dark:text-white">
					<div>{product.name}</div>
				</th>
				<td class="py-4 px-6">{product.price}</td>
				<td class="py-4 px-6">
					<div class="flex items-center">
						{#if product.active}
							<div class="h-2.5 w-2.5 rounded-full bg-green-400 mr-2" />
							激活
						{:else}
							<div class="h-2.5 w-2.5 rounded-full bg-red-500 mr-2" />
							冻结
						{/if}
					</div>
				</td>
				<td class="py-4 px-6">
					<!-- Modal toggle -->
					<span
						on:click={() => edit(idx)}
						class="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline"
						>编辑</span
					>
					<span
						on:click={() => del(product.id)}
						class="cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline"
						>删除</span
					>
				</td>
			</tr>
		{/each}
	</Table>

	<div class="text-center py-4">
		<Pagination />
	</div>
	<!-- Edit user modal -->
</div>
{#if showModal}
	<Modal {title} on:submit={submit} on:close={() => (showModal = false)}>
		<div class="p-6 space-y-6">
			<div class="grid grid-cols-6 gap-6">
				<div class="col-span-6 sm:col-span-3">
					<label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>品名</label
					>
					<input
						name="name"
						bind:value={form.name}
						class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						required
					/>
				</div>
				<div class="col-span-6 sm:col-span-3">
					<label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>价格</label
					>
					<input
						name="price"
						type="number"
						step="0.01"
						bind:value={form.price}
						class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						required
					/>
				</div>
				<div class="col-span-6 sm:col-span-3">
					<label for="active" class="inline-flex relative items-center cursor-pointer">
						<input
							type="checkbox"
							bind:checked={form.active}
							id="active"
							name="active"
							class="sr-only peer"
						/>
						<div
							class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
						/>
						<span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">状态</span>
					</label>
				</div>
			</div>
		</div>
	</Modal>
{/if}
