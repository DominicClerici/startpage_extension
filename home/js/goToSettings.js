// ? event handler for settings button

const navigateToSettings = () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage()
  } else {
    window.open(chrome.runtime.getURL("options.html"))
  }
}
