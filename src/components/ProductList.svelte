<script>
	import { fade } from 'svelte/transition';
	import RemoteSelect from './RemoteSelect.svelte';
	export let value = [];
	const headers = ['商品', '单价', '数量', '合计', '操作'];

	const remove = (idx) => {
		value = [...value.slice(0, idx), ...value.slice(idx + 1, value.length)];
	};
</script>

<div class="relative">
	<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
		<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
			<tr>
				{#each headers as h}
					<th scope="col" class="p-2">
						{h}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each value as v, idx}
				<tr class="bg-white dark:bg-gray-900" transition:fade>
					<th class="p-2 w-48 font-medium text-gray-900 whitespace-nowrap dark:text-white">
						<RemoteSelect dbTable="product" bind:value={v.product_name} />
					</th>
					<td class="p-2">
						<input
							type="number"
							step="0.01"
							bind:value={v.price}
							class="w-40 shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							required
						/>
					</td>
					<td class="p-2">
						<input
							type="number"
							step="0.01"
							bind:value={v.number}
							class="w-40 shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							required
						/>
					</td>
					<td class="p-2">{v.number * v.price}</td>
					<td class="p-2 w-20">
						<span
							on:click={() => remove(idx)}
							class="cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline"
							>删除</span
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
