let showNotfication = false;

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
  if (req.buildType === 'pega-app') {
    manageChromeStorageOnload(true);
  } else {
    manageChromeStorageOnload(false);
  }
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
      icon: "/assets/icons/128-pega-app.png",
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
    'appDefSettings',
    'notificationSelection',
    'selectedServiceUrl',
    ], function(res) {
    console.log("selectedServiceUrl="+ res.selectedServiceUrl+ ", showServiceUrlNotification="+res.notificationSelection+", appDefSettings="+res.appDefSettings);

    if (alarm.name === "ServiceUrlAlarm" 
    && (res.selectedServiceUrl == "" || res.selectedServiceUrl == undefined)
    && res.notificationSelection 
    && res.appDefSettings) {
      console.log("Trigger ServiceUrlAlarm Notification");
      registration.showNotification("Warning", {
        body: "Please configure the Service Url from Options page!",
        icon: "/assets/icons/128-pega-app.png",
      });
    }
  });
});

function manageChromeStorageOnload(flag) {
  console.log("manageChromeStorageOnload ["+flag+"]");

  //check if the Service Url is Pega-app enabled
  if (flag) { 
    chrome.storage.sync.get(['appDefSettings'], function(res){
      // Rest to the default table
      var tblDef = "<thead class='tblHdr'><tr><th style='color:#000'>❑❑</th><th>Environment*</th><th>Service URL*</th><th colspan='2'>Actions</th></tr></thead><tbody id='tblbody'><tr><td class='td-data'></td><td class='td-data'><input type='text' class='tblInput servtype' id='txtenv_defname' placeholder='Environment' value=''></td><td class='td-data'><input type='text' class='tblInput servurl' id='txtservice_defurl' placeholder='Service URL' value=''></td><td class='td-data'><button id='btnaddRow' class='tblBtnAddClass'>✚</button></td><td class='td-data'></td></tr></tbody>";
      
      if (res.appDefSettings == undefined || res.appDefSettings == false) {
        chrome.storage.sync.set({
          appDefSettings            : true,
          scriptsSelectionValue     : false,
          consoleSelectionValue     : false,
          notificationSelection     : true
        }, function() {
          console.log("Enabled AppDefaultSettings on Chrome Storage");
        });
      }
    });
  } else {
    chrome.storage.sync.set({appDefSettings : false}, function(){
      console.log("Disabled AppDefaultSettings on Chrome Storage");
    });
  }
}
