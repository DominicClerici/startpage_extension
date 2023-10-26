const checkHistoryPermission = () => {
  return new Promise((res, rej) => {
    chrome.permissions.contains(
      {
        permissions: ["history"],
      },
      (result) => {
        if (result) {
          res()
        } else {
          rej()
        }
      }
    )
  })
}

const requestHistoryPermission = () => {
  return new Promise((res, rej) => {
    chrome.permissions.request(
      {
        permissions: ["history"],
      },
      (granted) => {
        if (granted) {
          // request approved, send message
          res()
        } else {
          // request was not approved, send message
          rej()
        }
      }
    )
  })
}
