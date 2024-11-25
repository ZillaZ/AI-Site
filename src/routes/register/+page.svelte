<script lang="ts">
  import { goto } from "$app/navigation";
  import Navbar from "$lib/Components/Navbar.svelte";
  import type { UserInfo } from "$lib/types";
  let name = $state("")
  let email = $state("")
  let password = $state("")
  let confirm_password = $state("")
  let name_is_valid = $derived(name.trim().length > 5)
  let email_is_valid = $derived(email.trim().length > 5)
  let password_is_valid = $derived(password.trim().length >= 8)
  let confirm_password_is_valid = $derived(password == confirm_password)
  let clickable = $derived(email_is_valid && password_is_valid && name_is_valid && confirm_password_is_valid)
  async function register() {
    if (!clickable) {
      return;
    }
    const response = await fetch("http://192.168.1.8:8080/register", {
      method: "POST",
      body: name + "\n" + email + "\n" + password,
    });
    if (response.ok) {
      let buf = await response.body?.getReader().read()!;
      const dec = new TextDecoder("utf-8");
      const data = dec.decode(buf.value);
      const user_info : UserInfo = JSON.parse(data)
      document.cookie = "Token=" + user_info.token;
      localStorage.setItem("user", JSON.stringify(user_info))
      goto("/chats")
    }
  }
</script>

<Navbar />
<div class="content-wrapper">
    <div class="register-div">
        <div class="fields-div">
            <label for="name">Name</label>
            <input bind:value={name} name="name" type="text"/>
            <p>{name_is_valid ? "" : "Invalid username"}</p>
            <label for="email">Email</label>
            <input bind:value={email} name="email" type="email"/>
            <p>{email_is_valid ? "" : "Invalid password"}</p>
            <label for="password">Password</label>
            <input bind:value={password} name="password" type="password"/>
            <p>{password_is_valid ? "" : "Invalid Password"}</p>
            <label for="confirm-password">Confirm Password</label>
            <input bind:value={confirm_password} name="confirm-password" type="password"/>
            <p>{confirm_password_is_valid ? "" : "Passwords do not match"}</p>
        </div>
        <div class="buttons-div">
            <button class="register-button" onclick={register} disabled={!clickable}>Registrar</button>
        </div>
    </div>
</div>

<style>
    p {
        color: red;
        font-size: smaller;
        margin-bottom: 2%;
    }
    label {
        color: white;
    }

    .buttons-div {
        margin: 5% auto 0;
        width: 50%;
        display: flex;
        justify-content: center;
    }

    .register-button {
        color: black;
        width: 50%;
        background-color: white;
        border-radius: 15px;
        padding: 2%;
    }

    .fields-div {
        width: 50%;
        display: flex;
        flex-direction: column;
        margin: auto;
    }

    .content-wrapper {
        height: 90%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #101010;
    }

    .register-div {
        width: 50%;
        padding: 5% 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: #131313;
        border-radius: 15px;
    }
</style>
