<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  onMount(() => {
    const cookies = document.cookie.split(";");
    if (cookies.filter((e) => e.split("=")[0] == "Token").length == 1) {
      goto("/chats");
    }
  });

  let email = $state("");
  let password = $state("");
  function stringToHex(input: string): string {
    return Array.from(input)
      .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("");
  }

  async function request() {
    if (email.trim().length < 2 && password.trim().length < 8) {
      alert("INVALID INPUT");
      return;
    }
    console.log("PRE");
    let response = await fetch("http://192.168.1.8:8080/login", {
      method: "POST",
      body: email + "\n" + password,
    });

    console.log(response);
    document.cookie = response.headers.get("Cookie")!;
    console.log(response.headers);
    if (response.ok) {
      goto("/chats");
    }
  }
  let email_is_valid = $derived(email.trim().length > 1);
  let password_is_valid = $derived(password.trim().length > 7);

  async function register() {
    if (!email_is_valid || !password_is_valid) {
      return;
    }
    const response = await fetch("http://192.168.1.8:8080/register", {
      method: "POST",
      body: email + "\n" + password,
    });
    if (response.ok) {
      let buf = await response.body?.getReader().read()!;
      const dec = new TextDecoder("utf-8");
      const token = dec.decode(buf.value);
      document.cookie = "Token=" + token;
      goto("/chats");
    }
  }
</script>

<div class="content-wrapper">
  <h1>Login Page</h1>
  <label for="email">Email</label>
  <input minlength="1" name="email" bind:value={email} type="email" />
  {#if !email_is_valid}
    <p class="invalid-input-label">Invalid Email</p>
  {/if}
  <label for="password">Password</label>
  <input minlength="8" name="password" bind:value={password} type="password" />
  {#if !password_is_valid}
    <p class="invalid-input-label">Invalid Password</p>
  {/if}
  <div class="button-div">
    <button onclick={async () => await request()}>Login</button>
    <button onclick={async () => await register()}>Register</button>
  </div>
</div>

<style>
  h1 {
    text-align: center;
    color: white;
  }

  label {
    color: white;
  }

  .button-div {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .content-wrapper {
    width: 50vw;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
  }

  .invalid-input-label {
    color: red;
    font-size: smaller;
    margin-top: 0;
    text-align: left;
    width: 25%;
  }
  button {
    background-color: white;
    width: 50%;
    margin-top: 10%;
  }
</style>
