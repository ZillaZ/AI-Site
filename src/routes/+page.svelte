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
    border-width: 1px;
    background-color: #131313;
  }

  button:hover {
    background-color: white;
    color: black;
  }

  .content-wrapper {
    margin: 0 auto;
    height: 90%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: #101010;
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
