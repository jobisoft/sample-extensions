browser.browserAction.disable();

browser.mailTabs.onSelectedMessagesChanged.addListener(async (tab, messageList) => {
  let messageCount = messageList.messages.length;
  if (messageCount == 1) {
    browser.browserAction.enable(tab.id);
  } else {
    browser.browserAction.disable(tab.id);
  }
});

browser.menus.create({
  id: "sender",
  title: "Sender",
  contexts: ["message_list"],
  async onclick(info) {
    let message = info.selectedMessages.messages[0];
    await browser.mailTabs.setQuickFilter({
      text: {
        text: message.author,
        author: true,
      },
    });
  },
});
browser.menus.create({
  id: "recipients",
  title: "Recipients",
  contexts: ["message_list"],
  async onclick(info) {
    let message = info.selectedMessages.messages[0];
    await browser.mailTabs.setQuickFilter({
      text: {
        text: message.recipients.join(", "),
        recipients: true,
      },
    });
  },
});
browser.menus.create({
  id: "subject",
  title: "Subject",
  contexts: ["message_list"],
  async onclick(info) {
    let message = info.selectedMessages.messages[0];
    await browser.mailTabs.setQuickFilter({
      text: {
        text: message.subject,
        subject: true,
      },
    });
  },
});

browser.menus.onShown.addListener((info) => {
  let oneMessage = info.selectedMessages && info.selectedMessages.messages.length == 1;
  browser.menus.update("sender", { visible: oneMessage });
  browser.menus.update("recipients", { visible: oneMessage });
  browser.menus.update("subject", { visible: oneMessage });
  browser.menus.refresh();
});
