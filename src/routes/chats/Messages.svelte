<script lang="ts">
  import Markdown from "svelte-exmarkdown";
  import { messages as messages_store, type Message } from "$lib/stores";
  let messages: Message[] = $state([]);
  messages_store.subscribe((e) => (messages = e));
  function format_date(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  }
</script>

<div class="messages-wrapper">
  {#each messages as message}
    {#if message.message.role == "assistant"}
      <div class="message assistant-message">
        <Markdown md={message.message.content} />
        <p class="date">{format_date(message.created_at)}</p>
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
  }

  .assistant-message {
    background-color: #101010;
    color: white;
    padding: 1rem;
  }

  .user-message {
    margin-left: auto;
    background-color: #aaaaaa;
    white-space: pre-wrap;
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
  }
</style>
