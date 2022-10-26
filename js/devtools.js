chrome.devtools.panels.create(
  "Pega DX Developer Tools",
  "/assets/images/logo.png",
  "/html/panel/panel.html",
  function (panel) {}
);

window.localStorage.removeItem("lowest_val");
window.localStorage.removeItem("highest_val");
var requestIDCounter = 0;
chrome.devtools.network.onRequestFinished.addListener((request) => {
  let req_obj = {
    url: request.request.url,
    method: request.request.method,
    res_stats: request.response.status,
    res_code: request.response.statusText,
    time: request.time,
    startedDateTime: request.startedDateTime,
  };
    chrome.runtime.sendMessage({ type: "networkdata", details: req_obj });
});
