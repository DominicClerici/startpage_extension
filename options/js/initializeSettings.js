const initializeSettings = () => {
  console.log("refreshing")
  const storage = chrome.storage.sync
  let props = [
    "darkModeScheme",
    "lightModeScheme",
    "darkMode",
    "autoDarkMode",
    "highContrast",
    "nickname",
    "locationInfo",
    "fahrenheit",
  ]
  storage.get(props, (results) => {
    // going at this top to bottom
    setColorScheme(
      {
        darkMode: results.darkMode,
        autoDarkMode: results.autoDarkMode,
        highContrast: results.highContrast,
        darkModeScheme: results.darkModeScheme,
        lightModeScheme: results.lightModeScheme,
      },
      true
    )

    // set nickname
    document.getElementById("nickname").value = results.nickname

    // set recommendations
    const historyToggle = document.getElementById("historyPerm")
    checkHistoryPermission()
      .then(() => {
        historyToggle.checked = true
      })
      .catch(() => {
        historyToggle.checked = false
      })

    console.log(results)

    // set location
    if (results.locationInfo) {
      let locationInfo = JSON.parse(results.locationInfo)
      document.getElementById("location").value = `${locationInfo.city}, ${locationInfo.state}`
    }

    // set temp
    document.getElementById("fahrenheit").checked = results.fahrenheit

    // set auto darkmode
    document.getElementById("autoDarkMode").checked = results.autoDarkMode

    // set darkmode
    document.getElementById("darkMode").checked = results.darkMode

    // set high contrast
    document.getElementById("highContrast").checked = results.highContrast

    // set color scheme pickers
    document.getElementById(results.darkModeScheme).classList.add("active")
    document.getElementById(results.lightModeScheme).classList.add("active")
    document.getElementById("currentDarkScheme").innerText = beautifyString(results.darkModeScheme)
    document.getElementById("currentLightScheme").innerText = beautifyString(results.lightModeScheme)
  })
}
