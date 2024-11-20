<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

    onMount(() => {
        const cookies = document.cookie.split(";")
        if (cookies.filter((e) => e.split("=")[0] == "Token").length == 1) {
            goto("/chats")
        }
    })

  let email = $state("");
  let password = $state("");
  function stringToHex(input: string): string {
    return Array.from(input)
      .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("");
  }

  async function request() {
    if (email.trim().length < 2 && password.trim().length < 8) {
      return;
    }
    let enc = new TextEncoder();
    let dec = new TextDecoder("utf-8");
    const password_hash_slice = await crypto.subtle.digest(
      "SHA-256",
      enc.encode(password)
    );
    const password_hash = stringToHex(dec.decode(password_hash_slice));
    console.log(password_hash);
    let response = await fetch("http://127.0.0.1:8080/login", {
      method: "POST",
      body: email + "\n" + password_hash,
    });
    document.cookie = response.headers.get("Cookie")!;
    console.log(response.headers);
    if (response.ok) {
      goto("/chats");
    }
  }

  let email_is_valid = $derived(email.trim().length > 1);
  let password_is_valid = $derived(password.trim().length > 7);
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
  <button onclick={request}>Login</button>
</div>

<style>
  h1 {
    text-align: center;
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
</style>
