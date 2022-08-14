<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let current = $page.url.searchParams.get('current') || 1;
	export const size = $page.url.searchParams.get('size') || 20;

	const params = new URLSearchParams($page.url.searchParams);

	function freshWtihParams() {
		// for (const k of params.keys()) {
		//  有问题
		// 	if (!!params.get(k)?.length) {
		// 		params.delete(k);
		// 	}
		// }
		goto(`?${params.toString()}`, {
			keepfocus: true,
			replaceState: true,
			noscroll: true
		});
	}

	function to(direct) {
		const num = direct === 'prev' ? -1 : 1;
		const p = +current + num;
		if (p > 0) {
			current = p;
			params.set('current', `${current}`);
			params.set('size', `${size}`);
			freshWtihParams();
		}
	}
</script>

<ul class="inline-flex items-center -space-x-px">
	<li on:click={() => to('prev')} class="cursor-point">
		<div
			class="py-2 px-3 ml-0 leading-tight text-gray-500 bg-white  hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
		>
			<span class="sr-only">Previous</span>
			<svg
				aria-hidden="true"
				class="w-5 h-5"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
					clip-rule="evenodd"
				/></svg
			>
		</div>
	</li>
	<li>
		<span
			class="py-2 px-3 cursor-pointer leading-tight text-gray-500 bg-white  hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
			>{current}</span
		>
	</li>

	<li
		on:click={() => {
			to('next');
		}}
		class="cursor-pointer"
	>
		<div
			class="py-2 px-3 leading-tight text-gray-500 bg-white 0 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
		>
			<span class="sr-only">Next</span>
			<svg
				aria-hidden="true"
				class="w-5 h-5"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
					clip-rule="evenodd"
				/></svg
			>
		</div>
	</li>
</ul>
