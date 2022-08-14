<script context="module">
	export const load = ({ session, props }) => {
		if (session.user) {
			return { status: 302, redirect: '/' };
		}
		return { props };
	};
</script>

<script>
	import Button from '$root/components/Button.svelte';
	import { session } from '$app/stores';
	import { send } from '$lib/api';

	export let error;

	async function login(event) {
		const formEl = event.target;
		const resp = await send(formEl);

		if (resp.error) error = resp.error;

		$session.user = resp.user;
	}
</script>

<div class="min-h-full bg-white flex justify-center py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-bold text-gray-700">登录</h2>
		</div>
		<form class="mt-8 space-y-6" method="POST" on:submit|preventDefault={login}>
			<input type="hidden" name="remember" value="true" />
			<div class="rounded-md shadow-sm -space-y-px">
				<div>
					<label for="account" class="sr-only">账号</label>
					<input
						id="account"
						name="account"
						type="text"
						autocomplete="false"
						required
						class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
						placeholder="账号"
					/>
				</div>
				<div>
					<label for="password" class="sr-only">密码</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="diabled"
						required
						class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
						placeholder="密码"
					/>
				</div>
			</div>

			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<input
						id="remember-me"
						name="remember-me"
						type="checkbox"
						class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
					/>
					<label for="remember-me" class="ml-2 block text-sm text-gray-900">保持登录</label>
				</div>

				<div class="text-sm">
					<a href="/" class="font-medium text-indigo-600 hover:text-indigo-500"> 忘记密码? </a>
				</div>
			</div>

			{#if error}
				<p class="text-orange-700">{error}</p>
			{/if}

			<div>
				<Button type="submit" category="primary" class="group relative w-full ">登录</Button>
			</div>
		</form>
	</div>
</div>
