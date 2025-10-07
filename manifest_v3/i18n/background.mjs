browser.action.onClicked.addListener(() => {
    browser.windows.create({
        type: "popup",
        url: "popup.html"
    })
})