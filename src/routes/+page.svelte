<script lang="ts">
  import { goto } from "$app/navigation";

  function onclick() {
    goto("/chats")
  }
</script>

<div class="content-wrapper">
  <h1>AI Assistant</h1>
  <div class="div">
    <button {onclick}>Go Chat</button>
  </div>
</div>

<style>
  button {
    width: 50%;
    height: 50%;
    color:white;
    background-color: black;
    border-radius: 15px;
  }

  button:hover {
    background-color: white;
    color: black;
  }

  h1 {
    color: white;
  }

  .content-wrapper {
    margin: 0 auto;
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .div {
    height: 30%;
    width: 50%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
