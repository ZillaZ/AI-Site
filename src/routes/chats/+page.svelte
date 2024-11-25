<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import Chat from "$lib/Components/Chat.svelte";
  import {
    chat_id as chat_id_store,
    user_info as user_info_store,
    messages,
  } from "$lib/stores";
  import Logout from "$lib/Components/Logout.svelte";
  import { delete_cookies } from "$lib/helper";
  import type { UserInfo } from "$lib/types";
  let chats: string[] = $state([]);
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
  onMount(async () => {
    user_info = JSON.parse(localStorage.getItem("user")!);
    user_info_store.set(user_info);
    const cookies = document.cookie.split(";");
    token = cookies
      .filter((e) => e.split("=")[0] == "Token")
      .map((e) => e.split("=")[1])[0];
    console.log(token);
    if (!token) {
      goto("/login");
    }
    const response = await fetch("http://192.168.1.8:8080/chats", {
      headers: {
        Token: token,
      },
    });

    if (!response.ok) {
      delete_cookies();
      goto("/login");
    }
    let buffer = await response.body?.getReader().read()!;
    let dec = new TextDecoder("utf-8");
    let text = dec.decode(buffer.value);
    chats = text.split("\n");
  });

  async function get_messages(chat_id: string) {
    console.log("changing chat to " + chat_id);
    const response = await fetch("http://192.168.1.8:8080/chat/" + chat_id, {
      headers: {
        Token: token,
      },
    });
    let buffer = await response.body?.getReader().read()!;
    let dec = new TextDecoder("utf-8");
    let data = dec.decode(buffer.value);
    let body = await JSON.parse(data);
    console.log(data);
    messages.set(body.messages);
    chat_id_store.set(chat_id);
  }

  async function new_chat() {
    const response = await fetch("http://192.168.1.8:8080/new_chat", {
      method: "POST",
      headers: {
        Token: token,
      },
    });
    if (!response.ok) {
      return;
    }
    const buf = await response.body!.getReader().read();
    let dec = new TextDecoder("utf-8");
    const text = dec.decode(buf.value);
    chats.push(text);
    chat_id_store.set(text);
    await get_messages(text);
  }

  async function delete_chat(chat_id: string) {
    const response = await fetch("http://192.168.1.8:8080/delete_chat", {
      method: "DELETE",
      headers: {
        Token: token,
      },
      body: chat_id,
    });
    if (response.ok) {
      if (chat_id == outer_chat_id) {
        messages.set([]);
      }
      chats = chats.filter((e) => e != chat_id);
    }
  }

  function logout() {
    delete_cookies();
    messages.set([]);
    goto("/");
  }

  function open_options(id: string) {
    const element = document.getElementById(id)! as HTMLDivElement;
    if (element.getAttribute("style")! == "") {
      element.setAttribute("style", "display: none;");
    } else {
      element.setAttribute("style", "");
    }
  }
</script>

<div class="content-wrapper">
  <div id="left-tab">
    <div class="header">
      <button class="logout-button" onclick={logout}
        ><Logout width={3}/></button
      >
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
              onmouseenter={() => open_options(chat_id)}>...</button
            >
            <div
              role="list"
              aria-roledescription="fodase"
              onmouseleave={() => open_options(chat_id)}
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
  <Chat bind:this={chat} />
</div>

<style>
  .option-list {
    background-color: white;
    width: 10%;
    height: 10%;
    z-index: 100;
    position: absolute;
    left: 20%;
    margin-top: 5%;
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

  h1 {
    height: 80%;
    align-content: center;
  }
</style>
