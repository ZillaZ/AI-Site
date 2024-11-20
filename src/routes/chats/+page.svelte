<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import Chat from "./Chat.svelte";
  import { chat_id as chat_id_store, messages } from "$lib/stores"
  let chats: string[] = $state([]);
  let token: string = "";
  let chat;
  onMount(async () => {
    const cookies = document.cookie.split(";");
    token = cookies
      .filter((e) => e.split("=")[0] == "Token")
      .map((e) => e.split("=")[1])[0];
    console.log(token);
    if (!token) {
      goto("/login");
    }
    const response = await fetch("http://127.0.0.1:8080/chats", {
      headers: {
        "Token": token,
      },
    });
    if (!response.ok) {
      goto("/login");
    }
    let buffer = await response.body?.getReader().read()!;
    let dec = new TextDecoder("utf-8");
    let text = dec.decode(buffer.value);
    chats = text.split("\n");
  });

  async function get_messages(chat_id: string) {
    console.log("changing chat to " + chat_id)
    const response = await fetch("http://127.0.0.1:8080/chat/" + chat_id, { 
      headers: {
        Token: token,
      },
    });
    let buffer = await response.body?.getReader().read()!;
    let dec = new TextDecoder("utf-8");
    let data = dec.decode(buffer.value)
    let body = await JSON.parse(data);
    console.log(data)
    messages.set(body.messages)
    chat_id_store.set(chat_id)
  }

  async function new_chat() {
    const response = await fetch("http://127.0.0.1:8080/new_chat", {
      headers: {
        "Token": token
      }
    })
    if(!response.ok) {
      return
    }
    const buf = await response.body!.getReader().read()
    let dec = new TextDecoder("utf-8")
    const text = dec.decode(buf.value)
    chats.push(text)
  }
</script>

<div class="content-wrapper">
  <div id="left-tab">
    <div class="header">
      <h1>Chats Here</h1>
    </div>
    <div class="chats">
      {#each chats as chat_id}
        <button class="chat-button" onclick={() => get_messages(chat_id)}>{chat_id}</button>
      {/each}
    </div>
    <div class="new-chat">
      <button class="new-chat-button" onclick={new_chat}>New Chat</button>
    </div>
  </div>
  <Chat bind:this={chat}/>
</div>

<style>
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 10%;
    font-size: x-large;
    margin: 0 0 1%;
  }

  .chat-button {
    border-style: solid;
    border-radius: 5px;
    border-width: 1px;
    margin: 0.1rem 0;
    padding: 0.1rem;
  }

  #left-tab {
    height: 100vh;
    margin: 0 auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #cccccc;
    border-radius: 5%;
  }

  .chats {
    height: 79%;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
  }

  .content-wrapper {
    height: 95vh;
    width: 98vw;
    display: flex;
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
</style>
