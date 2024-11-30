<script lang="ts">
  import Markdown from "svelte-exmarkdown";
  import {
    messages as messages_store,
    audio as audio_store,
  } from "$lib/stores";
  import { type ClientMessage, type Message } from "$lib/types";
  import { onMount } from "svelte";
  import PlayButton from "./PlayButton.svelte";
  import { websocket } from "$lib/websocket";
  import { SvelteMap } from "svelte/reactivity";
  import { format_date } from "$lib/helper";
  
  let messages: Message[] = $state([]);
  let chat: HTMLDivElement;
  let token = "";
  let audios = $state(new SvelteMap());
  
  audio_store.subscribe((e) => {
    audios = e;
  });
  onMount(async () => {
    messages_store.subscribe((e) => {
      console.log("UPDATING MESSAGES");
      messages = e;
      setTimeout(() => {
        if (!chat) return;
        chat.scrollTop = chat.scrollHeight;
      }, 100);
    });

    console.log(document.cookie);
    const cookies = document.cookie.split(";");
    token = cookies
      .filter((e) => e.split("=")[0].trim() == "Token")
      .map((e) => e.split("=")[1].trim())[0];
  });

  async function speak(id: string) {
    const request: ClientMessage = {
      kind: "audio",
      body: {
        get_audio: {
          token,
          message_id: id,
        },
      },
    };
    websocket.send(JSON.stringify(request));
  }
</script>

<div bind:this={chat} class="messages-wrapper">
  {#each messages as message}
    {#if message.message.role == "assistant"}
      <div id={message.id} class="message assistant-message">
        <Markdown md={message.message.content} />
        <p class="date">{format_date(message.created_at)}</p>
        <br />
        {#if audios.get(message.id)}
          <audio controls src={audios.get(message.id) as string}></audio>
        {/if}
        {#if !audios.get(message.id)}
          <button class="play-button" onclick={() => speak(message.id)}
            ><PlayButton height={0} width={5}></PlayButton></button
          >
        {/if}
      </div>
    {/if}
    {#if message.message.role == "user"}
      <div class="message user-message">
        <p>{message.message.content}</p>
        <p class="date">{format_date(message.created_at)}</p>
      </div>
    {/if}
  {/each}
</div>

<style>
  @media screen and (min-width: 600px) {
    .message {
      border-radius: 5px;
      border-width: 1px;
      border-style: solid;
      min-width: 5%;
      max-width: 70%;
      padding: 0 1rem;
      margin-bottom: 10px;
      padding: 1rem;
      white-space: pre-wrap;
      height: fit-content;
    }

    .assistant-message {
      background-color: #101010;
      color: white;
    }

    .user-message {
      margin-left: auto;
      background-color: #dddddd;
      border-color: black;
    }

    .date {
      font-size: smaller;
      color: red;
    }

    .messages-wrapper {
      width: 100%;
      height: 100%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      overflow-y: scroll;
      overflow-x: hidden;
      padding: 1rem;
    }

    .play-button {
      color: white;
      font-size: large;
    }
  }

  @media screen and (max-width: 600px) {
    .message {
      border-radius: 5px;
      border-width: 1px;
      border-style: solid;
      min-width: 5%;
      max-width: 90%;
      padding: 0 1rem;
      margin-bottom: 10px;
      padding: 1rem;
      white-space: pre-wrap;
      height: fit-content;
    }
  }

  .messages-wrapper {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 1rem;
  }

  .play-button {
    color: white;
    font-size: large;
  }
  .assistant-message {
    background-color: #101010;
    color: white;
  }

  .user-message {
    margin-left: auto;
    background-color: #dddddd;
    border-color: black;
  }

  .date {
    font-size: smaller;
    color: red;
  }
</style>
