import { writable, type Writable } from "svelte/store";
import type { Message, UserInfo } from "./types";
import { SvelteMap } from "svelte/reactivity";

export let messages : Writable<Message[]> = writable([])
export let chat_id : Writable<string> = writable("")
export let user_info : Writable<UserInfo> = writable({token: "", name: "", email: ""})
export let chats : Writable<string[]> = writable([])
export let token : Writable<string> = writable("")
export let audio : Writable<SvelteMap<string, string>> = writable(new SvelteMap())