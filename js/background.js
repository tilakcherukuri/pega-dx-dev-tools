/* START : toogle extension icon  */
function setIconAndPopup(buildType, tabId) {
  chrome.action.setIcon({
    tabId: tabId,
    path: {
      16: "/assets/icons/16-" + buildType + ".png",
      48: "/assets/icons/48-" + buildType + ".png",
      128: "/assets/icons/128-" + buildType + ".png",
    },
  });

  chrome.action.setPopup({
    tabId: tabId,
    popup: "/html/popups/" + buildType + ".html",
  });
}

chrome.runtime.onMessage.addListener((req, sender) => {
  if (req.buildType) {
    setIconAndPopup(req.buildType, sender.tab.id);
  } else {
    setIconAndPopup("disabled", sender.tab.id);
  }
});
/* END : toogle extension icon  */

// ***********************Dummy response to get the active Tab ID *************************************
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.text == "Get Active Tab ID") {
    sendResponse({ tab: sender.tab.id });
  }
});
