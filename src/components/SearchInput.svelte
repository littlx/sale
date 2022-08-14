<script>
	import { createEventDispatcher } from 'svelte';
	import { page } from '$app/stores';

	export let placeholder = '搜索';
	export let search = $page.url.searchParams.get('search') || '';
	export let width = '40';

	const dispatch = createEventDispatcher();

	function searchKeypress(e) {
		if (e.key === 'Enter') {
			dispatch('search', { value: search });
		}
	}

	function clear() {
		dispatch('search', { value: '' });
		search = '';
	}
</script>

<div class="relative">
	<div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
		<svg
			class="w-5 h-5 text-gray-500 dark:text-gray-400"
			aria-hidden="true"
			fill="currentColor"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
			><path
				fill-rule="evenodd"
				d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
				clip-rule="evenodd"
			/></svg
		>
	</div>
	<input
		type="text"
		bind:value={search}
		on:keypress={searchKeypress}
		class={`block p-2 pl-10 w-${width} text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
		{placeholder}
	/>
	{#if search && search.length}
		<button
			type="button"
			on:click={() => clear()}
			class="absolute right-1 top-1  text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-full text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
			data-modal-toggle="editUserModal"
		>
			<svg
				class="w-5 h-5"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/></svg
			>
		</button>
	{/if}
</div>
