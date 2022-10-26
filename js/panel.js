// ******************** Code start for TAB functionality **************************

var hideScripts = false;
var hideConsole = false;
var selectedServiceUrlValue = "";
var notification_preferenceValue = false;

var msgr = document.getElementById("msgr");

// Refresh options from chrome.storage
function refresh_options() {
  // Use default value for preferences
  chrome.storage.sync.get(
    ["scriptsSelectionValue", "consoleSelectionValue"],
    function (items) {
      hideScripts = items.scriptsSelectionValue;
      hideConsole = items.consoleSelectionValue;
      selectedServiceUrlValue = items.selectedServiceUrl;
      notification_preferenceValue = items.notificationSelection;

      // Check if Selected Service is available and Notify
      if (
        selectedServiceUrlValue == "" ||
        selectedServiceUrlValue == undefined
      ) {
        var notification_options = {
          type: "basic",
          title: "Warning",
          message: "Please configure the Service Url from Options page!",
          iconUrl: "/assets/images/logo.png",
        };
        publishNotification(notification_options, true);
      }

      // Focus Overview Tab and hide other Tabs
      tabButtons.forEach((button) => {
        if (
          (button.getAttribute("id") == "Scripts" && hideScripts == false) ||
          (button.getAttribute("id") == "Console" && hideConsole == false)
        ) {
          button.setAttribute("tab-remove", "true");
        } else if (button.getAttribute("id") == "Overview") {
          button.setAttribute("tab-remove", "false");
          button.setAttribute("aria-selected", "true");
        } else {
          button.setAttribute("aria-selected", "false");
          button.setAttribute("tab-remove", "false");
        }
      });

      // Focus Overview TabPanel and hide other TabPanels
      const itabPanels = Array.from(tab.querySelectorAll('[role="tabpanel"]'));
      itabPanels.forEach((panel) => {
        if (panel.getAttribute("aria-labelledby") == "Overview") {
          panel.removeAttribute("hidden");
        } else {
          panel.hidden = true;
        }
      });

      // Update status to let user know options were refreshed.
      msgr.innerHTML = "&#10004; Refresh Successful";
      setTimeout(function () {
        msgr.innerHTML = "";
      }, 1200);
    }
  );
}

const tab = document.querySelector(".tabs");
const tabButtons = tab.querySelectorAll('[role="tab"]');
const tabPanels = Array.from(tab.querySelectorAll('[role="tabpanel"]'));

function tabClickHandler(e) {
  //Hide All Tabpane
  tabPanels.forEach((panel) => {
    panel.hidden = "true";
  });

  //Deselect Tab Button
  tabButtons.forEach((button) => {
    button.setAttribute("aria-selected", "false");
  });

  //Mark New Tab
  e.currentTarget.setAttribute("aria-selected", "true");

  //Show New Tab
  const { id } = e.currentTarget;

  const currentTab = tabPanels.find(
    (panel) => panel.getAttribute("aria-labelledby") === id
  );

  currentTab.hidden = false;
}

tabButtons.forEach((button) => {
  button.addEventListener("click", tabClickHandler);
});

// ******************** Code end for TAB functionality **************************

document.addEventListener("DOMContentLoaded", refresh_options);

const reloadBtn = document.querySelector(".refreshBtnClass");
reloadBtn.addEventListener("click", refresh_options);

// **********************Code to hide tabs in case of non-supported applications *************

chrome.storage.local.get(
  [
    "activeTabId",
    "applicationVersion",
    "thirdPartyComponentVersion",
    "pegaPlatformURL",
    "applicationType",
    "constellationURL",
    "pegaPlatformVersion",
  ],
  (res) => {
    if (res["applicationType"].toLocaleLowerCase().includes("not supported")) {
      document.getElementById("supported-apps").style.display = "none";
      document.getElementById("non-supported-apps").style.display = "block";
    } else {
    }
  }
);
