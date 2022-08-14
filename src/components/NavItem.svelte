<script>
	import { page } from '$app/stores';

	export let href;
	export let title;

	$: style = $page.url.pathname.startsWith(href) ? 'bg-indigo-600 text-white' : 'text-gray-500';
</script>

<a
	{href}
	class={`${style} hover:bg-indigo-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium`}
	>{title}</a
>
