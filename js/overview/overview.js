chrome.runtime.sendMessage({
  type: "log",
  log: {
    type: "Info",
    message: "form overview",
    timestamp: "July 21, 1983 01:15:00",
  },
});

const applicationVersionElem = document.getElementById("application-version");
const thirdPartyComponentVersionElem = document.getElementById(
  "third-party-component-version"
);
const applicationTypeElem = document.getElementById("application-type");
const constellationURLElem = document.getElementById("constellation-URL");
const constellationVersionElem = document.getElementById(
  "constellation-service-version"
);
const pegaPlatformVersionElem = document.getElementById(
  "pega-platform-version"
);
const pegaPlatformURLElem = document.getElementById("pega-platform-URL");

const thirdPartyHeadingElem = document.getElementById("third-party-heading");
const appLogoElem = document.getElementById("app-logo");

let appDetails = {};

chrome.storage.local.get(
  [
    "activeTabId",
    "applicationVersion",
    "thirdPartyComponentVersion",
    "pegaPlatformURL",
    "applicationType",
    "constellationURL",
    "pegaPlatformVersion",
    "constellationVersion",
  ],
  (res) => {
    appDetails = res;
    console.log(appDetails);
    console.log(chrome.devtools.inspectedWindow.tabId);
    if (appDetails["activeTabId"] == chrome.devtools.inspectedWindow.tabId) {
      applicationVersionElem.textContent =
        appDetails["applicationVersion"] != ""
          ? appDetails["applicationVersion"]
          : "Not found";
      thirdPartyComponentVersionElem.textContent =
        appDetails["thirdPartyComponentVersion"] != ""
          ? appDetails["thirdPartyComponentVersion"]
          : "Not found";
      pegaPlatformURLElem.textContent =
        appDetails["pegaPlatformURL"] != ""
          ? appDetails["pegaPlatformURL"]
          : "Not found";
      constellationURLElem.textContent =
        appDetails["constellationURL"] != ""
          ? appDetails["constellationURL"]
          : "Not found, please set in extenstion options.";
      pegaPlatformVersionElem.textContent =
        appDetails["pegaPlatformVersion"] != ""
          ? appDetails["pegaPlatformVersion"]
          : "Not found";
      constellationVersionElem.textContent =
        appDetails["constellationVersion"] != ""
          ? appDetails["constellationVersion"]
          : "Not found";
      applicationTypeElem.textContent =
        appDetails["applicationType"] != ""
          ? appDetails["applicationType"]
          : "Not found";
      applicationTypeChanges();
    }
  }
);

const iconURLs = {
  Angular: "/assets/images/PegaAngular2.png",
  React: "/assets/images/PegaReact2.png",
  Cosmos: "/assets/images/PegaConst.png",
};

function applicationTypeChanges() {
  if (appDetails["applicationType"].toLocaleLowerCase().includes("starter")) {
    document.getElementById("pega-platform-version-container").style.display =
      "none";
    const constellationContainerElems = Array.from(
      document.getElementsByClassName("constellation-container")
    );
    constellationContainerElems.forEach((e) => (e.style.display = "none"));
  } else if (
    appDetails["applicationType"].toLocaleLowerCase().includes("sdk")
  ) {
    const constellationContainerElems = Array.from(
      document.getElementsByClassName("constellation-container")
    );
    constellationContainerElems.forEach((e) => (e.style.display = "none"));
  }

  if (appDetails["applicationType"].toLocaleLowerCase().includes("cosmos")) {
    appLogoElem.setAttribute("src", iconURLs.Cosmos);
    const dxElements = Array.from(document.getElementsByClassName("dx"));
    dxElements.forEach((e) => (e.style.display = "none"));
  } else if (
    appDetails["applicationType"].toLocaleLowerCase().includes("angular")
  ) {
    appLogoElem.setAttribute("src", iconURLs.Angular);
    thirdPartyHeadingElem.textContent = "Angular Version";
  } else if (
    appDetails["applicationType"].toLocaleLowerCase().includes("react")
  ) {
    thirdPartyHeadingElem.textContent = "React Version";
    appLogoElem.setAttribute("src", iconURLs.React);
  }
}
