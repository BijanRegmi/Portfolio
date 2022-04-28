export const availableThemes = ["darkness", "brightness", "h4x0r"]

export const changeTheme = (theme) => {
	document.documentElement.className = theme
	localStorage.setItem("theme", theme)
}

export const loadTheme = () => {
	let t = localStorage.getItem("theme")
	if (t) changeTheme(t)
	else changeTheme("darkness")

    t = localStorage.getItem("size")
    if (t) changeSize(t)
    else changeSize("16")
}


export const changeSize = (size) => {
    document.documentElement.style.setProperty("--size", size+"px")
    localStorage.setItem("size", size)
}
