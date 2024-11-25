<script lang="ts">
  import { goto } from "$app/navigation";
  import Navbar from "$lib/Components/Navbar.svelte";
  import type { UserInfo } from "$lib/types";
  import { user_info as user_info_store } from "$lib/stores";
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

    if (response.ok) {
      document.cookie = response.headers.get("Cookie")!;
      let buf = await response.body?.getReader().read()!
      let dec = new TextDecoder("utf-8")
      const data = dec.decode(buf.value)
      const user_info : UserInfo = JSON.parse(data)
      user_info_store.set(user_info)
      localStorage.setItem("user", JSON.stringify(user_info))
      goto("/chats");
    }
  }
  
  let email_is_valid = $derived(email.trim().length > 1);
  let password_is_valid = $derived(password.trim().length > 7);
  let is_password_valid_field = $derived(password_is_valid ? " " : "Invalid Password")
  let is_email_valid_field = $derived(email_is_valid ? "   " : "Invalid Email")
</script>

<Navbar/>
<div class="content-wrapper">
  <div class="login-div">
    <div class="fields-div">
      <label for="email">Email</label>
      <input minlength="1" name="email" bind:value={email} type="email" />
      <p class="invalid-input-label">{is_email_valid_field}</p>
      <label for="password">Password</label>
      <input minlength="8" name="password" bind:value={password} type="password" />
      <p class="invalid-input-label">{is_password_valid_field}</p>
    </div>
    <div class="button-div">
      <button onclick={async () => await request()}>Login</button>
    </div>
    <p class="registration-p">Não tem uma conta? <a href="/register">Registre-se</a></p>
  </div>
</div>

<style>
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
  
  .fields-div {
    display: flex;
    flex-direction: column;
    width: 50%;
  }

  .login-div {
    width: 50%;
    height: 50%;
    margin: auto;
    background-color: #131313;
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
    background-color: #101010;
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
</style>
