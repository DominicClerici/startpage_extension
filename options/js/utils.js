const beautifyString = (str) => {
  let spaceAtUppercase = str.replace(/([A-Z])/g, " $1").trim()
  let firstLetter = spaceAtUppercase.charAt(0).toUpperCase()
  let finalString = firstLetter + spaceAtUppercase.slice(1)
  return finalString
}
const fancyUrl = (urlString) => {
  try {
    let url = new URL(urlString)
    let host = url.hostname.replace("www.", "")
    return `${host}<span class="pathNameFade">${url.pathname}</span>`
  } catch {
    return urlString
  }
}
