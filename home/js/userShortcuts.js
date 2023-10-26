// ? User shortcut functions

const createNoShortcutsInCategories = (tabRoot, windowRoot) => {
  let heading = document.createElement("h1")
  heading.innerText = "Shortcuts"
  heading.className = "noShortcutsInNav"

  createNoShortcuts(windowRoot)
  tabRoot.appendChild(heading)
}

const createNoShortcuts = (root) => {
  let windowCont = document.createElement("div")
  windowCont.className = "noShortcutsWindowCont"

  let describe = document.createElement("p")
  describe.innerText = "You haven't created any shortcuts"

  let goToOptionBtn = document.createElement("button")

  goToOptionBtn.innerText = "Create some"
  goToOptionBtn.className = "solidButton"
  goToOptionBtn.addEventListener("click", () => {
    window.location.href = chrome.runtime.getURL("options.html") + "#shortcutSection"
  })
  windowCont.appendChild(describe)
  windowCont.appendChild(goToOptionBtn)
  root.appendChild(windowCont)
}
// creates users custom shortcuts and adds to DOM
const initializeList = () => {
  const storage = chrome.storage.sync

  storage.get(["shortcuts"], (results) => {
    if (results.shortcuts) {
      let len = results.shortcuts.length
      if (len == 0) {
        createNoShortcutsInCategories(appendRootTabs, appendRootWindow)
      } else {
        while (len--) {
          // unreverse list b/c of using while loop
          let i = results.shortcuts.length - 1 - len

          let newTab = document.createElement("li")
          newTab.onclick = () => {
            switchUserShortcutTab(results.shortcuts[i].title)
          }
          newTab.id = `USER_${results.shortcuts[i].title}_tab`
          newTab.className = `customShortcutTab ${i == 0 ? "active" : ""}`
          // ! test later to see if using createElement makes a meaningful difference
          newTab.innerHTML = `<h3>${results.shortcuts[i].title}</h3>`

          tabFragment.appendChild(newTab)

          let newGroup = document.createElement("ul")
          newGroup.id = `USER_${results.shortcuts[i].title}`
          newGroup.className = `userShortcutList betterScrollBar shortcutList ${i == 0 ? "active" : ""}`
          let itemLen = results.shortcuts[i].items.length

          if (itemLen == 0) {
            newGroup.classList.add("empty")
            createNoShortcuts(newGroup)
          } else {
            while (itemLen--) {
              // unreverse list b/c of using while loop
              let i_item = results.shortcuts[i].items.length - 1 - itemLen

              let indivShortcut = document.createElement("a")
              indivShortcut.className = "link"
              indivShortcut.onclick = () => {
                console.log(results.shortcuts[i].items[i_item].url)
                chrome.tabs.update(undefined, { url: results.shortcuts[i].items[i_item].url })
              }
              let indivShortcutLI = document.createElement("li")
              // ! test later to see if using createElement makes a meaningful difference
              indivShortcutLI.innerHTML = `<img id="sc_img_${results.shortcuts[i].items[i_item].id}" src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${results.shortcuts[i].items[i_item].url}&size=32" /> <p>${results.shortcuts[i].items[i_item].title}</p>`
              // getFavicon(results.shortcuts[i].items[i_item].url, `sc_img_${results.shortcuts[i].items[i_item].id}`)
              indivShortcut.appendChild(indivShortcutLI)
              newGroup.appendChild(indivShortcut)
            }
          }
          windowFragment.appendChild(newGroup)
        }
        appendRootTabs.appendChild(tabFragment)
        appendRootWindow.appendChild(windowFragment)
      }
    } else {
      createNoShortcutsInCategories(appendRootTabs, appendRootWindow)
    }
  })

  //   create user created shortcuts and append to document

  const appendRootTabs = document.getElementById("userShortcutTabs")
  const appendRootWindow = document.getElementById("customLinkGroupContainer")
  // use document fragments to avoid repaints
  const tabFragment = document.createDocumentFragment()
  const windowFragment = document.createDocumentFragment()
}

// handler func for when user changes shortcut tabs
const switchUserShortcutTab = (switch_to) => {
  let tabs = document.getElementsByClassName("customShortcutTab")
  let windows = document.getElementsByClassName("userShortcutList")
  let len = tabs.length
  while (len--) {
    // unreverse list b/c of using while loop
    let i = tabs.length - 1 - len
    tabs[i].classList.remove("active")
    windows[i].classList.remove("active")
  }
  document.getElementById(`USER_${switch_to}`).classList.add("active")
  document.getElementById(`USER_${switch_to}_tab`).classList.add("active")
}
