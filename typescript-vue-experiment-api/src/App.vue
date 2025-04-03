<script setup lang="ts">
import { ACTIONS } from "@/const";
import { sendMessage } from "@/utils";

async function writeFile() {
  const status = await sendMessage({
    action: ACTIONS.WRITE,
    payload: {
      filename: "test123.txt",
      contents: `hello this is the timestamp: ${new Date().getTime()}`,
    },
  });
  console.log(`[writeFile] wrote ${status} bytes`);
}
async function readFile() {
  const contents = await sendMessage({ action: ACTIONS.READ });
  console.log(`[readFile] read contents: ${contents}`);
}
</script>

<template>
  <button @click="writeFile">write file</button>
  <button @click="readFile">read files</button>
</template>
