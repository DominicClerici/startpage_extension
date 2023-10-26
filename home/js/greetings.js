const createGreeting = (nickname) => {
  if (nickname.trim() !== "") {
    document.getElementById("greeting").innerText = "Hello, " + nickname
  } else {
    document.getElementById("greeting").innerText = "Hello"
  }
}
