const addNewCategory = (data) => {
  let dataDupe = data
  const storage = chrome.storage.sync
  storage.get(["shortcuts"], (results) => {
    if (results.shortcuts) {
      data = [...results.shortcuts, data]
    } else {
      data = [data]
    }
    storage.set({ ["shortcuts"]: data }, () => {
      if (chrome.runtime.lastError) {
        // ! figure out a good way to create error mesages here
      } else {
        // ! use same message api to send success
        const newRow = createShortcutCategoryComponent(dataDupe)
        const root = document.getElementById("shortcutList")
        checkIfCanMakeMoreShortcuts()
        root.insertBefore(newRow, root.querySelector(".newRow.cat"))
      }
    })
  })
}

const addNewShortcut = (id) => {
  const storage = chrome.storage.sync
  storage.get(["shortcuts"], (results) => {
    let data = [...results.shortcuts]
    let ind = data.findIndex((e) => {
      return e.id == id
    })
    let newShortcutData = {
      title: "New Shortcut",
      url: "https://www.example.com/",
      id: generateUUID(),
    }
    data[ind].items = [...data[ind].items, newShortcutData]
    storage.set({ ["shortcuts"]: data }, () => {
      if (chrome.runtime.lastError) {
        console.log("error OOPSSIEE !!!")
        // ! figure out a good way to create error mesages here
      } else {
        let newShortcut = constructIndivShortcut(newShortcutData, id)
        const root = document.getElementById("shortcutsFor_" + id)
        root.insertBefore(newShortcut, root.querySelector(".newRow.iconButton"))
        // ! use same message api to send success
      }
    })
  })
}

const deleteShortcut = (id, catId) => {
  const storage = chrome.storage.sync
  storage.get(["shortcuts"], (results) => {
    let data = [...results.shortcuts]
    let ind = data.findIndex((e) => {
      return e.id == catId
    })
    let newItems = data[ind].items.filter((e) => {
      return e.id !== id
    })
    data[ind].items = newItems
    console.log(data)
    storage.set({ ["shortcuts"]: data }, () => {
      if (chrome.runtime.lastError) {
        console.log("erroe")
        // ! figure out a good way to create error mesages here
      } else {
        console.log("no erroe")
        const root = document.getElementById("shortcutsFor_" + catId)
        root.removeChild(document.getElementById("indivShortcut_" + id))
        // ! use same message api to send success
      }
    })
  })
}

// ! make it so that now it will update on the client

const changeCategoryName = (newText, id) => {
  const storage = chrome.storage.sync
  storage.get(["shortcuts"], (results) => {
    let data = [...results.shortcuts]
    let ind = data.findIndex((e) => {
      return e.id == id
    })
    data[ind].title = newText
    storage.set({ ["shortcuts"]: data }, () => {
      if (chrome.runtime.lastError) {
        // ! figure out a good way to create error mesages here
      } else {
        // ! use same message api to send success
      }
    })
  })
}

const deleteCategory = (id) => {
  const storage = chrome.storage.sync
  storage.get(["shortcuts"], (results) => {
    let data = [...results.shortcuts]
    let filtered = data.filter((e) => {
      return e.id !== id
    })
    storage.set({ ["shortcuts"]: filtered }, () => {
      if (chrome.runtime.lastError) {
        // ! figure out a good way to create error mesages here
      } else {
        const root = document.getElementById("shortcutList")
        checkIfCanMakeMoreShortcuts()
        root.removeChild(root.querySelector("#categoryCont_" + id))
        // ! use same message api to send success
      }
    })
  })
}

const saveEditShortcut = (id, catId) => {
  const storage = chrome.storage.sync
  let newTitle = document.getElementById("shortcutTitleInput_" + id).value
  let newUrl = document.getElementById("shortcutURLInput_" + id).value
  if (!newUrl.includes("https://", "http://")) {
    newUrl = new URL(`https://${newUrl}`)
  } else {
    newUrl = new URL(newUrl)
  }
  let newData = {
    title: newTitle,
    url: newUrl.href,
    id: id,
  }

  storage.get(["shortcuts"], (results) => {
    let data = [...results.shortcuts]
    let ind = data.findIndex((e) => {
      return e.id == catId
    })
    let shortcutInd = data[ind].items.findIndex((e) => {
      return e.id == id
    })
    data[ind].items[shortcutInd] = newData
    storage.set({ ["shortcuts"]: data }, () => {
      if (chrome.runtime.lastError) {
        console.log("error OOPSSIEE !!!")
        // ! figure out a good way to create error mesages here
      } else {
        let newShortcut = constructIndivShortcut(newData, catId)
        const root = document.getElementById("shortcutsFor_" + catId)
        root.replaceChild(newShortcut, document.getElementById("indivShortcut_" + id))
        // ! use same message api to send success
      }
    })
  })
}
