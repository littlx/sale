<script>
	import SearchInput from './SearchInput.svelte';
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';

	const dispatch = createEventDispatcher();

	function forward(eventName, event) {
		dispatch(eventName, event.detail);
	}
</script>

<div class="flex justify-between items-center pt-8 pb-4 px-4">
	<div class="flex">
		<Button clickEvent="add" on:add={() => dispatch('add', null)}>新增</Button>
		<slot />
	</div>
	<SearchInput on:search={(e) => forward('search', e)} />
</div>
