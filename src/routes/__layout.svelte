<script context="module">
	export const load = async ({ session, props, url, error }) => {
		const loginPath = '/auth/login';
		if (url.pathname === loginPath) {
			return { status: 200, props };
		}
		if (!session.user) {
			return { status: 302, redirect: loginPath };
		}
		if (url.pathname === '/') {
			return { status: 302, redirect: '/supplier' };
		}
		return { status: 200, props };
	};
</script>

<script>
	import 'flowbite/dist/flowbite.css';
	import '$root/style/tw.css';
	import { session } from '$app/stores';
	import { message } from '$root/lib/store/message';
	import NavItem from '$root/components/NavItem.svelte';
	import Message from '$root/components/Message.svelte';

	const navs = [
		{ href: '/buy', title: '收购' },
		{ href: '/sale', title: '销售' },
		{ href: '/product', title: '商品' },
		{ href: '/supplier', title: '供货商' },
		{ href: '/customer', title: '客户' }
	];
</script>

<Message show={$message !== ''} />
<!-- This example requires Tailwind CSS v2.0+ -->
<nav class="bg-gray-50 shadow-sm w-full flex-initial">
	<div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
		<div class="relative flex items-center justify-between h-16">
			<div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
				<div class="flex-shrink-0 flex items-center text-gray-800 text-xl font-semibold ">
					收购销售管理
				</div>
				<div class="hidden sm:block sm:ml-6">
					<div class="flex space-x-4">
						{#each navs as nav}
							<NavItem href={nav.href} title={nav.title} />
						{/each}
					</div>
				</div>
			</div>
			{#if $session.user}
				<div class="text-gray-600">
					{$session.user?.username}
					<a
						href="/auth/logout"
						class="text-indigo-500 hover:text-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
						>退出</a
					>
				</div>
			{:else}
				<a href="/auth/login" class="text-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
					>登录</a
				>
			{/if}
		</div>
	</div>

	<!-- Mobile menu, show/hide based on menu state. -->
</nav>

<main class="flex-auto w-full  max-w-7xl mx-auto p-2 sm:px-6 lg:px-8">
	<slot />
</main>
