<script lang="ts">
  import { goto } from "$app/navigation";
  import Navbar from "$lib/Components/Navbar.svelte";
  import { onMount } from "svelte";
  import {
    type ClientMessage,
    type ClientLogin,
    type ClientBody,
  } from "$lib/types";
  import { websocket } from "$lib/websocket";
  import { token as token_store } from "$lib/stores";

  onMount(() => {
    token_store.subscribe((token: string) => {
      if (!document || token.trim().length < 10) return;
      document.cookie = "Token=" + token;
      goto("/chats");
    });
    const cookies = document.cookie.split(";");
    if (cookies.filter((e) => e.split("=")[0] == "Token").length == 1) {
      goto("/chats");
    }
  });

  let email = $state("");
  let password = $state("");

  function request() {
    if (email.trim().length < 2 && password.trim().length < 8) {
      alert("INVALID INPUT");
      return;
    }
    const login: ClientLogin = {
      email: email,
      password: password,
    };

    const body: ClientBody = {
      login: login,
    };

    const message: ClientMessage = {
      kind: "login",
      body,
    } as ClientMessage;

    websocket.send(JSON.stringify(message));
  }

  let email_is_valid = $derived(email.trim().length > 1);
  let password_is_valid = $derived(password.trim().length > 7);
  let is_password_valid_field = $derived(
    password_is_valid ? " " : "Invalid Password"
  );
  let is_email_valid_field = $derived(email_is_valid ? "   " : "Invalid Email");
</script>

<Navbar />
<div class="content-wrapper">
  <div class="login-div">
    <div class="fields-div">
      <label for="email">Email</label>
      <input minlength="1" name="email" bind:value={email} type="email" />
      <p class="invalid-input-label">{is_email_valid_field}</p>
      <label for="password">Password</label>
      <input
        minlength="8"
        name="password"
        bind:value={password}
        type="password"
      />
      <p class="invalid-input-label">{is_password_valid_field}</p>
    </div>
    <div class="button-div">
      <button onclick={async () => await request()}>Login</button>
    </div>
    <p class="registration-p">
      Não tem uma conta? <a href="/register">Registre-se</a>
    </p>
  </div>
</div>

<style>
  @media screen and (min-width: 600px) {
    .fields-div {
      display: flex;
      flex-direction: column;
      width: 50%;
    }

    .login-div {
      width: 50%;
      height: 50%;
      margin: auto;
      background-color: #050505f0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 15px;
    }

    .button-div {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 5% 0;
    }

    .content-wrapper {
      height: 90%;
      width: 100%;
      margin: 0 auto;
      justify-content: center;
      align-items: center;
      display: flex;
      flex-direction: column;
      background-color: #000000a0;
    }

    .invalid-input-label {
      color: red;
      font-size: smaller;
      margin-top: 0;
      text-align: left;
      width: 100%;
    }

    button {
      background-color: white;
      width: 50%;
    }
  }

  @media screen and (max-width: 600px) {
    .fields-div {
      display: flex;
      flex-direction: column;
      width: 50%;
    }

    .login-div {
      width: 90%;
      height: 50%;
      margin: auto;
      background-color: #050505f0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 15px;
    }

    .button-div {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 5% 0;
    }

    .content-wrapper {
      height: 90%;
      width: 100%;
      margin: 0 auto;
      justify-content: center;
      align-items: center;
      display: flex;
      flex-direction: column;
      background-color: #000000a0;
    }

    .invalid-input-label {
      color: red;
      font-size: smaller;
      margin-top: 0;
      text-align: left;
      width: 100%;
    }

    button {
      background-color: white;
      width: 50%;
    }
  }

  label {
    color: white;
  }

  a {
    color: red;
  }

  a:hover {
    color: white;
  }

  .registration-p {
    color: white;
  }
</style>
