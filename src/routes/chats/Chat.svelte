<script lang="ts">
  import Messages from "./Messages.svelte";
  import {
    chat_id as chat_id_store,
    messages as messages_store,
    type Message,
  } from "$lib/stores";
  import { onMount } from "svelte";
  let chat_id: string = "";
  chat_id_store.subscribe((e) => (chat_id = e));
  let messages: Message[] = $state([]);
  messages_store.subscribe((e) => (messages = e));
  let text_message: string = $state("");
  let token: string = "";
  let chat: HTMLDivElement | undefined = $state();
  onMount(async () => {
    const cookies = document.cookie.split(";");
    token = cookies
      .filter((e) => e.split("=")[0] == "Token")
      .map((e) => e.split("=")[1])[0];
  });

  $effect(() => {
    if (chat) {
      console.log("SCROLLING");
      chat.scrollTop = chat.scrollHeight;
    }
  });

  async function send_message() {
    if (text_message.trim().length < 1) {
      return;
    }

    messages.push({
      message: {
        role: "user",
        content: text_message,
      },
      created_at: 0,
    });

    const response = await fetch(
      "http://127.0.0.1:8080/new_message/" + chat_id,
      {
        headers: {
          Token: token,
        },
        method: "POST",
        body: text_message,
      }
    );
    const buffer = await response.body?.getReader().read()!;
    let dec = new TextDecoder("utf-8");
    let answer = dec.decode(buffer.value);
    console.log(answer);
    text_message = "";
    let json = JSON.parse(answer);
    messages.push(json);
    messages_store.set(messages)
  }

  function onkeydown(event: KeyboardEvent) {
    if(event.key != "Enter") return;
    send_message()
  }
</script>

<div class="messages-wrapper">
  <div bind:this={chat} class="messages">
      <Messages />
  </div>
  <div class="input-div">
    <textarea {onkeydown} bind:value={text_message}></textarea>
    <button onclick={send_message}>Send</button>
  </div>
</div>

<style>
  .messages-wrapper {
    width: 70%;
    height: 100%;
    margin: 0 auto;
  }
  
  .messages {
    height: 90%;
  }

  .input-div {
    height: 10%;
    width: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    padding: 0 1%;
  }

  textarea {
    width: 70%;
    height: 70%;
    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
  }

  button {
    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
    margin-left: 7.5%;
    width: 15%;
    height: 70%;
  }
</style>
