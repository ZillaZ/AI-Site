import { writable, type Writable } from "svelte/store";
import type { Message, UserInfo } from "./types";

export let messages : Writable<Message[]> = writable([])
export let chat_id : Writable<string> = writable("")
export let user_info : Writable<UserInfo> = writable({token: "", name: "", email: ""})