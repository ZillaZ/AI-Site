import { type Writable, writable } from "svelte/store";
export type Message = {
  id: string,
  message: CMessage,
  created_at: number
}
export type CMessage = {
    role: string,
    content: string
  }
export let messages : Writable<Message[]> = writable([])
export let chat_id : Writable<string> = writable("")