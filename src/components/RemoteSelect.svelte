<script>
	import Select from 'svelte-select';
	import { createEventDispatcher } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	const dispatch = createEventDispatcher();
	const params = new URLSearchParams($page.url.searchParams);
	export let dbTable;
	export let value;
	export let placeholder = '请选择';
	export let filter = '';
	let items;

	onMount(async () => {
		const resp = await fetch(`/crud/all_${dbTable}`);
		const result = await resp.json();
		// items = result.map((i) => {
		// 	return { value: i.id, label: i.name };
		// });
		items = result.map((i) => i.name);
	});

	function freshWtihParams() {
		goto(`?${params.toString()}`, {
			keepfocus: true,
			replaceState: true,
			noscroll: true
		});
	}

	function filterSupplier(e) {
		console.log(e.detail);
		params.set('supplier_name', e.detail);
		freshWtihParams();
	}

	function select(e) {
		value = e.detail.value;
		if (filter.length) {
			params.set(filter, value);
			freshWtihParams();
		}
		dispatch('select', e.detail.value);
	}
	function clear() {
		value = '';
		if (filter.length) {
			params.delete(filter);
			freshWtihParams();
		}
		dispatch('select', value);
	}
</script>

<Select {items} {value} on:select={select} on:clear={clear} {placeholder} />
