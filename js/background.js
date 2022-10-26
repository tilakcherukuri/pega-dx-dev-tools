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


chrome.alarms.create("NotificationTimer", {
  periodInMinutes: 1000,
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "NotificationTimer" && showNotfication) {
    this.registration.showNotification("Please find details", {
      body: `Application : ${appType}`,
      icon: "/assets/icons/development.png",
    })
    showNotfication = false
  }
}); 

// Configure ServiceUrl Alarm
var selectedServiceUrlValue = "";
chrome.alarms.create("ServiceUrlAlarm", {
    when : new Date().now,
    periodInMinutes: 0.5,
});

chrome.alarms.onAlarm.addListener((alarm) => {
  chrome.storage.sync.get([
    'selectedServiceUrl'
    ], function(res) {
    if (res.selectedServiceUrl == "" || res.selectedServiceUrl == undefined) {
      showServiceUrlNotification = true;
    } else {
      showServiceUrlNotification = false;
    }
    console.log("selectedServiceUrl="+ res.selectedServiceUrl+ ", showServiceUrlNotification="+showServiceUrlNotification);

    if (alarm.name === "ServiceUrlAlarm" && showServiceUrlNotification) {
      console.log("Trigger ServiceUrlAlarm Notification");
      registration.showNotification("Warning", {
        body: "Please configure the Service Url from Options page!",
        icon: "/assets/icons/development.png",
      });
    }
  });
<<<<<<< Updated upstream
});
=======
});
>>>>>>> Stashed changes
