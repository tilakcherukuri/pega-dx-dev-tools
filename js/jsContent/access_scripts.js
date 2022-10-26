document.addEventListener("DOMContentLoaded", () => {
  accessJS();

  var divElement = document.getElementById("FileContent");
  divElement.addEventListener("click", (ele) => {
    debugger;
    console.log(" Element clicked : " + ele);
    getMainFile(ele.target.textContent);
  });
  var copyButton = document.getElementById("copy");
  copyButton.addEventListener("click", (ele) => {
    console.log(" Element clicked : " + ele);
    copyJSContent();
  });
});

function accessJS() {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    function (tabs) {
      /*chrome.scripting.executeScript({
        target: { tabId: tabs[0].id, allFrames: true },
        files: ["content_script_accessjs.js"],
      });*/

      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          from: "popup",
          subject: "JSInfo",
        },
        function (response) {
          if (chrome.runtime.lastError) {
            // Something went wrong
            console.log("Whoops.. " + chrome.runtime.lastError.message);
            // Maybe explain that to the user too?
          } else {
            setJSInfo(response);
            // No errors, you can use entry
          }
        }
      );
    }
  );
}
function setJSInfo(info) {
  if (info !== undefined) {
    console.log(info.total);
    document.getElementById("FileContent").innerHTML = info.total;
  }
}

function getMainFile(jsFile) {
  //  TODO - this URL needs to be updated
  fetch(jsFile)
    .then((response) => response.text())
    .then((data) => {
      console.log("FileData" + data);
      document.getElementById("showJsContent").textContent = data;
      document.getElementById("textArea1").textContent = data;
    });
}
function copyJSContent() {
  const body = document.querySelector("body");
  const paragraph = document.querySelector("p");
  const area = document.createElement("textarea");
  body.appendChild(area);

  area.value = paragraph.innerText;
  area.select();
  document.execCommand("copy");

  body.removeChild(area);
}

function dragElement(element, direction, id1, id2) {
  var md
  const first = document.getElementById(id1)
  const second = document.getElementById(id2)

  element.onmousedown = onMouseDown

  function onMouseDown(e) {
    md = {
      e,
      offsetLeft: element.offsetLeft,
      offsetTop: element.offsetTop,
      firstWidth: first.offsetWidth,
      secondWidth: second.offsetWidth,
    }

    document.onmousemove = onMouseMove
    document.onmouseup = () => {
      document.onmousemove = document.onmouseup = null
    }
  }

  function onMouseMove(e) {
    var delta = { x: e.clientX - md.e.clientX, y: e.clientY - md.e.clientY }

    if (direction === "H") {
      delta.x = Math.min(Math.max(delta.x, -md.firstWidth), md.secondWidth)

      element.style.left = md.offsetLeft + delta.x + "px"
      first.style.width = md.firstWidth + delta.x + "px"
      second.style.width = md.secondWidth - delta.x + "px"
    }
  }
}

dragElement(document.getElementById("separator"), "H", "endpoint", "details")
dragElement(document.getElementById("separator2"), "H", "request", "response")

/*check logs*/
// this.addlog({
//   type: "info",
//   message: "form access_scripts",
//   timeStamp: new Date(),
// })
