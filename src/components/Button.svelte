<script>
	import { createEventDispatcher } from 'svelte';

	export let type = 'button';
	export let category = 'normal';
	export let clickEvent = '';

	const dispatch = createEventDispatcher();
	let bg;
	let textCol = 'text-white';
	let hoverCol;
	let ringCol;
	switch (category) {
		case 'normal':
			bg = 'bg-white';
			textCol = 'text-gray-600';
			hoverCol = 'bg-gray-100';
			ringCol = 'ring-indigo-400';
			break;
		case 'primary':
			bg = 'bg-indigo-400';
			hoverCol = 'bg-indigo-500';
			ringCol = 'ring-indigo-500';
			break;
		case 'danger':
			bg = 'bg-red-600';
			hoverCol = 'bg-red-700';
			ringCol = 'ring-red-500';
			break;
	}
	const style = `flex justify-center py-2 px-4 border text-sm font-medium rounded-md ${textCol} ${bg} hover:${hoverCol} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:${ringCol}`;
</script>

<button on:click={() => dispatch(clickEvent, null)} {type} class={`${style} ${$$restProps.class}`}>
	<slot />
</button>
