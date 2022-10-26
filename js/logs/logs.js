const logTypes = {
  error: "row alert alert-danger",
  success: "row alert alert-success",
  warning: "row alert alert-warning",
  info: "row alert alert-info",
}
var logsArray = [
  {
    type: "Info",
    message: "enable pega extension",
    timestamp: "July 21, 1983 01:15:00",
  },
  {
    type: "Warning",
    message: "enable pega extension",
    timestamp: "July 21, 1983 01:15:00",
  },
  {
    type: "Error",
    message: "enable pega extension",
    timestamp: "July 21, 1983 01:15:00",
  },
  {
    type: "Success",
    message: "enable pega extension",
    timestamp: "July 21, 1983 01:15:00",
  },
]

const addRow = (log) => {
  let div = document.getElementById("log-contaner")
  if (div) {
    let html = `<div class="${logTypes[log.type.toLowerCase()]}">
  <div class="col-sm-4">
      <p>${camalize(log.type)}</p>
  </div>
  <div class="col-sm-4">
      <p>${log.message}</p>
  </div>
  <div class="col-sm-4">
      <p>${log.timestamp}</p>
  </div>
  </div>`
    html = html.trim()
    div.innerHTML = div.innerHTML + html
  }
}

const renderLogs = (log) => {
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
