const setColorScheme = (results, settingsFlags) => {
  if (results.highContrast) {
    document.body.classList.add("highContrast")
  } else if (!results.highContrast && !settingsFlags) {
    if (results.autoDarkMode) {
      document.body.classList.add("autoDarkMode")
      document.body.classList.add(results.darkModeScheme)
      document.body.classList.add(results.lightModeScheme)
    } else if (results.darkMode) {
      document.body.classList.add("noAuto")
      document.body.classList.add(results.darkModeScheme)
    } else if (!results.darkMode) {
      document.body.classList.add("noAuto")
      document.body.classList.add(results.lightModeScheme)
    }
  }
  if (settingsFlags) {
    if (results.autoDarkMode) {
      document.body.classList.add("autoDarkMode")
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.body.classList.add(results.darkModeScheme)
      } else {
        document.body.classList.add(results.lightModeScheme)
      }
    } else if (results.darkMode) {
      document.body.classList.add("noAuto")
      document.body.classList.add(results.darkModeScheme)
    } else if (!results.darkMode) {
      document.body.classList.add("noAuto")
      document.body.classList.add(results.lightModeScheme)
    }
  }
}
