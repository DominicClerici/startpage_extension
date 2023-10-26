const initializeEventListeners = () => {
  // nickname
  document.getElementById("nickname").addEventListener("input", (e) => {
    saveSetting("nickname", e.target.value.trim())
  })

  // dynamic recommendations
  document.getElementById("historyPerm").addEventListener("change", (e) => {
    if (e.target.checked) {
      requestHistoryPermission().catch(() => {
        e.target.checked = false
      })
    } else {
      chrome.permissions.remove(
        {
          permissions: ["history"],
        },
        (removed) => {
          if (removed) {
            // the permissions have been removed
            e.target.checked = false
          } else {
            // the permissions were not removed
            e.target.checked = true
          }
        }
      )
    }
  })

  // weather
  document.getElementById("useGeolocation").addEventListener("click", () => {
    document.getElementById("location").value = "Loading..."
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (e) => {
          setLocation(e).then((locString) => {
            document.getElementById("location").value = locString
          })
        },
        () => {
          document.getElementById("location").value = "Error"
        }
      )
    } else {
      document.getElementById("location").value = "Error"
    }
  })

  let timer
  const interval = 1500
  document.getElementById("location").addEventListener("keyup", (e) => {
    if (e.target.value.trim().length < 2) {
      clearChildren(document.getElementById("locationResults"))
    }
    clearTimeout(timer)
    timer = setTimeout(() => {
      doneTyping(e.target.value.trim())
    }, interval)
  })

  // fareheit
  document.getElementById("fahrenheit").addEventListener("change", (e) => {
    saveSetting("fahrenheit", e.target.checked)
  })

  // dark and autodarkmode
  document.getElementById("darkMode").addEventListener("change", (e) => {
    saveSetting("darkMode", e.target.checked)
  })
  document.getElementById("autoDarkMode").addEventListener("change", (e) => {
    saveSetting("autoDarkMode", e.target.checked)
  })
  document.getElementById("highContrast").addEventListener("change", (e) => {
    if (e.target.checked) {
      document.body.classList.add("highContrast")
    } else {
      document.body.classList.remove("highContrast")
    }
    saveSetting("highContrast", e.target.checked)
  })

  // reset button
  document.getElementById("resetButton").addEventListener("click", () => {
    chrome.storage.sync.clear().then(() => {
      document.getElementById("resetButton").innerText = "Resetting..."
      setTimeout(() => {
        chrome.tabs.update({ url: "chrome://newtab" })
      }, 1000)
    })
  })

  // back button
  document.getElementById("goBack").addEventListener("click", () => {
    chrome.tabs.update({ url: "chrome://newtab" })
  })

  // color modes
  let tiles = document.getElementsByClassName("colorSchemeTile")
  let len = tiles.length
  while (len--) {
    let [colorMode, id] = [tiles[len].getAttribute("colorMode"), tiles[len].id]
    tiles[len].addEventListener("click", (e) => {
      saveSetting(colorMode == "dark" ? "darkModeScheme" : "lightModeScheme", id, () => {
        let els = document.getElementsByClassName("colorSchemeTile")
        let len_els = els.length
        while (len_els--) {
          els[len_els].classList.remove("active")
        }
      }).then(() => {
        updateTiles(id, tiles, colorMode)
      })
    })
  }
}

// for tiles
const updateTiles = (id, tiles, colorMode) => {
  let len = tiles.length
  while (len--) {
    if (tiles[len].getAttribute("colorMode") == colorMode) {
      tiles[len].classList.remove("active")
    }
  }
  document.getElementById(id).classList.add("active")
  if (colorMode == "dark") {
    document.getElementById("currentDarkScheme").innerText = beautifyString(id)
  } else {
    document.getElementById("currentLightScheme").innerText = beautifyString(id)
  }
  document.body.classList.remove(
    "midnightBlue",
    "concrete",
    "amethyst",
    "emerald",
    "monoDark",
    "ice",
    "cloud",
    "rosewater",
    "spring",
    "monoLight"
  )
  document.body.classList.add(id)
}

// for weather
const createLocSuggestions = (suggestions) => {
  let len = suggestions.length
  let frag = document.createDocumentFragment()
  const suggestionList = document.getElementById("locationResults")
  while (len--) {
    let i = suggestions.length - len - 1
    let item = document.createElement("li")
    item.innerText = suggestions[i].name
    item.style.fontSize = "1.8rem"
    item.addEventListener("click", () => {
      setLocation({
        coords: {
          latitude: suggestions[i].lat,
          longitude: suggestions[i].lon,
        },
      }).then((locString) => {
        clearChildren(suggestionList)
        document.getElementById("location").value = locString
      })
    })
    frag.appendChild(item)
  }
  clearChildren(suggestionList)
  suggestionList.appendChild(frag)
}
