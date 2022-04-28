const History = ({ history }) => {
	return (
		<div className="history">
			{history.map((hist, index) => (
				<ul className="hist-item" key={index}>
					<div className="prompt">
						<p className="prompt">
							┌─[<span className="time">{hist.time}</span>]─[
							<span className="workingDir">
								{hist.workingDirectory}
							</span>
							]
						</p>
					</div>
					<div className="prompt">
						└──{">"}
						<span className="ip">{hist.input}</span>
					</div>
					<div className="op">
						{hist.output.split("\n").map((line, index) => {
							if (line.includes("http")) {
								var url = line.split(" ")
								url = url[url.length - 1]
								console.log(url)
								return (
									<p key={index}>
										-{" "}
										<a href={url} target="_blank">
											{url}
										</a>
									</p>
								)
							}
							return <p key={index}>{line}</p>
						})}
					</div>
				</ul>
			))}
		</div>
	)
}

export default History
