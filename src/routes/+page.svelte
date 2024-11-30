<script lang="ts">
  import { goto } from "$app/navigation";
  import Navbar from "$lib/Components/Navbar.svelte";

  function onclick() {
    goto("/login")
  }
</script>

<Navbar/>
<div class="content-wrapper">
  <div class="div">
    <button class="gochat-button" {onclick}>Login</button>
  </div>
</div>

<style>
  .gochat-button {
    width: 50%;
    height: 50%;
    color:white;
    border-radius: 15px;
    border-style: solid;
    background-color: #000000f0;
  }

  button:hover {
    background-color: #080808f0;
  }

  .content-wrapper {
    margin: 0 auto;
    height: 90%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: #000000a0;
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
