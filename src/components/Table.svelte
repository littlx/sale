<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let headers; // 列名

	let isSelectAll;
</script>

<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
	<thead class="text-gray-600  bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
		<tr>
			<th scope="col" class="p-4">
				<div class="flex items-center">
					<input
						id="select-all"
						bind:checked={isSelectAll}
						on:change={() => dispatch('selectAllChanged', isSelectAll)}
						type="checkbox"
						class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
					/>
					<label for="select-all" class="sr-only">checkbox</label>
				</div>
			</th>
			{#each headers as header}
				<th scope="col" class="py-3 px-6 ">{header}</th>
			{/each}
		</tr>
	</thead>
	<tbody><slot /></tbody>
</table>
