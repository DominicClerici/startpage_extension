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
