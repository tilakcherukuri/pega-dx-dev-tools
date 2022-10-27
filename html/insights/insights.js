console.info("*********Insights loaded***********");
window.localStorage.removeItem("lowest_val");
window.localStorage.removeItem("highest_val");
window.localStorage.removeItem("sync_q");
const MAX_ITEM_TO_DISPLAY_IN_GRAPH = 15;

var options = {
  series: [],
  chart: {
    height: 280,
    type: "bar",
    zoom: {
      enabled: true,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  noData: {
    text: "No data available",
  },
  xaxis: {
    type: "numeric",
    tickAmount: 1,
    title: {
      text: "in Milliseconds",
    },
    labels: {
      show: true,
    },
  },
  yaxis: {
    reversed: true,
    labels: {
      show: true,
      minWidth: 0,
      maxWidth: 300,
      style: {
        colors: [],
        fontSize: "10px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: 600,
        cssClass: "apexcharts-yaxis-label",
      },
      offsetX: 0,
      offsetY: 0,
      rotate: 0,
    },
  },
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

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
    } Time taken: <b>${parseInt(item.time)}ms</b></div>`;
    html = html.trim();
    div.innerHTML = html;
  }
  if (type === "LOW") {
    let div = document.getElementById("lowestLoad");
    let html = `<div class="alert alert-success" role="alert">${
      item.url
    } Time taken: <b>${parseInt(item.time)}ms</b></div>`;
    html = html.trim();
    div.innerHTML = html;
  }
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
      <td class="${cssClass}">${item.res_stats}${
    item.res_code ? "/" + item.res_code : ""
  }</td>
      <td>${parseInt(item.time)} ms</td>
      <td>${item.startedDateTime}</td>`;
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

let rerenderChart = (data_series) => {
  console.log("RenderChart", data_series);
  chart.updateSeries([
    {
      data: data_series,
    },
  ]);
};

let renderNewInsights = async (item) => {
  console.table("renderNewInsights --->", item);

  let low = window.localStorage.getItem("lowest_val")
    ? parseFloat(window.localStorage.getItem("lowest_val"))
    : 900000;
  let high = window.localStorage.getItem("highest_val")
    ? parseFloat(window.localStorage.getItem("highest_val"))
    : 5;
  //Updating the network table
  showlatencyData(item);
  //Pushing graph data
  let data_series = [];
  let sync_q = window.localStorage.getItem("sync_q");
  if (sync_q) {
    sync_q = JSON.parse(sync_q);
    data_series.push(...sync_q);
  }
  if (data_series.length > MAX_ITEM_TO_DISPLAY_IN_GRAPH - 1) {
    data_series.splice(0, 1);
  }
  //let url = item.url && item.url.split("/api") && item.url.split("/api")[1];
  data_series.push({
    x: item.url,
    y: parseInt(item.time),
    fillColor:
      "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0"),
  });
  window.localStorage.setItem("sync_q", JSON.stringify(data_series));
  rerenderChart(data_series);
  //Updating High/Low latencies
  if (item.time < low) {
    window.localStorage.setItem("lowest_val", item.time);
    renderlatencyTextLinks(item, "LOW");
  } else if (item.time > high) {
    window.localStorage.setItem("highest_val", item.time);
    renderlatencyTextLinks(item, "HIGH");
  }
};

chrome.runtime.onMessage.addListener(function (request) {
  if (request.type === "networkdata") {
    console.info("listened to message", request);
    let req_obj = request.details_filtered;
    if (req_obj) {
      renderNewInsights(req_obj);
    }
  }
});
