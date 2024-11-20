<script lang="ts">
  import { onMount } from "svelte";
  let cookies: string[] = [];
  onMount(() => {
      cookies = document.cookie.split(";");
      console.log(cookies)
  });
  let token = cookies
    .filter((e) => e.split("=")[0] == "Token")
    .map((e) => e.split("=")[1]);
    console.log(token)
</script>

<h1>Main Page</h1>
{#if cookies.length == 1}
  <a href="/chats">Go Chat</a>
{/if}
{#if !(cookies.length == 1)}
  <a href="/login">Go Chat</a>
{/if}
