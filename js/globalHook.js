let issconstellationFileAvailable = false
let pegaPlatformVersion = ""
let pegaPlatformURL = ""
let applicationVersion = ""
let thirdPartyComponentVersion = ""
let applicationType = ""
let constellationURL = ""
let activeTabId = ""

// *************************** Sets values to local storage *************************************
function setValuesToLocalStorage(activeTabId) {
  chrome.storage.local.set({
    activeTabId,
    thirdPartyComponentVersion,
    pegaPlatformURL,
    applicationVersion,
    applicationType,
    constellationURL,
    pegaPlatformVersion,
  })
}

//************************************** Identifies the type of app********************************** */
const identifyAppType = () => {
  // Dummy Message to get Tab ID
  chrome.runtime.sendMessage({ text: "Get Active Tab ID" }, (tabId) => {
    //console.log(tabId);
    activeTabId = tabId.tab
  })

  var entries = performance.getEntriesByType("resource")
  const bundleFileForReact = entries.find(
    (entry) =>
      entry.name.trim().replaceAll(" ", "").includes("bundle.js") ||
      entry.name.trim().replaceAll(" ", "").includes("main")
  )
  const mainFileForAngular = entries.find((entry) =>
    entry.name.trim().replaceAll(" ", "").includes("main.js")
  )
  const constellationFileForCosmos = entries.find((entry) =>
    entry.name.trim().replaceAll(" ", "").includes("pega-bootstrap-component")
  )
  // React SDK / React SP
  if (bundleFileForReact) {
    fetchFileData(bundleFileForReact.name).then((res) => {
      const bundle = res.toLocaleLowerCase()
      if (bundle.includes("pega")) {
        if (bundle.includes("sdk")) {
          chrome.runtime.sendMessage({
            buildType: "pega-app",
            appType: "Pega React SDK",
          })
          getReactSDKDetails(bundle)
        } else if (bundle.includes("sp-r")) {
          chrome.runtime.sendMessage({
            buildType: "pega-app",
            appType: "Pega React Starter Pack",
          })
          console.log("************bundle", bundleFileForReact.name)
          if (bundleFileForReact.name.includes("main")) {
            getReactSPDetailsForProd(bundle)
          } else {
            getReactSPDetails(bundle)
          }
        }
      } else {
        /* react app is not pega based */
        setNotSupportedData()
      }
    })
  } // Angular SDK / Angular SP
  else if (mainFileForAngular) {
    fetchFileData(mainFileForAngular.name).then((res) => {
      const main = res.toLocaleLowerCase()
      if (main.includes("pega")) {
        if (main.includes("sdk")) {
          chrome.runtime.sendMessage({
            reactBuildType: "pega-app",
            appType: "Pega Angular SDK",
          })
          getAngularSDKDetails(main)
        } else if (main.includes("sp-a")) {
          chrome.runtime.sendMessage({
            reactBuildType: "pega-app",
            appType: "Pega Angular Starter Pack",
          })
          getAngularSPDetails()
        }
      } else {
        // angular app is not pega based

        setNotSupportedData()
      }
    })
  } else if (constellationFileForCosmos) {
    chrome.runtime.sendMessage({
      buildType: "pega-app",
      appType: "Cosmos React",
    })
    issconstellationFileAvailable = true
    getPegaCosmosDetails()
  } else {
    setNotSupportedData()
  }
}

const fetchFileData = (jsFile) => {
  return fetch(jsFile).then((response) => response.text())
}

/********************************************** START INJECT CONTENT SCRIPT *******************************/
/**
 * injectScript - Inject internal script to available access to the `window`
 *
 * @param  {type} file_path Local path of the internal script.
 * @param  {type} tag The tag as string, where the script will be append (default: 'body').
 * @see    {@link http://stackoverflow.com/questions/20499994/access-window-variable-from-content-script}
 */
function injectScript(file_path, tag) {
  var node = document.getElementsByTagName(tag)[0]
  var script = document.createElement("script")
  script.setAttribute("type", "text/javascript")
  script.setAttribute("src", file_path)
  node.appendChild(script)
}
injectScript(chrome.runtime.getURL("inject.js"), "body")

/* END INJECT CONTENT SCRIPT */

/* Identify the build type*/
identifyAppType()

function setNotSupportedData() {
  applicationType = "Not Supported"
  setValuesToLocalStorage(activeTabId)
  chrome.runtime.sendMessage({
    buildType: "disabled",
  })
}

// ***************************** React SP ***********************************************************
function getReactSPDetails(bundle) {
  applicationType = "Pega React Starter Pack"
  const indexOfReactVersion = bundle.indexOf("reactversion =") + 15
  thirdPartyComponentVersion = bundle.substring(
    indexOfReactVersion,
    bundle.indexOf(";", indexOfReactVersion)
  )
  thirdPartyComponentVersion = thirdPartyComponentVersion.replaceAll("'", "")
  const indexOfSPRVersion = bundle.indexOf("sp-r") + 4
  applicationVersion =
    "SP-R" +
    bundle.substring(indexOfSPRVersion, bundle.indexOf('"', indexOfSPRVersion))

  const indexOfURL = bundle.indexOf("pegaurl:") + 9
  pegaPlatformURL = bundle.substring(
    indexOfURL,
    bundle.indexOf(",", indexOfURL)
  )
  pegaPlatformURL = pegaPlatformURL.replaceAll('"', "")
  setValuesToLocalStorage(activeTabId)
}
/* Function for Prod mode React-Starter-pack */
function getReactSPDetailsForProd(bundle) {
  applicationType = "Pega React Starter Pack"

  thirdPartyComponentVersion = "17.0.2 *"
  const indexOfSPRVersion = bundle.indexOf("sp-r") + 4
  applicationVersion =
    "SP-R" +
    bundle.substring(indexOfSPRVersion, bundle.indexOf('"', indexOfSPRVersion))

  const indexOfURL = bundle.indexOf("pegaurl:") + 9
  pegaPlatformURL = bundle.substring(
    indexOfURL,
    bundle.indexOf(",", indexOfURL)
  )
  pegaPlatformURL = pegaPlatformURL.replaceAll('"', "")
  setValuesToLocalStorage(activeTabId)
}

// *********************************************React SDK ************************************************
function getReactSDKDetails(bundle) {
  window.dispatchEvent(
    new CustomEvent("_SDK_Details_", {
      detail: {
        message: "React Data",
      },
    })
  )
  applicationType = "Pega React SDK"
  const indexOfReactVersion = bundle.indexOf("reactversion =") + 15
  thirdPartyComponentVersion = bundle.substring(
    indexOfReactVersion,
    bundle.indexOf(";", indexOfReactVersion)
  )
  thirdPartyComponentVersion = thirdPartyComponentVersion.replaceAll("'", "")
  const indexOfSDKVersion = bundle.indexOf("sdkversion =") + 12
  applicationVersion = bundle.substring(
    indexOfSDKVersion,
    bundle.indexOf(";", indexOfSDKVersion)
  )
  applicationVersion = applicationVersion.replaceAll('"', "")

  fetchFileData("sdk-config.json").then((data) => {
    const dt = JSON.parse(data)
    pegaPlatformURL = dt["serverConfig"]["infinityRestServerUrl"]
  })
}

// ************************************************ Angular SP ***********************************
function getAngularSPDetails() {
  window.dispatchEvent(
    new CustomEvent("_Angular_Details_", {
      detail: {
        message: "Angular Data",
      },
    })
  )
  applicationType = "Pega Angular Starter Pack"
}

// ********************************* Connect to content.js file ***************************************

window.addEventListener(
  "message",
  function (event) {
    if (event.data.type && event.data.type == "FROM_INJECTED_SCRIPT") {
      pegaPlatformURL =
        event.data.pegaPlatformURL != ""
          ? event.data.pegaPlatformURL
          : pegaPlatformURL
      applicationVersion =
        event.data.applicationVersion != ""
          ? event.data.applicationVersion
          : applicationVersion
      thirdPartyComponentVersion =
        event.data.thirdPartyComponentVersion != ""
          ? event.data.thirdPartyComponentVersion
          : thirdPartyComponentVersion
      pegaPlatformVersion = event.data.pegaPlatformVersion
      setValuesToLocalStorage(activeTabId)
    }
  },
  false
)

// *********************************** Cosmos ******************************************************
function getPegaCosmosDetails() {
  applicationType = "Cosmos React"
}

// ******************************************** Angular SDK *************************************
function getAngularSDKDetails(main) {
  applicationType = "Pega Angular SDK"
  const indexOfSDKVersion = main.indexOf("sdkversion =") + 12
  applicationVersion = main.substring(
    indexOfSDKVersion,
    main.indexOf(";", indexOfSDKVersion)
  )

  applicationVersion = applicationVersion.replaceAll('"', "")

  const rootElem = document.querySelector("[ng-version]")
  thirdPartyComponentVersion =
    rootElem.getAttribute("ng-version") ?? "Not Found"

  window.dispatchEvent(
    new CustomEvent("_SDK_Details_", {
      detail: {
        message: "Angular Data",
      },
    })
  )

  fetchFileData("sdk-config.json").then((data) => {
    const dt = JSON.parse(data)
    pegaPlatformURL = dt["serverConfig"]["infinityRestServerUrl"]
  })
}
