const constructCategoryTopSection = (data) => {
  let rowCenter = document.createElement("span")
  rowCenter.className = "rowCenter"
  rowCenter.id = "categoryTitleRow_" + data.id
  rowCenter.addEventListener("click", (e) => {
    if (e.target.id == "categoryTitleRow_" + data.id) {
      document.getElementById("categoryCont_" + data.id).classList.toggle("open")
    }
  })

  let toggleOpen = document.createElement("button")
  toggleOpen.className = "iconButton toggleOpen"
  toggleOpen.innerHTML = `<svg id="shortcutCategoryToggle" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" > <polyline points="9 18 15 12 9 6"></polyline> </svg>`

  let categoryName = document.createElement("p")
  categoryName.innerText = data.title
  categoryName.className = "bolder"

  let modifyBtn = document.createElement("button")
  modifyBtn.className = "iconButton modifyBtn"
  // ! make this able to modify title
  modifyBtn.addEventListener("click", () => {
    startEditTitle(data.id, data.title)
  })
  modifyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" > <path d="M12 20h9"></path> <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path> </svg>`

  let deleteBtn = document.createElement("button")
  deleteBtn.className = "iconButton deleteBtn"
  deleteBtn.addEventListener("click", () => {
    deleteCategory(data.id)
  })
  deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" > <polyline points="3 6 5 6 21 6"></polyline> <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>`

  rowCenter.appendChild(toggleOpen)
  rowCenter.appendChild(categoryName)
  rowCenter.appendChild(modifyBtn)
  rowCenter.appendChild(deleteBtn)
  return rowCenter
}

const constructShortcutArea = (data) => {
  let container = document.createElement("ul")
  container.className = "shortcutIndivList"
  container.id = "shortcutsFor_" + data.id

  for (let i = 0; i < data.items.length; i++) {
    let shortcut = constructIndivShortcut(data.items[i], data.id)
    container.appendChild(shortcut)
  }

  let newCategoryButton = document.createElement("button")
  newCategoryButton.className = "newRow iconButton"
  newCategoryButton.addEventListener("click", () => {
    addNewShortcut(data.id)
  })
  newCategoryButton.innerHTML = `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="47.5" y="2.5" width="5" height="95" rx="2.5" stroke-width="5" /> <rect x="2.5" y="52.5" width="5" height="95" rx="2.5" transform="rotate(-90 2.5 52.5)" stroke-width="5" /> </svg> <p>New shortcut</p>`
  container.appendChild(newCategoryButton)

  return container
}

const constructIndivShortcut = (data, catId) => {
  let cont = document.createElement("li")
  cont.className = "indivShortcut"
  cont.id = "indivShortcut_" + data.id
  let shortcutTitle = document.createElement("p")
  shortcutTitle.className = "sc_title"
  shortcutTitle.innerText = data.title
  let shortcutHost = document.createElement("p")
  shortcutHost.className = "sc_url"
  shortcutHost.innerHTML = fancyUrl(data.url)
  let editButton = document.createElement("button")
  editButton.innerHTML = `<svg class="shortcutSvg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" > <path d="M12 20h9"></path> <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path> </svg>`
  editButton.className = "iconButton"
  editButton.addEventListener("click", () => {
    startEditShortcut({
      ...data,
      catId,
    })
  })
  let delButton = document.createElement("button")
  delButton.innerHTML = `<svg class="shortcutSvg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" > <polyline points="3 6 5 6 21 6"></polyline> <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>`
  delButton.className = "iconButton"
  delButton.addEventListener("click", () => {
    deleteShortcut(data.id, catId)
  })
  cont.appendChild(shortcutTitle)
  cont.appendChild(shortcutHost)
  cont.appendChild(editButton)
  cont.appendChild(delButton)
  return cont
}

const startEditShortcut = (data) => {
  // data is {title, url, id, catId}
  console.log(data)
  const root = document.getElementById("indivShortcut_" + data.id)
  while (root.firstChild) {
    root.removeChild(root.lastChild)
  }
  let editContainer = document.createElement("div")
  editContainer.className = "editingShortcutCont"
  let titleLabel = document.createElement("p")
  titleLabel.innerText = "Title"
  let urlLabel = document.createElement("p")
  urlLabel.innerText = "URL"
  let titleInput = document.createElement("input")
  titleInput.type = "text"
  titleInput.value = data.title
  titleInput.id = `shortcutTitleInput_${data.id}`
  let urlInput = document.createElement("input")
  urlInput.value = data.url
  urlInput.type = "text"
  urlInput.id = `shortcutURLInput_${data.id}`
  let saveBtn = document.createElement("button")
  saveBtn.addEventListener("click", () => {
    saveEditShortcut(data.id, data.catId)
  })
  saveBtn.className = "iconButton saveBtn"
  saveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" > <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path> <polyline points="17 21 17 13 7 13 7 21"></polyline> <polyline points="7 3 7 8 15 8"></polyline> </svg>`
  let exitBtn = document.createElement("button")
  exitBtn.addEventListener("click", () => {
    cancelEditShortcut(data)
  })
  exitBtn.className = "iconButton exitBtn"
  exitBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
  let leftCol = document.createElement("span")
  let rightCol = document.createElement("span")
  leftCol.className = "col"
  rightCol.className = "col"
  leftCol.appendChild(titleLabel)
  leftCol.appendChild(titleInput)
  leftCol.appendChild(urlLabel)
  leftCol.appendChild(urlInput)
  editContainer.appendChild(leftCol)
  rightCol.appendChild(saveBtn)
  rightCol.appendChild(exitBtn)
  editContainer.appendChild(rightCol)
  root.appendChild(editContainer)
}

const cancelEditShortcut = (data) => {
  // data is {title, url, id, catId}
  let originalShortcut = constructIndivShortcut(data, data.catId)
  const root = document.getElementById("shortcutsFor_" + data.catId)
  root.replaceChild(originalShortcut, document.getElementById("indivShortcut_" + data.id))
}

const createShortcutCategoryComponent = (data) => {
  let categoryCont = document.createElement("li")
  categoryCont.className = "categoryItem"
  categoryCont.id = "categoryCont_" + data.id

  let rowCenter = constructCategoryTopSection(data)

  let shortCutCont = constructShortcutArea(data)

  categoryCont.appendChild(rowCenter)
  categoryCont.appendChild(shortCutCont)
  return categoryCont
}

const createShortcutMenu = () => {
  const root = document.getElementById("shortcutList")
  while (root.firstChild) {
    root.removeChild(root.lastChild)
  }

  const storage = chrome.storage.sync

  storage.get(["shortcuts"], (results) => {
    let frag = document.createDocumentFragment()
    if (results.shortcuts) {
      console.log(results.shortcuts)
      for (let i = 0; i < results.shortcuts.length; i++) {
        let categoryComp = createShortcutCategoryComponent(results.shortcuts[i])

        // ? add ability to reorder later
        // <button class="iconButton" id="reOrder">
        //       <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        //         <rect x="2.5" y="2.5" width="75" height="5" rx="2.5" stroke-width="5" />
        //         <rect x="2.5" y="37.5" width="75" height="5" rx="2.5" stroke-width="5" />
        //         <rect x="2.5" y="72.5" width="75" height="5" rx="2.5" stroke-width="5" />
        //       </svg>
        //     </button>

        frag.appendChild(categoryComp)
      }
    } else {
      let noShortcutsTitle = document.createElement("h4")
      noShortcutsTitle.innerText = "You havent created any shortcuts yet"
      noShortcutsTitle.className = "noShortcuts"
      frag.appendChild(noShortcutsTitle)
    }
    checkIfCanMakeMoreShortcuts()
    root.appendChild(frag)
  })
}

// ! handles saving of title for category
const startEditTitle = (id, currentText) => {
  const root = document.getElementById("categoryTitleRow_" + id)
  root.removeChild(root.querySelector(".bolder"))
  root.removeChild(root.querySelector(".modifyBtn"))
  let frag = document.createDocumentFragment()
  let editInput = document.createElement("input")
  editInput.id = "editTitleInput_" + id
  editInput.value = currentText
  editInput.type = "text"
  let saveBtn = document.createElement("button")
  saveBtn.addEventListener("click", () => {
    saveEditTitle(id)
  })
  saveBtn.className = "iconButton saveBtn"
  saveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" > <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path> <polyline points="17 21 17 13 7 13 7 21"></polyline> <polyline points="7 3 7 8 15 8"></polyline> </svg>`
  frag.appendChild(editInput)
  frag.appendChild(saveBtn)
  root.insertBefore(frag, root.childNodes[1])
}

const saveEditTitle = (id) => {
  let newText = document.getElementById("editTitleInput_" + id).value
  changeCategoryName(newText, id)
  const root = document.getElementById("categoryTitleRow_" + id)
  root.removeChild(root.querySelector("input[type='text']"))
  root.removeChild(root.querySelector(".saveBtn"))
  let frag = document.createDocumentFragment()
  let categoryName = document.createElement("p")
  categoryName.innerText = newText
  categoryName.className = "bolder"
  let modifyBtn = document.createElement("button")
  modifyBtn.className = "iconButton modifyBtn"
  // ! make this able to modify title
  modifyBtn.addEventListener("click", () => {
    startEditTitle(id, newText)
  })
  modifyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" > <path d="M12 20h9"></path> <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path> </svg>`
  frag.appendChild(categoryName)
  frag.appendChild(modifyBtn)
  root.insertBefore(frag, root.childNodes[1])
}

const checkIfCanMakeMoreShortcuts = () => {
  const storage = chrome.storage.sync
  const root = document.getElementById("shortcutList")

  storage.get(["shortcuts"], (results) => {
    if (!(results.shortcuts && results.shortcuts.length >= 6) && !document.getElementById("createNewCategoryButton")) {
      let newCategoryButton = document.createElement("button")
      newCategoryButton.className = "newRow iconButton cat"
      newCategoryButton.id = "createNewCategoryButton"
      newCategoryButton.addEventListener("click", () => {
        addNewCategory({
          title: "New Category",
          id: generateUUID(),
          items: [],
        })
      })
      newCategoryButton.innerHTML = `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="47.5" y="2.5" width="5" height="95" rx="2.5" stroke-width="5" /> <rect x="2.5" y="52.5" width="5" height="95" rx="2.5" transform="rotate(-90 2.5 52.5)" stroke-width="5" /> </svg> <p>New category</p>`
      root.appendChild(newCategoryButton)
    } else if (
      document.getElementById("createNewCategoryButton") &&
      results.shortcuts &&
      results.shortcuts.length >= 6
    ) {
      root.removeChild(document.getElementById("createNewCategoryButton"))
    }
  })
}
