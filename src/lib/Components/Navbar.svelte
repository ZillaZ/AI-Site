<script lang="ts">
  import { onMount } from "svelte";

  let anchor : HTMLAnchorElement
  onMount(() => anchor = document.createElement("a"))
  function redirect(link: string) {
    if(!anchor) return;
    anchor.setAttribute("target", "_blank")
    anchor.setAttribute("href", link)
    anchor.click()
  }
</script>

<nav class="navbar">
  <a class="nav-name" href="/">AI Assistant</a>
  <div class="nav-buttons">
    <button onclick={() => redirect("https://linkedin.com")} class="nav-button">LinkedIn</button>
    <button onclick={() => redirect("https://x.com")} class="nav-button">X</button>
    <button onclick={() => redirect("https://github.com/ZillaZ")} class="nav-button">Github</button>
  </div>
</nav>

<style>
  .nav-name {
    width: 20%;
  }

  .nav-button {
    border-style: solid;
    width: 33%;
    border-color: black;
  }

  .nav-button:hover {
    background-color: black;
    color: white;
  }

  .nav-buttons {
    height: 100%;
    width: 30%;
    display: flex;
    margin-left: 50%;
  }

  .navbar {
    background-color: white;
    height: 10%;
    display: flex;
    align-items: center;
    padding: 0 5%;
  }
</style>
