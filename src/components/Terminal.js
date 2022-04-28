import History from "./History"
import Command from "./Command"
import { useReducer, useEffect, useRef, useState } from "react"
import { cmdParser } from "../utils/commandParser"
import { loadTheme } from "../utils/theme"
import { getTime } from "../utils/time"

function Terminal() {
	const [state, dispatch] = useReducer(cmdParser, {
		history: [],
		workingDirectory: "/",
	})
	const ipRef = useRef()

	const handleKeyPress = e => {
		if (e.ctrlKey && e.code === 'keyL'){
			dispatch({cmd: "clear"})
		}
	}

	useEffect(() => {
		loadTheme()
		ipRef.current.focus()
		dispatch({cmd: "help", time: getTime(), workingDirectory: "/"})
		document.addEventListener("keydown", handleKeyPress)

		return () => {
			document.removeEventListener("keydown", handleKeyPress)
		}
	}, [])

	return (
		<div className="terminal" onClick={() => ipRef.current.focus()}>
			<History history={state.history} />
			<Command
				dispatch={dispatch}
				now={new Date()}
				ipRef={ipRef}
				workingDirectory={state.workingDirectory}
			/>
		</div>
	)
}

export default Terminal
