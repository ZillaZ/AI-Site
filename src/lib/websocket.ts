import { PUBLIC_API_ENDPOINT } from "$env/static/public";
import type { ServerResponse } from "./types";
import {
  user_info as user_info_store,
  chat_id as chat_id_store,
  chats as chats_store,
  messages as messages_store,
  token,
  audio as audio_store,
} from "$lib/stores";

export const websocket = new WebSocket("ws://" + PUBLIC_API_ENDPOINT);
websocket.onmessage = onMessage;

function login(response: ServerResponse) {
  if (!response.token) return;
  console.log("SETTING HERE " + response.token.length);
  token.set(response.token);
}

function user_info0(response: ServerResponse) {
  if (!response.user_info) return;
  user_info_store.set(response.user_info);
  console.log(response.user_info.token.length);
  token.set(response.user_info.token);
  const user_info = JSON.stringify(response.user_info);
  localStorage.setItem("user", user_info);
}

function chat_id(response: ServerResponse) {
  if (!response.chat_id) return;
  console.log("NEW CHAT CREATED");
  chats_store.update((e: string[]) => {
    console.log(e);
    return [...e, response.chat_id];
  });
  //chat_id_store.set(response.chat_id);
}

function message(response: ServerResponse) {
  if (!response.message) return;
  messages_store.update((e) => [...e, response.message]);
}

function chats(response: ServerResponse) {
  if (!response.chats) return;
  chats_store.set(response.chats);
}

function messages(response: ServerResponse) {
  if (!response.messages) return;
  messages_store.set(response.messages);
}

function audio(response: ServerResponse) {
  if (!response.audio) return;
  const byteArray = Uint8Array.from(atob(response.audio.content), (c) =>
    c.charCodeAt(0)
  );
  const blob = new Blob([byteArray], { type: "audio/mpeg" });
  const link = URL.createObjectURL(blob);
  audio_store.update((e) => e.set(response.audio.message_id, link));
}

function deleted(response: ServerResponse) {
  if (!response.deleted) return;
  chats_store.update((e: string[]) => e.filter((v) => v != response.deleted));
}

function onMessage(event: MessageEvent) {
  console.log(event.data);
  const response: ServerResponse = JSON.parse(event.data);
  user_info0(response);
  login(response);
  chat_id(response);
  message(response);
  chats(response);
  messages(response);
  audio(response);
  deleted(response);
}
