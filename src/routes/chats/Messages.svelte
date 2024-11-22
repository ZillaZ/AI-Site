<script lang="ts">
  import Markdown from "svelte-exmarkdown";
  import { messages as messages_store, type Message } from "$lib/stores";
  import { onMount } from "svelte";
  import PlayButton from "./PlayButton.svelte";
  let messages: Message[] = $state([]);
  let chat: HTMLDivElement;
  let token = "";
  let isAudioPlaying = false
  onMount(async () => {
    console.log(document.cookie);
    const cookies = document.cookie.split(";");
    token = cookies
      .filter((e) => e.split("=")[0].trim() == "Token")
      .map((e) => e.split("=")[1].trim())[0];
  });

  messages_store.subscribe((e) => {
    messages = e;
    setTimeout(() => {
      if (!chat) return;
      chat.scrollTop = chat.scrollHeight;
    }, 100);
  });

  function format_date(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  }

  async function speak(id: string) {
  const button = document.getElementById(id + "_button")!;
  if (button.id === "") {
    return;
  }

  // Fetch audio data from the server
  const response = await fetch("http://192.168.1.8:8080/audio", {
    method: "POST",
    headers: {
      Token: token,
    },
    body: id,
  });
  const data = await response.text();
  const byteArray = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
  const blob = new Blob([byteArray], { type: "audio/mpeg" });

  const container = document.getElementById(id);
  const audioPlayer = document.getElementById(id + "_audio")
  button.remove()
  
  const link = URL.createObjectURL(blob);
  const audio = document.createElement("audio");
  audio.id = id + "_audio"
  audio.src = link;
  audio.controls = true; // Enable full controls
  audio.style.width = "50%"; // Optional: Style the player
  
  if (!audioPlayer && container) {
    container.appendChild(audio);
  }

  button.id = ""; // Mark button as handled
}

</script>

<div bind:this={chat} class="messages-wrapper">
  {#each messages as message}
    {#if message.message.role == "assistant"}
      <div id={message.id} class="message assistant-message">
        <Markdown md={message.message.content} />
        <p class="date">{format_date(message.created_at)}</p><br>
        <button class="play-button" id={message.id + "_button"} onclick={() => speak(message.id)}
          ><PlayButton height={0} width={5}></PlayButton></button
        >
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
    height:fit-content;
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
</style>
