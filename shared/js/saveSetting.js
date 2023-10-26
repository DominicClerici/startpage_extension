const storage = chrome.storage.sync

const saveSetting = (prop, value) => {
  if (typeof value == "object") {
    value = JSON.stringify(value)
  }
  return new Promise((res, rej) => {
    storage.set({ [prop]: value }, () => {
      if (chrome.runtime.lastError) {
        // ! error occured
        rej(chrome.runtime.lastError)
      } else {
        console.log(`Saved setting: ${prop} with value ${value}`)
        res()
      }
    })
  })
}
