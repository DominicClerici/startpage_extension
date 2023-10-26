const newUserRoutine = () => {
  const startSetup = () => {
    container.classList.add("transitioning")

    setTimeout(() => {
      clearChildren(container)
      let skipBtn = document.createElement("button")
      skipBtn.className = "underlineButton"
      skipBtn.id = "skipBtn"
      skipBtn.innerText = "Skip setup and use default settings"
      skipBtn.addEventListener("click", () => {
        finishSetup(container, skipBtn, true)
      })
      root.appendChild(skipBtn)
      userNameStep(container).then(() => {
        container.classList.add("transitioning")
        setTimeout(() => {
          clearChildren(container)
          weatherStep(container).then(() => {
            container.classList.add("transitioning")
            setTimeout(() => {
              clearChildren(container)
              historyStep(container).then(() => {
                container.classList.add("transitioning")
                setTimeout(() => {
                  finishSetup(container, skipBtn, false)
                }, 600)
              })
            }, 600)
          })
        }, 600)
      })
    }, 600)
  }

  console.log("new user detected")

  const root = document.body
  root.classList.add("autoDarkMode", "midnightBlue")

  let container = document.createElement("div")
  container.id = "newUserFormCont"

  let label = document.createElement("h1")
  label.innerText = "Welcome to Start.js"
  label.className = "specialAnim1"

  let beginButton = document.createElement("button")
  beginButton.innerText = "Begin setup"
  beginButton.className = "solidButton specialAnim2"
  beginButton.addEventListener("click", startSetup)

  let skipSetup = document.createElement("button")
  skipSetup.innerText = "Skip and use default settings"
  skipSetup.className = "secondButton topSpace specialAnim2"
  skipSetup.addEventListener("click", () => {
    finishSetup(container, undefined, true)
  })

  container.appendChild(label)
  container.appendChild(beginButton)
  container.appendChild(skipSetup)
  root.appendChild(container)
}

const userNameStep = (root) => {
  return new Promise((resolve, reject) => {
    let label = document.createElement("h1")
    label.innerText = "What should I call you?"

    let nameInput = document.createElement("input")
    nameInput.addEventListener("input", (e) => {
      if (e.target.value.trim() !== "") {
        document.getElementById("nextButton").classList.add("active")
      } else {
        document.getElementById("nextButton").classList.remove("active")
      }
    })
    nameInput.type = "text"
    nameInput.spellcheck = false
    nameInput.autocomplete = false
    nameInput.autocorrect = false
    nameInput.id = "userNameInput"

    let submitBtn = document.createElement("button")
    submitBtn.className = "solidButton"
    submitBtn.id = "nextButton"
    submitBtn.innerHTML = `<p>Next</p> <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"> <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M1 5h12m0 0L9 1m4 4L9 9"/> </svg>`
    submitBtn.addEventListener("click", () => {
      let name = document.getElementById("userNameInput").value
      saveSetting("nickname", name).then(() => {
        createGreeting(name)
        resolve()
      })
    })
    root.classList.remove("transitioning")
    root.appendChild(label)
    root.appendChild(nameInput)
    root.appendChild(submitBtn)
  })
}

const weatherStep = (root) => {
  // ? dependency functions

  const setLocation = (pos) => {
    return new Promise((resolve, reject) => {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
      )
        .then((res) => {
          if (res.ok) {
            return res.json()
          } else {
            return res
          }
        })
        .then((data) => {
          if (data === 1) {
            resolve("idk why i have to do the errors like this")
          } else {
            console.log(data)
            const obj = {
              latCoord: pos.coords.latitude,
              lonCoord: pos.coords.longitude,
              city: data.address.city ? data.address.city : data.address.town,
              state: data.address.state,
            }
            saveSetting("locationInfo", obj)
              .then(() => {
                resolve(`${obj.city}, ${obj.state}`)
              })
              .catch((error) => {
                console.log(error)
                resolve("idk why i have to do the errors like this")
              })
          }
        })
    })
  }

  const requestLocation = (e) => {
    e.target.innerText = "Loading..."
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (res) => {
          setLocation(res).then((locationString) => {
            if (!(locationString === "idk why i have to do the errors like this")) {
              document.getElementById("nextButton").classList.add("active")
              document.getElementById("currentSelectedLocation").innerText = locationString
              document.getElementById("GPSButton").innerText = "Success"
              document.getElementById("GPSButton").classList.add("disabled")
            } else {
              document.getElementById("GPSButton").innerText = "Not supported"
              document.getElementById("GPSButton").classList.add("disabled")
            }
          })
        },
        () => {
          console.log("running err")
          document.getElementById("GPSButton").innerText = "Rejected permission"
          document.getElementById("GPSButton").classList.add("disabled")
        }
      )
    } else {
      document.getElementById("GPSButton").innerText = "Not supported"
      document.getElementById("GPSButton").classList.add("disabled")
    }
  }

  const doneTyping = (q) => {
    if (q.length > 4) {
      let loading = document.createElement("p")
      loading.className = "LoadingText"
      loading.innerText = "Loading..."
      document.getElementById("locationResults").appendChild(loading)
      fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json`)
        .then((res) => {
          if (res.ok) {
            return res.json()
          } else {
            return 1
          }
        })
        .then((data) => {
          if (data === 1) {
            // !make some kind of error here
          } else {
            let locSuggestions = data.map((e) => {
              return {
                name: e.display_name,
                lat: e.lat,
                lon: e.lon,
              }
            })
            console.log(locSuggestions)
            createLocSuggestions(locSuggestions)
          }
        })
    }
  }

  const createLocSuggestions = (suggestions) => {
    const root = document.getElementById("locationResults")
    clearChildren(root)
    const frag = document.createDocumentFragment()
    for (let i = 0; i < Math.min(2, suggestions.length); i++) {
      let item = document.createElement("li")
      item.innerText = suggestions[i].name
      item.addEventListener("click", () => {
        setLocation({
          coords: {
            latitude: suggestions[i].lat,
            longitude: suggestions[i].lon,
          },
        }).then((locationString) => {
          if (!(locationString === "idk why i have to do the errors like this")) {
            document.getElementById("nextButton").classList.add("active")
            document.getElementById("currentSelectedLocation").innerText = locationString
            document.getElementById("GPSButton").innerText = "Use GPS"
            document.getElementById("GPSButton").classList.remove("disabled")
          } else {
            document.getElementById("GPSButton").innerText = "Use GPS"
            document.getElementById("GPSButton").classList.remove("disabled")
          }
        })
      })
      frag.appendChild(item)
    }
    root.appendChild(frag)
  }

  // ? main

  return new Promise((resolve, reject) => {
    let label = document.createElement("h1")
    label.innerHTML =
      "Where are you located? <br /> <span>Your location is used to display accurate weather information.</span>"

    let horizontal = document.createElement("span")
    horizontal.className = "row"

    let autoLocateInput = document.createElement("button")
    autoLocateInput.className = "solidButton canBeDisabled"
    autoLocateInput.id = "GPSButton"
    autoLocateInput.innerText = "Use GPS"
    autoLocateInput.addEventListener("click", requestLocation)

    let orDivider = document.createElement("p")
    orDivider.className = "orDiv"
    orDivider.innerText = "or"

    let inputCont = document.createElement("div")
    inputCont.className = "inputWLabel"

    let manualInputLabel = document.createElement("p")
    manualInputLabel.innerText = "Enter manually"

    let locationSuggestions = document.createElement("ul")
    locationSuggestions.id = "locationResults"

    let manualInput = document.createElement("input")
    manualInput.type = "text"
    let timer
    const interval = 500
    manualInput.addEventListener("keyup", (e) => {
      if (e.target.value.trim().length < 2) {
        clearChildren(document.getElementById("locationResults"))
      }
      clearTimeout(timer)
      timer = setTimeout(() => {
        doneTyping(e.target.value.trim())
      }, interval)
    })

    let skipCont = document.createElement("span")
    skipCont.className = "multipleOptions"

    let currentlySelected = document.createElement("p")
    currentlySelected.id = "currentSelectedLocation"

    let skipSetting = document.createElement("button")
    skipSetting.className = "secondButton"
    skipSetting.innerText = "Setup later"
    skipSetting.addEventListener("click", () => {
      resolve()
    })

    let submitBtn = document.createElement("button")
    submitBtn.className = "solidButton"
    submitBtn.id = "nextButton"
    submitBtn.innerHTML = `<p>Next</p> <svg width="33" height="24" viewBox="0 0 33 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M2 10.5C1.17157 10.5 0.5 11.1716 0.5 12C0.5 12.8284 1.17157 13.5 2 13.5V10.5ZM32.5607 13.0607C33.1464 12.4749 33.1464 11.5251 32.5607 10.9393L23.0147 1.3934C22.4289 0.807612 21.4792 0.807612 20.8934 1.3934C20.3076 1.97918 20.3076 2.92893 20.8934 3.51472L29.3787 12L20.8934 20.4853C20.3076 21.0711 20.3076 22.0208 20.8934 22.6066C21.4792 23.1924 22.4289 23.1924 23.0147 22.6066L32.5607 13.0607ZM2 13.5H31.5V10.5H2V13.5Z" /> </svg>`
    submitBtn.addEventListener("click", () => {
      resolve()
    })

    skipCont.appendChild(skipSetting)
    skipCont.appendChild(submitBtn)
    skipCont.appendChild(currentlySelected)

    horizontal.appendChild(autoLocateInput)
    horizontal.appendChild(orDivider)
    inputCont.appendChild(manualInputLabel)
    inputCont.appendChild(manualInput)
    inputCont.appendChild(locationSuggestions)
    horizontal.appendChild(inputCont)

    root.classList.remove("transitioning")
    root.appendChild(label)
    root.appendChild(horizontal)
    root.appendChild(skipCont)
  })
}

const historyStep = (root) => {
  return new Promise((resolve, reject) => {
    let label = document.createElement("h1")
    label.innerHTML =
      "Enable dynamic suggestions? <br /> <span>See the websites you use when you use them.</span> <br /> <span>Permission to access history is needed.</span>"

    let grantButton = document.createElement("button")
    grantButton.innerText = "Grant permission"
    grantButton.className = "solidButton canBeDisabled"
    grantButton.id = "historyPermReqBtn"
    grantButton.addEventListener("click", () => {
      chrome.permissions.request(
        {
          permissions: ["history"],
        },
        (granted) => {
          const btn = document.getElementById("historyPermReqBtn")
          if (granted) {
            // request approved
            document.getElementById("nextButton").classList.add("active")
            btn.innerText = "Success"
            btn.classList.add("disabled")
          } else {
            // request was not approved
            btn.innerText = "Request rejected"
          }
        }
      )
    })

    let skipCont = document.createElement("span")
    skipCont.className = "multipleOptions"

    let skipSetting = document.createElement("button")
    skipSetting.className = "secondButton"
    skipSetting.innerText = "Setup later"
    skipSetting.addEventListener("click", () => {
      resolve()
    })

    let submitBtn = document.createElement("button")
    submitBtn.className = "solidButton"
    submitBtn.id = "nextButton"
    submitBtn.innerHTML = `<p>Finish</p> <svg width="33" height="24" viewBox="0 0 33 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M2 10.5C1.17157 10.5 0.5 11.1716 0.5 12C0.5 12.8284 1.17157 13.5 2 13.5V10.5ZM32.5607 13.0607C33.1464 12.4749 33.1464 11.5251 32.5607 10.9393L23.0147 1.3934C22.4289 0.807612 21.4792 0.807612 20.8934 1.3934C20.3076 1.97918 20.3076 2.92893 20.8934 3.51472L29.3787 12L20.8934 20.4853C20.3076 21.0711 20.3076 22.0208 20.8934 22.6066C21.4792 23.1924 22.4289 23.1924 23.0147 22.6066L32.5607 13.0607ZM2 13.5H31.5V10.5H2V13.5Z" /> </svg>`
    submitBtn.addEventListener("click", () => {
      resolve()
    })

    root.classList.remove("transitioning")
    skipCont.appendChild(skipSetting)
    skipCont.appendChild(submitBtn)
    root.appendChild(label)
    root.appendChild(grantButton)
    root.appendChild(skipCont)
  })
}

const finishSetup = (root, skipBtn, skipped) => {
  if (skipped) {
    saveSetting("nickname", "User")
    createGreeting("User")
  }
  saveSetting("autoDarkMode", true)
  saveSetting("darkMode", true)
  saveSetting("highContrast", false)
  saveSetting("darkModeScheme", "midnightBlue")
  saveSetting("lightModeScheme", "emerald")
  saveSetting("fahrenheit", true)
  initializeList()
  setColorScheme({
    darkMode: true,
    autoDarkMode: true,
    highContrast: false,
    darkModeScheme: "midnightBlue",
    lightModeScheme: "emerald",
  })
  checkHistoryPermission().then(() => {
    processHistory()
  })
  initializeReminders()
  initializeVisibleTimeFormat()
  root.style.opacity = 0
  setTimeout(() => {
    document.body.removeChild(root)
    if (skipBtn) {
      document.body.removeChild(skipBtn)
    }
  }, 1000)
}
