// Our ActivityManager API loads a module, which needs a resource:// url. This
// example is using the LegacyHelper API to register it.
await browser.LegacyHelper.registerGlobalUrls([
  ["resource", "exampleaddon1234", "modules/"],
]);

await browser.ActivityManager.registerWindowListener();

// We defined this event in our schema.
browser.ActivityManager.onCommand.addListener(async function (x, y) {
  browser.notifications.create({
    "type": "basic",
    "title": "Restart",
    "message": `The "Clear List" button of the Activity Manager was clicked at (${x},${y}).`
  })
});
