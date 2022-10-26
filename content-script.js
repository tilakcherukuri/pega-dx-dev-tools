/* COSMOS-REACT-FINDER */
var timer = setInterval(() => {
  identifyCosmosReact()
}, 1000)
const identifyCosmosReact = () => {
  if (window.PCore && window.React) {
    pegaPlatformVersion = window.PCore.getPCoreVersion()
    window.postMessage({
      type: "FROM_INJECTED_SCRIPT",
      buildType: "pega-app",
    })
    clearInterval(timer)
  }
}
