// ? Gets and displays weather data on startup

const setWeatherData = (result, units, name) => {
  if (result) {
    let loc = JSON.parse(result)
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${loc.latCoord}&longitude=${
        loc.lonCoord
      }&current_weather=true&temperature_unit=${units ? "fahrenheit" : "celsius"}`
    )
      .then((res) => {
        if (res.ok) {
          return res.json()
        } else {
          return 1
        }
      })
      .then((data) => {
        if (data === 1) {
          // ! make this display nothing
        } else {
          document.getElementById("temp").innerText = `${Math.round(data.current_weather.temperature)} °${
            units ? "F" : "C"
          }`
          let prop = data.current_weather.weathercode + (data.current_weather.is_day == 1 ? "d" : "n")
          document.getElementById("weatherIcon").src = codeJSON[prop]
          document.getElementById("weatherDesc").innerText = interpretWMOCode(data.current_weather.weathercode)
        }
      })
  }
}

const interpretWMOCode = (code) => {
  switch (code) {
    case 0:
      return "Clear"
    case 1:
    case 2:
    case 3:
      return "Partly Cloudy"
    case 45:
    case 48:
      return "Foggy"
    case 51:
    case 53:
    case 55:
      return "Light Rain"
    case 56:
    case 57:
      return "Freezing Drizzle"
    case 61:
    case 63:
    case 65:
      return "Light Rain"
    case 66:
    case 67:
      return "Freezing Rain"
    case 71:
    case 73:
    case 75:
      return "Snow"
    case 77:
      return "Snow Grains"
    case 80:
    case 81:
    case 82:
      return "Rain Showers"
    case 85:
    case 86:
      return "Snow Showers"
    case 95:
      return "Thunderstorm"
    case 96:
    case 99:
      return "Heavy Thunderstorm"
    default:
      return ""
  }
}

const codeJSON = {
  "0d": "http://openweathermap.org/img/wn/01d@2x.png",
  "0n": "http://openweathermap.org/img/wn/01n@2x.png",
  "1d": "http://openweathermap.org/img/wn/01d@2x.png",
  "1n": "http://openweathermap.org/img/wn/01n@2x.png",
  "2d": "http://openweathermap.org/img/wn/02d@2x.png",
  "2n": "http://openweathermap.org/img/wn/02n@2x.png",
  "3d": "http://openweathermap.org/img/wn/03d@2x.png",
  "3n": "http://openweathermap.org/img/wn/03n@2x.png",
  "45d": "http://openweathermap.org/img/wn/50d@2x.png",
  "45n": "http://openweathermap.org/img/wn/50n@2x.png",
  "48d": "http://openweathermap.org/img/wn/50d@2x.png",
  "48n": "http://openweathermap.org/img/wn/50n@2x.png",
  "51d": "http://openweathermap.org/img/wn/09d@2x.png",
  "51n": "http://openweathermap.org/img/wn/09n@2x.png",
  "53d": "http://openweathermap.org/img/wn/09d@2x.png",
  "53n": "http://openweathermap.org/img/wn/09n@2x.png",
  "55d": "http://openweathermap.org/img/wn/09d@2x.png",
  "55n": "http://openweathermap.org/img/wn/09n@2x.png",
  "56d": "http://openweathermap.org/img/wn/09d@2x.png",
  "56n": "http://openweathermap.org/img/wn/09n@2x.png",
  "57d": "http://openweathermap.org/img/wn/09d@2x.png",
  "57n": "http://openweathermap.org/img/wn/09n@2x.png",
  "61d": "http://openweathermap.org/img/wn/10d@2x.png",
  "61n": "http://openweathermap.org/img/wn/10n@2x.png",
  "63d": "http://openweathermap.org/img/wn/10d@2x.png",
  "63n": "http://openweathermap.org/img/wn/10n@2x.png",
  "65d": "http://openweathermap.org/img/wn/10d@2x.png",
  "65n": "http://openweathermap.org/img/wn/10n@2x.png",
  "66d": "http://openweathermap.org/img/wn/10d@2x.png",
  "66n": "http://openweathermap.org/img/wn/10n@2x.png",
  "67d": "http://openweathermap.org/img/wn/10d@2x.png",
  "67n": "http://openweathermap.org/img/wn/10n@2x.png",
  "71d": "http://openweathermap.org/img/wn/13d@2x.png",
  "71n": "http://openweathermap.org/img/wn/13n@2x.png",
  "73d": "http://openweathermap.org/img/wn/13d@2x.png",
  "73n": "http://openweathermap.org/img/wn/13n@2x.png",
  "75d": "http://openweathermap.org/img/wn/13d@2x.png",
  "75n": "http://openweathermap.org/img/wn/13n@2x.png",
  "77d": "http://openweathermap.org/img/wn/13d@2x.png",
  "77n": "http://openweathermap.org/img/wn/13n@2x.png",
  "80d": "http://openweathermap.org/img/wn/09d@2x.png",
  "80n": "http://openweathermap.org/img/wn/09n@2x.png",
  "81d": "http://openweathermap.org/img/wn/09d@2x.png",
  "81n": "http://openweathermap.org/img/wn/09n@2x.png",
  "82d": "http://openweathermap.org/img/wn/09d@2x.png",
  "82n": "http://openweathermap.org/img/wn/09n@2x.png",
  "85d": "http://openweathermap.org/img/wn/13d@2x.png",
  "85n": "http://openweathermap.org/img/wn/13n@2x.png",
  "86d": "http://openweathermap.org/img/wn/13d@2x.png",
  "86n": "http://openweathermap.org/img/wn/13n@2x.png",
  "95d": "http://openweathermap.org/img/wn/11d@2x.png",
  "95n": "http://openweathermap.org/img/wn/11n@2x.png",
  "96d": "http://openweathermap.org/img/wn/11d@2x.png",
  "96n": "http://openweathermap.org/img/wn/11n@2x.png",
  "99d": "http://openweathermap.org/img/wn/11d@2x.png",
  "99n": "http://openweathermap.org/img/wn/11n@2x.png",
}
