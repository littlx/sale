<script>
	import Select from 'svelte-select';
	import { onMount } from 'svelte';
	export let dbTable;
	export let value;
	let items;

	onMount(async () => {
		const resp = await fetch(`/crud/all_${dbTable}`);
		const result = await resp.json();
		// items = result.map((i) => {
		// 	return { value: i.id, label: i.name };
		// });
		items = result.map((i) => i.name);
	});
</script>

<Select {items} {value} on:select={(e) => (value = e.detail.value)} />
