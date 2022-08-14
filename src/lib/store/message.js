import {writable} from "svelte/store"

export const message = writable('')
export const category = writable('success')

export function popMessage(msg, typ = 'error') {
  message.set(msg)
  category.set(typ)
  setTimeout(() => {message.set('')}, 3000)
}