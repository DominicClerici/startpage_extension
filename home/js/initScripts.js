const checkForNewUser = () => {
  return new Promise((res, rej) => {
    const storage = chrome.storage.sync
    const props = [
      "nickname",
      "darkModeScheme",
      "lightModeScheme",
      "darkMode",
      "autoDarkMode",
      "highContrast",
      "locationInfo",
      "fahrenheit",
    ]
    storage.get(props, (results) => {
      if (!results[props[0]]) {
        // user is new
        console.log(console.log("user is new"))
        rej()
      } else {
        // user is not new
        res(results)
      }
    })
  })
}

checkForNewUser()
  .then((data) => {
    console.log("user exists")
    initializeList()
    setColorScheme({
      darkMode: data.darkMode,
      autoDarkMode: data.autoDarkMode,
      highContrast: data.highContrast,
      darkModeScheme: data.darkModeScheme,
      lightModeScheme: data.lightModeScheme,
    })
    setWeatherData(data.locationInfo, data.fahrenheit)
    checkHistoryPermission().then(() => {
      processHistory()
    })
    createGreeting(data.nickname)
    initializeReminders()
    initializeVisibleTimeFormat()
  })
  .catch(() => {
    newUserRoutine()
  })
// if (newUser) {
//   console.log("new user")
//   newUserRoutine()
// } else {
//   console.log("user exists")
// initializeList()
// getSettings()
// getWeatherData()
// checkHistoryPermission()
// initializeReminders()
// initializeVisibleTimeFormat()
// }

// perform check for new user
