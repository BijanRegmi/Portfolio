import { files } from "./files"
import { changeTheme, changeSize, availableThemes } from "./theme"

const getAbsolutePath = (current, dest) => {
	var oldpaths = current === "/" ? [""] : current.split("/")
	var newpaths = dest.replace(/(.*)\/+$/gm, "$1").split("/") // remove trailing slash
	var paths = newpaths[0] !== "" ? [...oldpaths, ...newpaths] : [...newpaths] // relative:absolute
	var resolved = []

	var content = files.content
	var type = "folder"

	for (var i = 0; i < paths.length; i++) {
		var val = paths[i]
		if (val === ".") {
			// Ignore if .
		} else if (val === "..") {
			if (resolved.length && resolved[resolved.length - 1] !== "") {
				resolved.pop() // Go back if ..
				// Rebuild the fucking content
				content = files.content
				resolved.forEach(value => {
					if (value !== "")
						content = content.filter(r => r.name == value)[0]
							.content
				})
			}
		} else {
			resolved.push(val)
			try {
				if (val !== "") {
					content = content.filter(r => {
						return r.name == val
					})[0]
					type = content.type
					content = content.content
					if (content == undefined) throw "No such file or directory"
				}
			} catch (error) {
				console.log(error)
				return {
					success: false,
					error: "No such file or directory",
					path: resolved.join("/"),
				}
			}
		}
	}
	return {
		success: true,
		content: content,
		path: resolved.join("/") || "/",
		type: type,
	}
}

const detailed = {
	help: "help: Show the main help message",
	clear: "clear: clear the terminal history",
	theme: `theme: set the theme of the terminal
	Syntax: theme <theme-name>
	To list available theme run theme list`,
	"font-size": `font-size: set the font size of the terminal
	Syntax: font-size <size in pixel>
	Example: font-size 16`,
	pwd: "pwd: print working directory",
	ls: `list files/directories in given folder
	Syntax: ls <DIR>`,
	cd: `change the current directory to DIR
	Syntax: cd <DIR>`,
	cat: `Concatenate FILE(s) to standart output
	Syntax: cat <File/s>`,
	whoami: `Print the details of the page author`,
}

export const cmdParser = (state, action) => {
	var args = action.cmd.trimEnd().split(" ")
	var output = "",
		nwd = state.workingDirectory

	switch (args[0]) {
		case "sudo":
			output = "Gotta escalate that privilege."
			break
		case "help":
			if (args.length === 1) {
				output = `
				Available Commands:
				help clear theme font-size pwd ls cd cat whoami
				Run help <command> for detailed explanation about the command.
				`
			} else if (args.length === 2) {
				output = detailed[args[1]] || "No such command exists in /usr/bin"
			} else {
				output = "Too many arguments"
			}
			break
		case "clear":
			if (args.length === 1)
				return { history: [], workingDirectory: state.workingDirectory }
			else output = "This command does not accept any parameter."
		case "theme":
			if (args.length !== 2)
				output = "Invalid Syntax!\nSyntax: theme <theme_name>"
			else if (args[1] == "list") {
				output = `Available themes:\n${availableThemes.join("\n")}`
			} else {
				if (availableThemes.includes(args[1])) {
					changeTheme(args[1])
					output = `Theme changed to ${args[1]}`
				} else {
					output =
						"Uh Oh! This theme is not available.\nTo list available theme run theme list"
				}
			}
			break
		case "font-size":
			if (args.length === 2 && !isNaN(args[1])) {
				changeSize(args[1])
				output = `Font size set to ${args[1]}`
			} else {
				output =
					"Invalid Command!\nSyntax: font-size <size in pixels>\nExample: font-size 16"
			}
			break
		case "pwd":
			output = action.workingDirectory
			break
		case "ls":
			if (args.length <= 2) {
				var response = getAbsolutePath(
					state.workingDirectory,
					args[1] || "."
				)
				if (response.success) {
					if (response.type === "folder") {
						output = ""
						response.content.forEach(f => {
							var perm =
								f.type === "folder"
									? "drwxr-xr-x"
									: "-rw-r--r--"
							output += `${perm} ${f.name}\n`
						})
					} else
						output = `${response.path} is a file, not a directory!`
				} else {
					output = `${response.path}\n${response.error}`
				}
			} else {
				output = "Too many arguments"
			}
			break
		case "cd":
			if (args.length == 1) {
				nwd = "/"
			} else if (args.length == 2) {
				var response = getAbsolutePath(state.workingDirectory, args[1])
				if (response.success) {
					if (response.type === "folder") nwd = response.path
					else output = `${response.path} is a file, not a directory!`
				} else {
					output = `${response.path}\n${response.error}`
				}
			} else {
				output = "Too many arguments"
			}
			break
		case "cat":
			if (args.length < 2) {
				output = "Too few arguments"
			} else {
				for (var i = 1; i < args.length; i++) {
					var response = getAbsolutePath(
						state.workingDirectory,
						args[i]
					)
					if (response.success) {
						if (response.type === "file") {
							output += `${response.path}:\n`
							output += `${response.content}\n`
						} else
							output += `${response.path} is a folder, not a file!\n`
					} else {
						output += `${response.path}\n${response.error}\n`
					}
				}
			}
			break
		case "whoami":
			output = "Bijan Regmi"
			break
		default:
			output = "Command not found in /usr/bin"
			break
	}
	return {
		history: [
			...state.history,
			{
				time: action.time,
				input: action.cmd,
				output: output,
				workingDirectory: action.workingDirectory,
			},
		],
		workingDirectory: nwd,
	}
}
