<script>
	import PageHeader from '$root/components/PageHeader.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Pagination from '$root/components/Pagination.svelte';
	import Modal from '$root/components/Modal.svelte';
	import { crud } from '$root/lib/api';
	import Table from '$root/components/Table.svelte';
	import RemoteSelect from '$root/components/RemoteSelect.svelte';
	import { toDate } from '$lib/helper';
	import { DateInput, localeFromDateFnsLocale } from 'date-picker-svelte';
	import { zhCN } from 'date-fns/locale';
	import ProductList from '../../components/ProductList.svelte';

	export let sales;
	export let dbTable = 'sale';
	const formInit = {
		customer_name: '',
		date: new Date(),
		received: false,
		rounding: 0,
		tare: 0,
		products: []
	};
	let form = { ...formInit };
	let showModal = false;
	let editOrAdd;
	let editIdx;
	let title = '新增';
	let tableHeaders = ['客户 ', '销售日期', '毛价', '抹零', '去皮', '净价', '收款状态', '操作'];
	let selected = sales.map(() => false);

	function calProductsTotal(products) {
		let total = 0.0;
		products.forEach((p) => (total += p.number * p.price));
		return total;
	}
	$: records = sales.map((i) => {
		i['total'] = calProductsTotal([...i.products]);
		i['dry_total'] = i['total'] - i.tare - i.rounding;
		return i;
	});

	function edit(idx) {
		const sale = sales[idx];
		for (const k in form) {
			form[k] = sale[k];
		}
		form['date'] = new Date(form['date']);
		showModal = true;
		title = `编辑 ${sale.customer_name} ${toDate(sale.date)} 销售单信息`;
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
		await crud(`/crud/delete_${dbTable}_${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ related: [{ table: 'productOnSale', ref_field: 'sale_id' }] })
		});
	}
	async function submit() {
		const data = { ...form };
		if (editOrAdd == 'add') {
			data.products = { create: data.products };
			await crud(`/crud/create_${dbTable}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
		} else {
			if (data.products && data.products.length) {
				data['related'] = {
					table: 'productOnSale',
					data: data.products.map((i) => {
						delete i['product'];
						return i;
					}),
					field: 'products',
					ref_field: 'sale_id'
				};
			}
			// delete data.customer_name;
			delete data.products;
			await crud(`/crud/update_${dbTable}_${sales[editIdx].id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
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
		selected = sales.map(() => e.detail);
	}
</script>

<svelte:head>
	<title>销售管理</title>
</svelte:head>

<div class="overflow-x-auto relative sm:rounded-lg bg-white">
	<PageHeader on:search={search} on:add={add} />
	<Table bind:headers={tableHeaders} on:selectAllChanged={selectAllChanged}>
		{#each records as sale, idx}
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
					<div>{sale.customer_name}</div>
				</th>
				<td class="py-4 px-6">{new Date(sale.date).toLocaleDateString()}</td>
				<td class="py-4 px-6">{sale.total}</td>
				<td class="py-4 px-6">{sale.rounding}</td>
				<td class="py-4 px-6">{sale.tare}</td>
				<td class="py-4 px-6">{sale.dry_total}</td>
				<td class="py-4 px-6">
					<div class="flex items-center">
						{#if sale.received}
							<div class="h-2.5 w-2.5 rounded-full bg-green-400 mr-2" />
							已付款
						{:else}
							<div class="h-2.5 w-2.5 rounded-full bg-red-500 mr-2" />
							未付款
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
						on:click={() => del(sale.id)}
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
						>供应商</label
					>
					<RemoteSelect dbTable="customer" bind:value={form.customer_name} />
				</div>
				<div class="col-span-6 sm:col-span-3">
					<label for="date" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>销售日期</label
					>
					<DateInput
						bind:value={form.date}
						locale={localeFromDateFnsLocale(zhCN)}
						format="yyyy/MM/dd"
						closeOnSelection={true}
						--date-input-width="100%"
					/>
				</div>
				<div class="col-span-6 sm:col-span-3">
					<label for="rounding" class="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
						>抹零</label
					>
					<input
						name="rounding"
						type="number"
						step="0.01"
						bind:value={form.rounding}
						class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						required
					/>
				</div>
				<div class="col-span-6 sm:col-span-3">
					<label for="tare" class="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
						>去皮</label
					>
					<input
						name="tare"
						type="number"
						step="0.01"
						bind:value={form.tare}
						class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						required
					/>
				</div>
				<div class="col-span-6 sm:col-span-3">
					<span class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">付款状态</span>
					<label for="received" class="inline-flex relative items-center cursor-pointer">
						<input
							type="checkbox"
							bind:checked={form.received}
							id="received"
							name="received"
							class="sr-only peer"
						/>
						<div
							class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
						/>
						<span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
							>{form.received ? '已支付' : '未支付'}</span
						>
					</label>
				</div>
			</div>

			<div class="col-span-12">
				<div class="flex justify-between mb-2 text-sm">
					<span class="font-medium text-gray-900 dark:text-white">
						商品清单 | 毛价={calProductsTotal(form.products ?? [])}
					</span>
					<span
						on:click={() =>
							(form.products = [...form.products, { product_name: '', price: 0.0, number: 0 }])}
						class="cursor-pointer mr-2 font-medium text-indigo-600 dark:text-indigo-500 hover:underline"
						>添加</span
					>
				</div>
				<ProductList bind:value={form.products} />
			</div>
		</div>
	</Modal>
{/if}
