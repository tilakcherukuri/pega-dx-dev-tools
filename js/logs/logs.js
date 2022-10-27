const logTypes = {
  error: "row alert alert-danger",
  success: "row alert alert-success",
  warning: "row alert alert-warning",
  info: "row alert alert-info",
}
var logsArray = [
  // {
  //   type: "Info",
  //   message: "enable pega extension",
  //   timestamp: "July 21, 1983 01:15:00",
  // },
  // {
  //   type: "Warning",
  //   message: "enable pega extension",
  //   timestamp: "July 21, 1983 01:15:00",
  // },
  // {
  //   type: "Error",
  //   message: "enable pega extension",
  //   timestamp: "July 21, 1983 01:15:00",
  // },
  // {
  //   type: "Success",
  //   message: "enable pega extension",
  //   timestamp: "July 21, 1983 01:15:00",
  // },
]

const addRow = (log) => {
  let div = document.getElementById("log-contaner")
  if (div) {
    let html = `<div class="${logTypes[log.type.toLowerCase()]}">
    <div class="col-sm-2">
      <p class="logText">${log.timestamp}</p>
  </div>
  <div class="col-sm-1">
      <p class="logText">${camalize(log.type)}</p>
  </div>
  <div class="col-sm-9">
      <p class="logText">${log.message}</p>
  </div>
  </div>`
    html = html.trim()
    div.innerHTML = div.innerHTML + html
  }
}

const renderLogs = (log) => {
  if(logsArray.length>0){
    if(document.getElementById('no-logs'))
    document.getElementById('no-logs').style.display = "none"
  }
  logsArray = [...logsArray, log]
  logsArray.map((log) => {
    addRow(log)
  })
}

const camalize = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
}
chrome.runtime.onMessage.addListener((req, sender) => {
  if (req.type === "log") {
    renderLogs(req.log)
  }
})
