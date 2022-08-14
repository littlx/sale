import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();

export const forward = (eventName, event) => {
	dispatch(eventName, event.detail);
};
