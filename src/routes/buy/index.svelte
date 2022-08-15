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

	export let buys;
	export let dbTable = 'buy';
	const formInit = {
		supplier_name: '',
		date: new Date(),
		paid: false,
		rounding: 0,
		tare: 0,
		products: []
	};
	let start;
	let end;
	let form = { ...formInit };
	let showModal = false;
	let editOrAdd;
	let editIdx;
	let title = '新增';
	let tableHeaders = ['供货商', '收购日期', '毛价', '抹零', '去皮', '净价', '付款状态', '操作'];
	let selected = buys.map(() => false);

	function calProductsTotal(products) {
		let total = 0.0;
		products.forEach((p) => (total += p.number * p.price));
		return total;
	}
	$: records = buys.map((i) => {
		i['total'] = calProductsTotal([...i.products]);
		i['dry_total'] = i['total'] - i.tare - i.rounding;
		return i;
	});

	function edit(idx) {
		const buy = buys[idx];
		for (const k in form) {
			form[k] = buy[k];
		}
		form['date'] = new Date(form['date']);
		showModal = true;
		title = `编辑 ${buy.supplier_name} ${toDate(buy.date)} 收购单信息`;
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
			body: JSON.stringify({ related: [{ table: 'productOnBuy', ref_field: 'buy_id' }] })
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
					table: 'productOnBuy',
					data: data.products.map((i) => {
						delete i['product'];
						return i;
					}),
					field: 'products',
					ref_field: 'buy_id'
				};
			}
			// delete data.supplier_name;
			delete data.products;
			await crud(`/crud/update_${dbTable}_${buys[editIdx].id}`, {
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
		selected = buys.map(() => e.detail);
	}
</script>

<svelte:head>
	<title>收购管理</title>
</svelte:head>

<div class="overflow-x-auto relative sm:rounded-lg bg-white">
	<PageHeader on:search={search} on:add={add}>
		<div class="w-40 px-2">
			<RemoteSelect dbTable="supplier" placeholder="选择供应商" filter="supplier_name" />
		</div>
		<DateInput
			placeholder="收购日期起"
			bind:value={start}
			locale={localeFromDateFnsLocale(zhCN)}
			format="yyyy/MM/dd"
			closeOnSelection={true}
			--date-input-width="100%"
		/>
		<DateInput
			placeholder="收购日期止"
			bind:value={end}
			locale={localeFromDateFnsLocale(zhCN)}
			format="yyyy/MM/dd"
			closeOnSelection={true}
			--date-input-width="100%"
		/>
	</PageHeader>
	<Table bind:headers={tableHeaders} on:selectAllChanged={selectAllChanged}>
		{#each records as buy, idx}
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
					<div>{buy.supplier_name}</div>
				</th>
				<td class="py-4 px-6">{new Date(buy.date).toLocaleDateString()}</td>
				<td class="py-4 px-6">{buy.total}</td>
				<td class="py-4 px-6">{buy.rounding}</td>
				<td class="py-4 px-6">{buy.tare}</td>
				<td class="py-4 px-6">{buy.dry_total}</td>
				<td class="py-4 px-6">
					<div class="flex items-center">
						{#if buy.paid}
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
						on:click={() => del(buy.id)}
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
					<RemoteSelect dbTable="supplier" bind:value={form.supplier_name} />
				</div>
				<div class="col-span-6 sm:col-span-3">
					<label for="date" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>收购日期</label
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
					<label for="paid" class="inline-flex relative items-center cursor-pointer">
						<input
							type="checkbox"
							bind:checked={form.paid}
							id="paid"
							name="paid"
							class="sr-only peer"
						/>
						<div
							class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
						/>
						<span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
							>{form.paid ? '已支付' : '未支付'}</span
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
