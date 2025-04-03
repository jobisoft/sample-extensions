/// <reference types="thunderbird-webext-browser" />

import { ACTIONS } from "@/const";

async function handleRequest(request: Record<string, any>) {
  console.log(request);
  if (request.action === ACTIONS.WRITE) {
    // @ts-ignore
    const status = await browser.FileSystem.writeFile(
      request.payload.filename,
      request.payload.contents,
    );
    return status;
  }
  if (request.action === ACTIONS.READ) {
    // @ts-ignore
    const contents = await browser.FileSystem.readFile("test123.txt");
    return contents;
  }

  return null;
}

async function createPopup(url: string) {
  const popup = await browser.windows.create({
    url,
    type: "popup",
    allowScriptsToClose: true,
  });

  return popup.id!;
}

async function main() {
  console.clear();
  messenger.runtime.onMessage.addListener(handleRequest);
  createPopup("index.html");
}

main();
