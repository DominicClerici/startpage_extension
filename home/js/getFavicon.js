const getFavicon = (url, imgId) => {
  let nUrl
  if (!url.includes("https://", "http://")) {
    nUrl = new URL(`https://${url}`)
  } else {
    nUrl = new URL(url)
  }
  let origin = nUrl.origin
  //   console.log(host)
  getFaviconBlob(`${origin}/favicon.ico`, false)
    .then((data) => {
      let faviconUrl = data.data

      document.getElementById(imgId).src = faviconUrl
      // document.getElementById(imgId).src = faviconUrl
    })
    .catch(() => {
      // try to use HTML method
      getFaviconByHTMLSearch(url, imgId)
    })
}

// get a copy of the pages html
// look for a link tag with a rel="icon" attribute
// use the href for that
const getFaviconByHTMLSearch = (urlInput, imgId) => {
  let url = new URL(urlInput).origin
  fetch(url)
    .then((res) => {
      if (res.status === 200) {
        return res.text()
      } else {
        return "error"
      }
    })
    .then((data) => {
      if (data == "error") {
        document.getElementById(imgId).classList.add("fallback")
      } else {
        const parser = new DOMParser()
        const doc = parser.parseFromString(data, "text/html")
        const iconLinks = doc.querySelectorAll("link[rel~=icon]")
        let largestBlob
        let length = iconLinks.length
        let outgoingRequests = iconLinks.length
        // when there are many link tags simply use the largest resolution image
        while (length--) {
          let urlObj
          try {
            urlObj = new URL(iconLinks[length].getAttribute("href"))
          } catch {
            urlObj = new URL(`${url}${iconLinks[length].getAttribute("href")}`)
          }
          getFaviconBlob(urlObj, true)
            .then((blob) => {
              if (largestBlob) {
                if (largestBlob.size < blob.size) {
                  largestBlob = blob
                }
              } else {
                largestBlob = blob
              }
              outgoingRequests--
              if (outgoingRequests == 0) {
                allRequestsComplete()
              }
            })
            .catch(() => {
              console.log("failed HTML approach for: ", origin)
              outgoingRequests--
              if (outgoingRequests == 0) {
                allRequestsComplete()
              }
            })
        }
        // when all requests have completed apply image url
        const allRequestsComplete = () => {
          document.getElementById(imgId).src = URL.createObjectURL(largestBlob)
        }
      }
    })
}

// fetches the actual Blob for the image and returns the url
// has option to return raw blob
const getFaviconBlob = (url, returnAsBlob) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((res) => {
        if (res.status === 200) {
          return res.blob()
        } else {
          reject()
        }
      })
      .then((data) => {
        if (data instanceof Blob) {
          if (returnAsBlob) {
            resolve(data)
          } else {
            if (data.size < 350) {
              reject()
            }
            resolve({ data: URL.createObjectURL(data) })
          }
        } else {
          reject()
        }
      })
  }).catch(() => {
    reject()
  })
}

// to help visibilty check brightness of favicon
// for example if icon is black, set background to a shade of white
// ? maybe refactor code above to implement,maybe not
const checkBrightnessOnBlob = (blob) => {
  // create a canvas to strip image of metadata
  const url = URL.createObjectURL(blob)
  const image = new Image()
  image.src = url

  image.onload = function () {
    const canvas = document.createElement("canvas")
    canvas.width = image.width
    canvas.height = image.height

    const context = canvas.getContext("2d")
    context.drawImage(image, 0, 0)

    // get pixeldata
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data

    let totalRed = 0
    let totalGreen = 0
    let totalBlue = 0
    let totalPixels = 0

    // for entries is one pixel [r, g, b, a]
    for (let i = 0; i < pixels.length; i += 4) {
      // add pixel values to totals
      if (pixels[i + 3] !== 0) {
        totalRed += pixels[i]
        totalGreen += pixels[i + 1]
        totalBlue += pixels[i + 2]
      }
      totalPixels++
    }

    // Calculate the average values by dividing the totals by the number of pixels
    const avgRed = totalRed / totalPixels
    const avgGreen = totalGreen / totalPixels
    const avgBlue = totalBlue / totalPixels
    const averageBrightnessBW = (avgBlue + avgRed + avgGreen) / 3
    // decide whether background should be bright or dark
    if (averageBrightnessBW >= 195) {
      return "dark"
    } else if (averageBrightnessBW <= 60) {
      return "bright"
    }
  }
}
