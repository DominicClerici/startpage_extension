const createReminderCreationWindow = () => {
  let btn = document.getElementById("createNewReminder")
  const root = document.getElementById("reminderList")

  let elToRem = document.getElementById("noReminders")
  if (elToRem) {
    root.removeChild(elToRem)
  }
  if (btn.innerText == "Cancel") {
    root.removeChild(document.getElementById("INSERTED_createReminder"))
    root.classList.remove("hideContent")
    // check if no reminders then make thing
    if (root.children.length == 0) {
      createDoneGraphic(root)
    }
    btn.innerText = "Create"
    return
  }
  let temp = document.createElement("template")
  let d = new Date()

  // default value to today for date input
  let year = d.getFullYear()
  let month = String(d.getMonth() + 1).padStart(2, "0")
  let day = String(d.getDate()).padStart(2, "0")
  let currentDay = `${year}-${month}-${day}`

  // default value for time is rounded to the next hour
  let hours = String(d.getHours() + 1).padStart(2, "0")
  let currentTime = `${hours}:00`

  let htmlAsString = `
          <div id="INSERTED_createReminder" class="newEventCont">
            <h2>New reminder</h2>
            <form id="reminderForm">
              <div class="focusCont">
                <span class="inputGroup">
                  <label for="titleInput">Title</label>
                  <input required autocomplete="off" name="titleInput" id="titleInput" type="text" class="inp" />
                </span>
                <span class="inputGroup">
                  <label for="descInput">Description</label>
                  <textarea name="descInput" id="descInput" rows="3" class="inp"></textarea>
                </span>

                <span class="timeSelectionToggle">
                  <label id="dateMode">Date</label>
                  <input checked name="timeModeSelection" id="changeTimeSelectionMode" type="checkbox" />
                  <label id="timeMode">Timer</label>
                </span>
                <span id="replaceContent">
                  <span id="dateInput" class="inputRow canBeHidden">
                    <span class="inputGroup">
                      <label for="dateDate">Date</label>
                      <input id="dateDate" name="dateDate" value="${currentDay}" class="inp" type="date" />
                    </span>
                    <span class="inputGroup">
                      <label for="dateTime">Time</label>
                      <input id="dateTime" name="dateTime" value="${currentTime}" class="inp" type="time" />
                    </span>
                  </span>
                  <span id="timerInput" class="inputRow canBeHidden visible">
                    <span class="inputRow">
                      <span class="inputGroup">
                        <label for="timerDays">Days</label>
                        <input autocomplete="off" id="timerDays" name="timerDays" min="0" max="100" value="0" class="inp" type="number" />
                      </span>
                      <span class="inputGroup">
                        <label for="timerHours">Hours</label>
                        <input autocomplete="off" id="timerHours" name="timerHours" min="0" max="23" value="1" class="inp" type="number" />
                      </span>
                      <span class="inputGroup">
                        <label for="timerMinutes">Minutes</label>
                        <input
                          autocomplete="off"
                          id="timerMinutes"
                          name="timerMinutes"
                          min="0"
                          max="59"
                          value="0"
                          class="inp"
                          type="number"
                        />
                      </span>
                    </span>
                  </span>
                </span>
              </div>
              <input type="submit" value="Create" />
            </form>
          </div>
    `
  temp.innerHTML = htmlAsString
  temp.content.getElementById("changeTimeSelectionMode").addEventListener("click", (e) => {
    let dates = document.getElementById("dateInput")
    let timer = document.getElementById("timerInput")
    if (e.target.checked) {
      // timer mode
      dates.classList.remove("visible")
      timer.classList.add("visible")
    } else {
      // date mode
      dates.classList.add("visible")
      timer.classList.remove("visible")
    }
  })
  temp.content.getElementById("reminderForm").addEventListener("submit", (e) => {
    e.preventDefault()
    // get a snapshot of the data before removing element
    const data = new FormData(e.target)
    createReminder([...data.entries()])
    btn.innerText = "Create"
    root.removeChild(document.getElementById("INSERTED_createReminder"))
    root.classList.remove("hideContent")
  })
  btn.innerText = "Cancel"
  root.classList.add("hideContent")
  root.prepend(temp.content)
}

const createDoneGraphic = (root) => {
  // noReminderText
  let cont = document.createElement("div")
  cont.className = "noReminderCont"
  cont.id = "noReminders"
  let svgDoneCont = document.createElement("div")
  let text = document.createElement("h1")
  text.innerText = "No reminders"
  text.id = "noReminderText"
  svgDoneCont.innerHTML = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
    <path  stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 10 2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
  </svg>`
  svgDoneCont.className = "svgDoneReminder"
  cont.appendChild(svgDoneCont)
  cont.appendChild(text)
  root.appendChild(cont)
  // root.appendChild(svgDoneCont)
  // root.appendChild(text)
}

const deleteReminder = (id) => {
  const storage = chrome.storage.sync
  storage.get(["reminders"], (results) => {
    if (results.reminders) {
      let newData = results.reminders.filter((obj) => {
        return obj.id !== id
      })
      storage.set({ reminders: [...newData] }, () => {
        let el = document.querySelector(`[reminderUUID="${id}"`)
        el.classList.add("closing")
        setTimeout(() => {
          if (newData.length == 0) {
            createDoneGraphic(document.getElementById("reminderList"))
          }
          document.getElementById("reminderList").removeChild(el)
        }, 500)
      })
    }
  })
}

const createReminder = (data) => {
  //   construct useable object
  let formDataObj = {}
  for (let i = 0; i < data.length; i++) {
    formDataObj[data[i][0]] = data[i][1]
  }
  let reminderData = {}
  let now = new Date().getTime()
  if (formDataObj.timeModeSelection === "on") {
    reminderData["dueAt"] =
      now +
      parseFloat(formDataObj.timerDays) * 86400000 +
      parseFloat(formDataObj.timerHours) * 3600000 +
      parseFloat(formDataObj.timerMinutes) * 60000
  } else {
    reminderData["dueAt"] = convertDateTimeToMS(formDataObj.dateDate, formDataObj.dateTime)
  }
  reminderData["title"] = formDataObj.titleInput
  reminderData["description"] = formDataObj.descInput
  reminderData["id"] = generateUUID()
  let storage = chrome.storage.sync
  //   storage.remove(["reminders"])

  storage.get(["reminders"], (results) => {
    if (results.reminders) {
      let prevData = [...results.reminders]
      prevData.push(reminderData)
      prevData.sort((a, b) => {
        return a.dueAt >= b.dueAt ? 1 : -1
      })
      storage.set({ reminders: [...prevData] }, () => {
        addReminderToList(reminderData)
      })
    } else {
      storage.set({ reminders: [reminderData] }, () => {
        storage.get(["reminders"], (res) => {
          if (res.reminders) {
          }
        })
      })
    }
  })
}

const addReminderToList = (newReminder) => {
  let shortcutContainer = document.createElement("li")
  shortcutContainer.className = "reminderItem added"
  shortcutContainer.setAttribute("reminderUUID", newReminder.id)
  let infoContainer = document.createElement("div")
  let title = document.createElement("h6")
  title.innerText = newReminder.title
  let description = document.createElement("p")
  description.className = "reminderDescription"
  description.innerText = newReminder.description
  let dueAtFromNow = document.createElement("p")
  dueAtFromNow.className = "dueAtFromNow"
  dueAtFromNow.innerText = convertMSToTimeUntil(newReminder.dueAt)
  let dueAtDate = document.createElement("p")
  dueAtDate.className = "dueAtDate"
  dueAtDate.innerText = convertMSToDate(newReminder.dueAt)
  infoContainer.appendChild(title)
  infoContainer.appendChild(dueAtFromNow)
  infoContainer.appendChild(dueAtDate)
  infoContainer.appendChild(description)
  let deleteButton = document.createElement("button")
  deleteButton.addEventListener("click", () => {
    deleteReminder(newReminder.id)
  })
  let svgIcon = `<svg width="320" height="234" viewBox="0 0 320 234" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="21.5735" y="105.36" width="150" height="30" rx="15" transform="rotate(45 21.5735 105.36)" fill="black"/> <rect x="319.345" y="21.2134" width="300" height="30" rx="15" transform="rotate(135 319.345 21.2134)" fill="black"/> </svg> `
  deleteButton.insertAdjacentHTML("afterbegin", svgIcon)
  shortcutContainer.appendChild(infoContainer)
  shortcutContainer.appendChild(deleteButton)
  document.getElementById("reminderList").prepend(shortcutContainer)
}

const initializeReminders = () => {
  const root = document.getElementById("reminderList")
  let storage = chrome.storage.sync
  storage.get(["reminders"], (results) => {
    if (results.reminders) {
      let reminders = results.reminders
      if (reminders.length == 0) {
        createDoneGraphic(root)
      } else {
        let frag = document.createDocumentFragment()
        for (let i = 0; i < reminders.length; i++) {
          let shortcutContainer = document.createElement("li")
          shortcutContainer.className = "reminderItem"
          shortcutContainer.setAttribute("reminderUUID", reminders[i].id)
          let infoContainer = document.createElement("div")
          let title = document.createElement("h6")
          title.innerText = reminders[i].title
          let description = document.createElement("p")
          description.className = "reminderDescription"
          description.innerText = reminders[i].description
          let dueAtFromNow = document.createElement("p")
          dueAtFromNow.className = "dueAtFromNow"
          dueAtFromNow.innerText = convertMSToTimeUntil(reminders[i].dueAt)
          let dueAtDate = document.createElement("p")
          dueAtDate.className = "dueAtDate"
          dueAtDate.innerText = convertMSToDate(reminders[i].dueAt)
          infoContainer.appendChild(title)
          infoContainer.appendChild(dueAtFromNow)
          infoContainer.appendChild(dueAtDate)
          infoContainer.appendChild(description)
          let deleteButton = document.createElement("button")
          deleteButton.addEventListener("click", () => {
            deleteReminder(reminders[i].id)
          })
          let svgIcon = `<svg width="320" height="234" viewBox="0 0 320 234" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="21.5735" y="105.36" width="150" height="30" rx="15" transform="rotate(45 21.5735 105.36)" fill="black"/> <rect x="319.345" y="21.2134" width="300" height="30" rx="15" transform="rotate(135 319.345 21.2134)" fill="black"/> </svg> `
          deleteButton.insertAdjacentHTML("afterbegin", svgIcon)
          shortcutContainer.appendChild(infoContainer)
          shortcutContainer.appendChild(deleteButton)
          frag.appendChild(shortcutContainer)
        }
        root.appendChild(frag)
      }
    } else {
      createDoneGraphic(root)
      // !make no reminders thing
      // console.log("no reminders")
    }
  })
}

const initializeVisibleTimeFormat = () => {
  let storage = chrome.storage.sync
  storage.get(["reminderTimeView"], (result) => {
    if (result.reminderTimeView != undefined) {
      if (result.reminderTimeView) {
        document.getElementById("fromNowView").classList.add("visible")
        document.getElementById("reminderList").classList.add("fromNow")
      } else {
        document.getElementById("calendarView").classList.add("visible")
        document.getElementById("reminderList").classList.add("date")
      }
    } else {
      storage.set({ ["reminderTimeView"]: true })
    }
  })
}

const changeVisibleTimeFormat = (e) => {
  let calendarViewSVG = document.getElementById("calendarView")
  let fromNowViewSVG = document.getElementById("fromNowView")
  let reminderListEl = document.getElementById("reminderList")
  let buttonToDisable = document.getElementById("changeReminderViewButton")
  buttonToDisable.disabled = true
  let storage = chrome.storage.sync
  storage.get(["reminderTimeView"], (result) => {
    if (result.reminderTimeView != undefined) {
      if (result.reminderTimeView) {
        storage.set({ ["reminderTimeView"]: false })
        calendarViewSVG.classList.add("visible")
        fromNowViewSVG.classList.remove("visible")
        reminderListEl.classList.add("date")
        reminderListEl.classList.remove("fromNow")
        buttonToDisable.disabled = false
      } else {
        storage.set({ ["reminderTimeView"]: true })
        calendarViewSVG.classList.remove("visible")
        fromNowViewSVG.classList.add("visible")
        reminderListEl.classList.remove("date")
        reminderListEl.classList.add("fromNow")
        buttonToDisable.disabled = false
      }
    } else {
      storage.set({ ["reminderTimeView"]: true })
      fromNowViewSVG.classList.add("visible")
      reminderListEl.classList.add("fromNow")
      buttonToDisable.disabled = false
    }
  })
}

const convertMSToTimeUntil = (ms) => {
  const now = new Date().getTime()
  const difference = ms - now
  const absoluteDifference = Math.abs(difference)
  const days = Math.floor(absoluteDifference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((absoluteDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((absoluteDifference % (1000 * 60 * 60)) / (1000 * 60))

  let formattedTime = ""
  if (days > 0) {
    formattedTime = `${days} day${days > 1 ? "s" : ""}`
  } else if (hours > 0) {
    formattedTime = `${hours} hour${hours > 1 ? "s" : ""}`
  } else {
    if (minutes > 1) {
      formattedTime = `${minutes} minutes`
    } else {
      return "Now"
    }
  }
  if (difference < 0) {
    formattedTime += " ago"
  }
  return formattedTime
}
const convertMSToDate = (ms) => {
  const date = new Date(ms)

  const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."]

  const month = months[date.getMonth()]
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? "pm" : "am"
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes

  const dateString = `${month} ${day}, ${formattedHours}:${formattedMinutes}${ampm}`

  return dateString
}

const convertDateTimeToMS = (dateString, timeString) => {
  // split the date and time strings
  const [dateParts, timeParts] = [dateString.split("-"), timeString.split(":")]

  // parse date and time
  const year = parseInt(dateParts[0], 10)
  const month = parseInt(dateParts[1], 10) - 1 // months are 0 index
  const day = parseInt(dateParts[2], 10)
  const hours = parseInt(timeParts[0], 10)
  const minutes = parseInt(timeParts[1], 10)

  // return new ms
  return new Date(year, month, day, hours, minutes).getTime()
}
