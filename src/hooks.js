import * as cookie from 'cookie';
import { db } from './lib/database';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	const cookieHeader = event.request.headers.get('cookie');
	const cookies = cookie.parse(cookieHeader ?? '');

	if (!cookies.session) {
		return await resolve(event);
	}

	const user = await db.user.findUnique({
		where: { userAuthToken: cookies.session }
	});

	if (user) {
		event.locals.user = { username: user.username };
	}

	return await resolve(event);
};

/** @type {import('@sveltejs/kit').GetSession} */
export const getSession = ({ locals }) => {
	if (!locals.user) return {};

	return {
		user: { username: locals.user.username }
	};
};
