let monthMS = 2629746000
let d = new Date()
let tzOffset = d.getTimezoneOffset() * 60000
let now = d.getTime() - tzOffset
let oneMonthAgo = now - monthMS

let totalUrls = 0

let urlsObj = {}
const processVisits = (url, title) => {
  chrome.history.getVisits({ url: url }, (result) => {
    let maxHour = 0
    let maxDay = 0
    let score = 0
    for (let i = 0; i < result.length; i++) {
      let currentHourDiff = Math.abs(
        parseInt((now % 86400000) / 3600000) - parseInt((result[i].visitTime % 86400000) / 3600000)
      )
      let currentDayDiff = Math.abs(
        parseInt((now % 604800000) / 86400000) - parseInt((result[i].visitTime % 604800000) / 86400000)
      )
      if (maxHour < currentHourDiff) {
        maxHour = currentHourDiff
      }
      if (maxDay < currentDayDiff) {
        maxDay = currentDayDiff
      }

      let dayScore = Math.abs(currentDayDiff - maxDay) * 3
      let hourScore = Math.abs(currentHourDiff - maxHour)

      score = dayScore + hourScore
    }
    if (urlsObj[url]) {
      urlsObj[url][0] += score
    } else {
      urlsObj[url] = [score, title]
    }

    totalUrls--
    if (totalUrls == 0) {
      sortUrls()
    }
  })
}

const gatherHistoryEntries = () => {
  chrome.history.search(
    {
      maxResults: 3500, // up to 3500 items
      text: "", // Return every history item...
      startTime: oneMonthAgo, // within the last month
    },
    (historyItems) => {
      let len = historyItems.length
      totalUrls = historyItems.length
      while (len--) {
        processVisits(historyItems[len].url, historyItems[len].title)
      }
    }
  )
}

const sortUrls = () => {
  let sortable = []
  for (var url in urlsObj) {
    sortable.push([url, urlsObj[url][0], urlsObj[url][1]])
  }
  sortable.sort((a, b) => {
    return a[1] - b[1]
  })
  let topResults = sortable.slice(-11, -1) // top 10 results
  constructDOMContent(topResults)
}

const constructDOMContent = (shortcuts) => {
  const root = document.getElementById("routine")
  let i = shortcuts.length
  let docFragment = document.createDocumentFragment()
  while (i--) {
    let container = document.createElement("a")
    container.href = shortcuts[i][0]
    let listItemSemantic = document.createElement("li")

    let SVGFrag = `
    <div class="svgCont">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 19 19">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.013 7.962a3.519 3.519 0 0 0-4.975 0l-3.554 3.554a3.518 3.518 0 0 0 4.975 4.975l.461-.46m-.461-4.515a3.518 3.518 0 0 0 4.975 0l3.553-3.554a3.518 3.518 0 0 0-4.974-4.975L10.3 3.7"/>
  </svg>
    
    </div>
  `
    let icon = document.createElement("img")
    icon.id = `routineShortcut${i}`
    icon.src = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${shortcuts[i][0]}&size=32`
    // icon.src = "https://s2.googleusercontent.com/s2/favicons?size=32&domain=" + shortcuts[i][0]
    // getFavicon(shortcuts[i][0], `routineShortcut${i}`)
    //   // replace with a function to take an alt image
    let name = document.createElement("p")
    name.innerText = shortcuts[i][2]

    listItemSemantic.appendChild(icon)
    listItemSemantic.insertAdjacentHTML("afterbegin", SVGFrag)
    listItemSemantic.appendChild(name)
    container.appendChild(listItemSemantic)
    docFragment.appendChild(container)
  }
  root.appendChild(docFragment)
}

const processHistory = () => {
  gatherHistoryEntries()
}
