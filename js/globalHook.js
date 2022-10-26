let issconstellationFileAvailable = false
const identifyAppType = () => {
  var entries = performance.getEntriesByType("resource")
  const bundleFileForReact = entries.find((entry) =>
    entry.name.trim().replaceAll(" ", "").includes("bundle.js")
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
        }
        if (bundle.includes("sp-r")) {
          chrome.runtime.sendMessage({
            buildType: "pega-app",
            appType: "Pega React Starter Pack",
          })
        }
      } else {
        /* react app is not pega based */
        chrome.runtime.sendMessage({
          buildType: "disabled",
        })
      }
    })
  } else if (constellationFileForCosmos) {
    issconstellationFileAvailable = true
  } else {
    chrome.runtime.sendMessage({
      buildType: "disabled",
    })
  }
}

const fetchFileData = (jsFile) => {
  return fetch(jsFile).then((response) => response.text())
}

/* START INJECT CONTENT SCRIPT */
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
injectScript(chrome.runtime.getURL("content-script.js"), "body")

/* END INJECT CONTENT SCRIPT */

window.addEventListener(
  "message",
  function (event) {
    if (event.data.type && event.data.type == "FROM_INJECTED_SCRIPT") {
      /* COSMOS -REACT */
      if (event.data.buildType && issconstellationFileAvailable) {
        chrome.runtime.sendMessage({
          buildType: "pega-app",
          appType: "Cosmos React",
        })
      }
    }
  },
  false
)

/* Identify the build type*/
identifyAppType()
