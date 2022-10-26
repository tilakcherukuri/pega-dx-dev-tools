console.log("Insights loaded");
window.localStorage.removeItem("sync_q");
window.localStorage.removeItem("prev_sync_q");

var options = {
  series: [],
  chart: {
    height: 250,
    type: "rangeBar",
  },
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  noData: {
    text: "No data available",
  },
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

setInterval(() => {
  let sync_q = window.localStorage.getItem("sync_q");
  let low = 1000,
    high = 5;
  let prev_sync_q = window.localStorage.getItem("prev_sync_q");
  if (sync_q && prev_sync_q !== sync_q) {
    window.localStorage.setItem("prev_sync_q", sync_q);
    const syncs = JSON.parse(sync_q);
    debugger;
    console.table("Syncs Received --->");
    let data_series = [];
    syncs.map(async (item) => {
      console.log(item);
      //Updating the network table
      showlatencyData(item);
      //Pushing graph data
      data_series.push({
        x: item.url,
        y: [
          (parseFloat(item.time) / 1000).toFixed(2),
          (parseFloat(item.time) / 1000).toFixed(2) + 20,
        ],
      });
      rerenderChart(data_series);
      //Updating High/Low latencies
      if (item.time < low) {
        low = item.time;
        renderlatencyTextLinks(item, "LOW");
      } else if (item.time > high) {
        high = item.time;
        renderlatencyTextLinks(item, "HIGH");
      }
    });
  } else if (prev_sync_q === sync_q) {
    console.info("Syncs Matched with Previous queue, Page updated skipped .. ");
  }
}, 1000);

let renderlatencyTextLinks = async (item, type) => {
  let itemStatus = item.res_stats + "";
  let cssClass = "text-info";
  if (itemStatus.startsWith("2")) {
    cssClass = "text-success";
  } else if (itemStatus.startsWith("4") || itemStatus.startsWith("5")) {
    cssClass = "text-danger";
  }
  if (type === "HIGH") {
    let div = document.getElementById("highestLoad");
    let html = `<div class="alert alert-warning" role="alert">${
      item.url
    } Time taken: <b>${(parseFloat(item.time) / 1000).toFixed(2)}sec</b></div>`;
    html = html.trim();
    div.innerHTML = html;
  }
  if (type === "LOW") {
    let div = document.getElementById("lowestLoad");
    let html = `<div class="alert alert-success" role="alert">${
      item.url
    } Time taken: <b>${(parseFloat(item.time) / 1000).toFixed(2)}sec</b></div>`;
    html = html.trim();
    div.innerHTML = html;
  }
};

let rerenderChart = (data_series) => {
  chart.updateSeries([
    {
      data: data_series,
    },
  ]);
};

let showlatencyData = async (item) => {
  let itemStatus = item.res_stats + "";
  let cssClass = "text-info";
  if (itemStatus.startsWith("2")) {
    cssClass = "text-success";
  } else if (itemStatus.startsWith("4") || itemStatus.startsWith("5")) {
    cssClass = "text-danger";
  }
  var tr = document.createElement("tr");
  var tds = `<td style="max-width:180px">${item.url}</td>
      <td class="${cssClass}">${item.res_stats}/${item.res_code}</td>
      <td>${(parseFloat(item.time) / 1000).toFixed(2)} Sec</td>
      <td>${new Date().toUTCString()}</td>`;
  tds = tds.trim();
  tr.innerHTML = tds;
  let table = document.getElementById("networktable");
  table.getElementsByTagName("tbody")[0].prepend(tr);
};

let showEmptyDatas = () => {
  let div = document.getElementById("highestLoad");
  let html = `<div class="alert alert-warning" role="alert"> -- No Data available -- </div>`;
  html = html.trim();
  div.innerHTML = html;

  let div2 = document.getElementById("lowestLoad");
  let html2 = `<div class="alert alert-success" role="alert"> -- No Data available --</div>`;
  html2 = html2.trim();
  div2.innerHTML = html2;
};

showEmptyDatas();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "networkdata") {
    console.log("listened to message", request);
  }
});
