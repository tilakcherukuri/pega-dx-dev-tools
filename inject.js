let pegaPlatformURL = "";
let applicationVersion = "";
let thirdPartyComponentVersion = "";
let pegaPlatformVersion = "";

window.addEventListener("_SDK_Details_", function (e) {
  document.addEventListener("ConstellationReady", () => {
    window.PCore.onPCoreReady((e) => {
      pegaPlatformVersion = PCore.getPCoreVersion();
      window.postMessage({
        type: "FROM_INJECTED_SCRIPT",
        pegaPlatformURL,
        applicationVersion,
        thirdPartyComponentVersion,
        pegaPlatformVersion,
      });
    });
  });
});

// var timer = setInterval(() => {
//   forCosmosReact();
// }, 1000);
// const forCosmosReact = () => {
//   console.log("*********");
//   if (window.PCore) {
//     console.log("*********", window.PCore.getPCoreVersion());
//     PCore.getPubSubUtils().subscribe((res) => {
//       console.log(res);
//     });
//     pegaPlatformVersion = window.PCore.getPCoreVersion();
//     window.postMessage({
//       type: "FROM_INJECTED_SCRIPT",
//       pegaPlatformURL,
//       applicationVersion,
//       thirdPartyComponentVersion,
//       pegaPlatformVersion,
//     });
//     clearInterval(timer);
//   }
// };

/* COSMOS-REACT-FINDER */
var timer = setInterval(() => {
  identifyCosmosReact();
}, 1000);
const identifyCosmosReact = () => {
  if (window.PCore && window.React) {
    pegaPlatformVersion = window.PCore.getPCoreVersion();
    window.postMessage({
      type: "FROM_INJECTED_SCRIPT",
      pegaPlatformURL,
      applicationVersion,
      thirdPartyComponentVersion,
      pegaPlatformVersion,
    });
    clearInterval(timer);
  }
};

window.addEventListener("_Angular_Details_", function (e) {
  if (window.ng) {
    const rootElem = document.querySelector("[ng-version]");

    pegaPlatformURL =
      window.ng.getComponent(rootElem).authservice.authUrl ?? "Not Found";
    if (pegaPlatformURL != "Not Found") {
      pegaPlatformURL = pegaPlatformURL.substr(
        0,
        pegaPlatformURL.indexOf("/api")
      );
    }

    thirdPartyComponentVersion =
      rootElem.getAttribute("ng-version") ?? "Not Found";

    applicationVersion =
      window.ng.getComponent(document.getElementsByTagName("app-navigation")[0])
        .version ?? "Not Found";
  }
  window.postMessage({
    type: "FROM_INJECTED_SCRIPT",
    pegaPlatformURL,
    applicationVersion,
    thirdPartyComponentVersion,
    pegaPlatformVersion,
  });
});
