<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import Chat from "$lib/Components/Chat.svelte";
  import {
    chat_id as chat_id_store,
    user_info as user_info_store,
    messages,
    chats as chats_store,
    token as token_store,
  } from "$lib/stores";
  import Logout from "$lib/Components/Logout.svelte";
  import { delete_cookies } from "$lib/helper";
  import type { ClientMessage, UserInfo } from "$lib/types";
  import { websocket } from "$lib/websocket";
  let chats: string[] = $state([]);
  chats_store.subscribe((e) => {
    console.log("UPDATING CHATS")
    chats = e
  });
  let token: string = "";
  let outer_chat_id: string = $state("");
  let user_info: UserInfo = $state({
    token: "",
    name: "",
    email: "",
  });
  user_info_store.subscribe((e) => (user_info = e));
  chat_id_store.subscribe((e) => (outer_chat_id = e));
  let chat;
  let window_width = $state(600);
  onMount(async () => {
    window_width = window.innerWidth;
    user_info = JSON.parse(localStorage.getItem("user")!);
    user_info_store.set(user_info);
    const cookies = document.cookie.split(";");
    token = cookies
      .filter((e) => e.split("=")[0] == "Token")
      .map((e) => e.split("=")[1])[0];
    console.log(token);
    if (!token || token.length < 36) {
      goto("/login");
    }
    const request: ClientMessage = {
      kind: "chats",
      body: {
        get_chats: token,
      },
    };
    while (websocket.readyState != 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    websocket.send(JSON.stringify(request));
  });

  async function get_messages(chat_id: string) {
    let request: ClientMessage = {
      kind: "messages",
      body: {
        get_chat: {
          token: token,
          chat_id: chat_id,
        },
      },
    };
    chat_id_store.set(chat_id);
    websocket.send(JSON.stringify(request));
  }

  function new_chat() {
    const request: ClientMessage = {
      kind: "new_chat",
      body: {
        new_chat: {
          token: token,
        },
      },
    };
    console.log(JSON.stringify(request));
    websocket.send(JSON.stringify(request));
  }

  let option_flag = "";

  async function delete_chat(chat_id: string) {
    const request: ClientMessage = {
      kind: "delete_chat",
      body: {
        delete_chat: {
          token,
          chat_id,
        },
      },
    };
    websocket.send(JSON.stringify(request));
    if (outer_chat_id == chat_id) {
      messages.set([]);
    }
  }

  function logout() {
    delete_cookies();
    messages.set([]);
    token_store.set("");
    goto("/");
  }

  function open_options(id: string) {
    const element = document.getElementById(id)! as HTMLDivElement;
    const button = document.getElementById(
      id + "_options"
    )! as HTMLButtonElement;
    if (element.getAttribute("style")! == "") {
      element.setAttribute("style", "display: none;");
      button.setAttribute("style", "background-color: black;");
      option_flag = "";
    } else {
      option_flag = id;
      element.setAttribute("style", "");
      button.setAttribute("style", "background-color: white; color: black;");
    }
  }

  let flag = $state(false);
  function toggle_chats_tab() {
    flag = !flag;
  }
</script>

<div class="content-wrapper">
  <div style="display: {flag ? 'none' : ''}" id="left-tab">
    <div class="header">
      <button class="logout-button" onclick={logout}><Logout /></button>
      <h1>Olá, {user_info.name}</h1>
    </div>
    <div class="chats">
      {#each chats as chat_id}
        {#if chat_id}
          <div class="buttons-wrapper">
            <button
              disabled={outer_chat_id === chat_id}
              class="button chat-button"
              onclick={() => get_messages(chat_id)}
              >{chat_id.substring(0, 10)}</button
            >
            <button
              class="button options-button"
              id={chat_id + "_options"}
              onclick={() => open_options(chat_id)}>...</button
            >
            <div
              role="list"
              aria-roledescription="fodase"
              id={chat_id}
              style="display: none;"
              class="option-list"
            >
              <button class="edit-button">Edit Name</button>
              <button class="delete-button" onclick={() => delete_chat(chat_id)}
                >Delete Chat</button
              >
            </div>
          </div>
        {/if}
      {/each}
    </div>
    <div class="new-chat">
      <button class="new-chat-button" onclick={new_chat}>Nova Conversa</button>
    </div>
  </div>
  <button class="mobile" onclick={toggle_chats_tab}>=</button>
  <Chat bind:this={chat} />
</div>

<style>
  @media screen and (min-width: 600px) {
    .option-list {
      background-color: white;
      width: 10%;
      height: 10%;
      z-index: 100;
      position: absolute;
      left: 20%;
      margin-top: 8%;
    }

    .options-button {
      width: 30%;
    }

    .buttons-wrapper {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      height: 10%;
      margin-bottom: 1%;
      border-style: solid;
      border-radius: 15px;
      background-color: black;
    }

    .delete-button {
      height: 50%;
      width: 100%;
      color: red;
      font-size: smaller;
    }

    .edit-button {
      height: 50%;
      width: 100%;
      font-size: smaller;
      color: black;
    }

    .edit-button:hover {
      color: white;
      background-color: black;
    }

    .delete-button:hover {
      background-color: red;
      color: white;
    }

    .chat-button:hover {
      background-color: gray;
      color: black;
    }

    .header {
      display: flex;
      justify-content: center;
      height: 10%;
      font-size: x-large;
      margin: 0 0 1%;
      width: 100%;
    }

    .chat-button {
      width: 70%;
      font-size: smaller;
    }

    .button {
      padding: 0.1rem;
      overflow: hidden;
      height: 100%;
      border-radius: 15px;
    }

    #left-tab {
      height: 100%;
      width: 28%;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #161616;
      color: white;
    }

    .chats {
      height: 79%;
      display: flex;
      flex-direction: column;
      overflow-y: scroll;
      width: 100%;
    }

    .content-wrapper {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      background-color: #202020;
      margin: auto;
    }

    .new-chat {
      height: 10%;
      width: 100%;
    }

    .new-chat-button {
      border-style: solid;
      border-radius: 5px;
      border-width: 1px;
      padding: 1%;
      height: 100%;
      width: 100%;
    }

    .new-chat-button:hover {
      background-color: white;
      color: black;
    }

    .button:disabled {
      color: black;
      background-color: white;
    }

    .logout-button {
      width: 20%;
      height: 80%;
    }

    .mobile {
      display: none;
    }

    h1 {
      height: 80%;
      align-content: center;
    }
  }

  @media screen and (max-width: 600px) {
    .option-list {
      background-color: white;
      width: 30%;
      height: 10%;
      z-index: 100;
      position: absolute;
      left: 70%;
      margin-top: 50%;
    }

    .options-button {
      width: 30%;
    }

    .buttons-wrapper {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      height: 10%;
      margin-bottom: 1%;
      border-style: solid;
      border-radius: 15px;
      background-color: black;
    }

    .delete-button {
      height: 50%;
      width: 100%;
      color: red;
      font-size: smaller;
    }

    .edit-button {
      height: 50%;
      width: 100%;
      font-size: smaller;
      color: black;
    }

    .edit-button:hover {
      color: white;
      background-color: black;
    }

    .delete-button:hover {
      background-color: red;
      color: white;
    }

    .chat-button:hover {
      background-color: gray;
      color: black;
    }

    .header {
      display: flex;
      justify-content: center;
      height: 10%;
      font-size: x-large;
      margin: 0 0 1%;
      width: 100%;
    }

    .chat-button {
      width: 70%;
      font-size: smaller;
    }

    .button {
      padding: 0.1rem;
      overflow: hidden;
      height: 100%;
      border-radius: 15px;
    }

    #left-tab {
      height: 100%;
      width: 70%;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #161616;
      color: white;
      z-index: 100;
      position: absolute;
      left: 0;
    }

    .chats {
      height: 79%;
      display: flex;
      flex-direction: column;
      overflow-y: scroll;
      width: 100%;
    }

    .content-wrapper {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      background-color: #202020;
      margin: auto;
    }

    .new-chat {
      height: 10%;
      width: 100%;
    }

    .new-chat-button {
      border-style: solid;
      border-radius: 5px;
      border-width: 1px;
      padding: 1%;
      height: 100%;
      width: 100%;
    }

    .new-chat-button:hover {
      background-color: white;
      color: black;
    }

    .button:disabled {
      color: black;
      background-color: white;
    }

    .logout-button {
      width: 20%;
      height: 80%;
    }

    .mobile {
      z-index: 100;
      position: absolute;
      right: 0;
      top: 0;
      width: 30%;
      height: 10%;
      background-color: #101010;
      border-radius: 15px;
      color: white;
      font-size: xxx-large;
    }

    h1 {
      height: 80%;
      align-content: center;
    }
  }
</style>
