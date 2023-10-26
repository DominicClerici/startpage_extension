const clearChildren = (el) => {
  while (el.firstChild) {
    el.removeChild(el.lastChild)
  }
}
