var test = "";
var entries = performance.getEntriesByType("resource");

var entries = performance.getEntriesByType("resource");
var index = 1;
entries.map(function (entry) {
  if (entry.initiatorType === "script") {
    console.log("JS file from performance api :", entry.name);

    //getMainFile(entry.name);
    index++;
    test += "<li id= " + index + " >" + entry.name + "</li> " + "\n";
  }
});

/*chrome.runtime.sendMessage({
  from: "content_script_accessjs",
  subject: "showJS",
});*/

chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  if (msg.from === "popup" && msg.subject === "JSInfo") {
    var jsInfo = {
      total: test,
    };
    response(jsInfo);
  }
});
