<script lang="ts">
  import { onMount } from "svelte";
  import Linkedin from "./Svg/Linkedin.svelte";
  import XElement from "./Svg/XElement.svelte";
  import Github from "./Svg/Github.svelte";

  let anchor: HTMLAnchorElement;
  onMount(() => (anchor = document.createElement("a")));
  function redirect(link: string) {
    if (!anchor) return;
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("href", link);
    anchor.click();
  }
</script>

<nav class="navbar">
  <a class="nav-name" href="/">AI Assistant</a>
  <div class="nav-buttons">
    <button
      onclick={() => redirect("https://www.linkedin.com/in/lucas-hsm/")}
      class="nav-button"
      ><Linkedin height={50} width={50} fill={"white"} /></button
    >
    <button onclick={() => redirect("https://x.com/zxllvz")} class="nav-button"
      ><XElement height={50} width={50} fill={"white"} /></button
    >
    <button
      onclick={() => redirect("https://github.com/ZillaZ")}
      class="nav-button"
      ><Github height={50} width={50} fill={"white"} /></button
    >
  </div>
</nav>

<style>
  @media screen and (min-width: 600px) {
    .nav-name {
      width: 20%;
    }

    .nav-button {
      border-style: solid;
      width: 33%;
      border-color: black;
      display: flex;
      justify-content: center;
      align-items: center;
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
      background-color: #000000d0;
      color: white;
      height: 10%;
      display: flex;
      align-items: center;
      padding: 0 5%;
    }
  }
  @media screen and (max-width: 600px) {
    .nav-name {
      height: 100%;
      width: 40%;
      display: flex;
      align-items: center;
      font-size: x-large;
      margin-right: 10%;
    }

    .nav-button {
      border-style: solid;
      width: 33%;
      border-color: black;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .nav-button:hover {
      background-color: black;
      color: white;
    }

    .nav-buttons {
      height: 50%;
      width: 50%;
      display: flex;
    }

    .navbar {
      background-color: #000000d0;
      color: white;
      height: 10%;
      display: flex;
      align-items: center;
      padding: 0 5%;
    }
  }
</style>
