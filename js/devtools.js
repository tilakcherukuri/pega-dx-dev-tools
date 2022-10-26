chrome.devtools.panels.create(
  "Pega DX Developer Tools",
  "/assets/images/logo.png",
  "/html/panel/panel.html",
  function (panel) {}
);

window.localStorage.removeItem("sync_q");
window.localStorage.removeItem("prev_sync_q");
chrome.devtools.network.onRequestFinished.addListener((request) => {
  /* console.log("From Devtools page requests ----->");
  console.log(request);
  debugger;
  let sync_q = window.localStorage.getItem("sync_q");
  if (!sync_q) {
    sync_q = [];
  } else {
    sync_q = JSON.parse(sync_q);
  }
  let temp_q = [];
  let req_obj = {
    url: request.request.url,
    method: request.request.method,
    res_stats: request.response.status,
    res_code: request.response.statusText,
    time: request.time,
    timings: request.timings,
  };
  if (!request.hasOwnProperty("_fromCache")) {
    temp_q.push(req_obj);
    if (temp_q) {
      sync_q.push(...temp_q);
    }
    localStorage.setItem("sync_q", JSON.stringify(sync_q));
  } */

  chrome.runtime.sendMessage(
    { type: "networkdata", details: request },
    function (response) {
      //console.log(response.farewell);
    }
  );
});
