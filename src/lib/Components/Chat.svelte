<script lang="ts">
  import { PUBLIC_API_ENDPOINT } from "$env/static/public";
  import Messages from "./Messages.svelte";
  import {
    chat_id as chat_id_store,
    messages as messages_store,
  } from "$lib/stores";
  import { type ClientMessage, type Message } from "$lib/types";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import SvgClip from "./SvgClip.svelte";
  import PlayButton from "./PlayButton.svelte";
  import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
  import type { TextItem } from "pdfjs-dist/types/src/display/api";
  import { websocket } from "$lib/websocket";

  let chat_id: string = $state("");
  chat_id_store.subscribe((e) => (chat_id = e));
  let messages: Message[] = $state([]);
  messages_store.subscribe((e) => (messages = e));
  let text_message: string = $state("");
  let token: string = "";
  onMount(async () => {
    console.log(document.cookie);
    const cookies = document.cookie.split(";");
    token = cookies
      .filter((e) => e.split("=")[0].trim() == "Token")
      .map((e) => e.split("=")[1].trim())[0];
    console.log(token);
    if (!token) {
      goto("/login");
    }
  });

  async function send_message() {
    if (text_message.trim().length < 1 || chat_id === "") {
      return;
    }

    messages.push({
      id: "",
      created_at: Math.round(new Date().getTime() / 1000),
      message: {
        role: "user",
        content: text_message,
      },
    });
    messages_store.set(messages);
    const request : ClientMessage = {
      kind: "new_message",
      body: {
        new_message: {
          token,
          chat_id: chat_id,
          content: text_message
        }
      }
    }
    console.log(JSON.stringify(request))
    websocket.send(JSON.stringify(request))
    text_message = ""
  }

  function onkeydown(event: KeyboardEvent) {
    if (event.key != "Enter" || event.shiftKey) return;
    send_message();
  }
  GlobalWorkerOptions.workerSrc =
    "/home/lucas/Projects/assistant_site/node_modules/pdfjs-dist/build/pdf.worker.min.mjs";
  let input_element: HTMLInputElement;
  let flag = false;
  setInterval(() => {
    if (input_element && !flag) {
      flag = true;
      input_element.addEventListener("input", async () => {
        const file = input_element.files?.item(0)!;
        const buf = await file.arrayBuffer()!;
        if (file.name.endsWith("pdf")) {
          const data = getDocument({ data: buf });
          data.promise.then(async (data) => {
            for (let i = 1; i <= data.numPages; i++) {
              text_message += (
                await (await data.getPage(i)).getTextContent()
              ).items
                .map((e) => (e as TextItem).str)
                .join(" ");
            }
          });
        } else {
          const dec = new TextDecoder("utf-8");
          text_message += dec.decode(buf);
        }
      });
    }
  }, 1000);

  function upload_file() {
    input_element.click();
  }
</script>

<div class="messages-wrapper">
  <div class="messages">
    <Messages />
  </div>
  <div class="input-div">
    <input bind:this={input_element} style="display:none;" type="file" />
    <button class="upload-button" onclick={upload_file}><SvgClip /></button>
    <textarea
      placeholder="Escreva sua mensagem..."
      {onkeydown}
      bind:value={text_message}
    ></textarea>
    <button
      class="send-button"
      disabled={chat_id.trim().length < 1 || text_message.trim().length < 1}
      onclick={send_message}><PlayButton width={50}></PlayButton></button
    >
  </div>
</div>

<style>
  @media screen and (min-width: 600px) {
    .input-div {
      height: 10%;
      width: 80%;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #161616;
      border-radius: 5px;
    }

    .messages-wrapper {
      width: 70%;
      height: 100%;
      margin: 0 auto;
    }
  }

  @media screen and (max-width: 600px) {
    .input-div {
      height: 8%;
      width: 90%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #161616;
      border-radius: 5px;
      position: absolute;
      bottom: 2.5%;
      left: 5%;
    }

    .messages-wrapper {
      width: 100%;
      height: 80%;
      margin: 0 auto;
    }
  }

  .upload-button {
    margin-right: 10%;
  }

  .messages {
    height: 83%;
    margin-bottom: 4%;
  }

  textarea {
    margin-left: 1%;
    width: 70%;
    height: 100%;
    background-color: #161616;
    color: white;
    box-shadow: none;
    border: none;
    overflow: auto;
    outline: none;
    resize: none;
    padding: 1rem;
  }

  button {
    border-radius: 5px;
    width: 5vh;
    height: 5vh;
    background-color: #161616;
    color: white;
  }

  input {
    border-radius: 5px;
    width: 20%;
    height: 80%;
    background-color: #202020;
    box-shadow: -5px -5px black inset;
    color: white;
    border-style: solid;
    border-width: 1px;
    border-color: black;
  }

  button:disabled {
    color: gray;
  }
</style>
