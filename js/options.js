/////////////////// Options ///////////////////
var msg = document.getElementById("msg");
var tblmsg = document.getElementById("tblmsg");

// Saves options to chrome.storage
function save_options() {
  var scriptsPrefSelection      = document.getElementById('Scripts').checked;
  var consolePrefSelection      = document.getElementById('Console').checked;
  var notificationSelection     = document.getElementById('notifyuser').checked;
  var tblObjPreferences         = document.getElementById("tbl").innerHTML;
  var selectedServiceUrlValue   = "";
  
  // Identify the selected serviceurl
  var table = document.getElementById("tbl");
  for (i=1; i<table.rows.length; i++) {
    cell = table.rows[i].cells[0];
    for (j=0; j<cell.childNodes.length; j++) { 
      if (cell.childNodes[j].type	 =="radio") {
        if (cell.childNodes[j].checked) {    
            console.log("Selected Row found, Row Number: " + i + " Value = "+ (table.rows[i].cells[2].innerText));
            selectedServiceUrlValue = table.rows[i].cells[2].innerText;
        } 
      }
    }
  }

  // Save Tab options & Notifications preferences
  chrome.storage.sync.set({
    tblObjPreferencesValue    : tblObjPreferences,
    scriptsSelectionValue     : scriptsPrefSelection,
    consoleSelectionValue     : consolePrefSelection,
    notificationSelection     : notificationSelection,
    selectedServiceUrl        : selectedServiceUrlValue
  }, function() {
    // Update status to let user know options were saved.
    msg.innerHTML = "&#10004; Preferences Saved Successfully";
    setTimeout(function() {
        msg.innerHTML = "";
    }, 1500);
    
    // Dispaly chrome storage values
    chrome.storage.sync.get(null, function(items){
      console.log("Storage Data : \n" + JSON.stringify(items));
    });
  });
}
  
// Restore options from chrome.storage
function restore_options(event) {
      
  // Use default value for preferences
  chrome.storage.sync.get(null, function(items) {
    document.getElementById('Scripts').checked      = items.scriptsSelectionValue;
    document.getElementById('Console').checked      = items.consoleSelectionValue;
    document.getElementById('notifyuser').checked   = items.notificationSelection;
    if (items.tblObjPreferencesValue != undefined) {
      document.getElementById('tbl').innerHTML      = items.tblObjPreferencesValue;
      loadButtonActions();
    }
    console.log("Retrieving Chrome Storage = " + JSON.stringify(items));
  });

  loadButtonActions();
}

// Reset options in chrome.storage
function reset_options() {
  // Reset chrome storage
  chrome.storage.sync.clear();
  
  // Rest to the default table
  var tblDef = "<thead class='tblHdr'><tr><th style='color:#000'>❑❑</th><th>Environment*</th><th>Service URL*</th><th colspan='2'>Actions</th></tr></thead><tbody id='tblbody'><tr><td class='td-data'></td><td class='td-data'><input type='text' class='tblInput servtype' id='txtenv_defname' placeholder='Environment' value=''></td><td class='td-data'><input type='text' class='tblInput servurl' id='txtservice_defurl' placeholder='Service URL' value=''></td><td class='td-data'><button id='btnaddRow' class='tblBtnAddClass'>✚</button></td><td class='td-data'></td></tr></tbody>";
    
  chrome.storage.sync.set({
    scriptsSelectionValue     : false,
    consoleSelectionValue     : false,
    tblObjPreferencesValue    : tblDef,
    selectedServiceUrl        : "",
    notificationSelection     : true
  }, function() {
    // Rest the checkboxes to default
    restore_options();
    
    // Update status to let user know options were saved.
    msg.innerHTML = "&#10004; Preferences Reset Successfully";
    setTimeout(function() {
      msg.innerHTML = "";
    }, 1500);
  });
  
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('saveBtn').addEventListener('click', save_options);
document.getElementById('resetBtn').addEventListener('click', reset_options);
document.getElementById('notifyuser').addEventListener('onchange', save_notification_preferences);
document.getElementById('btnaddRow').addEventListener('click', addRow);

function save_notification_preferences() {
  var notify = document.getElementById('notifyuser').checked;
  console.log("save_notification_preferences : " + notify); 
}

function CreateUniqueID() {
  const ID = Date.now();
  return ID;
}

function addRow(event) {
  console.log("addRow");

  var table = document.getElementById("tbl");
  if (table.rows.length == 7) { 
    tblmsg.innerHTML = "&#9888; Exceeded the limit";
    setTimeout(function() {
      tblmsg.innerHTML = "";

      // Clear the fields
      document.getElementById('txtenv_defname').value = "";
      document.getElementById('txtservice_defurl').value = "";
    }, 1500);

    return; 
  }
  var rowID = CreateUniqueID();
  var txtenv_name = document.getElementById("txtenv_defname").value;
  if (!txtenv_name) {
    tblmsg.innerHTML = "&#9888; Environment name can't be blank";
    setTimeout(function() {
      tblmsg.innerHTML = "";
    }, 1500);
      return false;
  }

  var txtservice_url = document.getElementById("txtservice_defurl").value;
  if (!txtservice_url) {
    tblmsg.innerHTML = "&#9888; Service url can't be blank";
    setTimeout(function() {
      tblmsg.innerHTML = "";
    }, 1500);
    return false;
  }

  var tableRow = "<tr Id='" + rowID + "'>"
  + "<td class='td-data'><input type='radio' name='btnSelectedRow' id='btnSelectedRow'></td>"
  + "<td class='td-data'><span id='txtenv_name'>" + txtenv_name + "</span></td>"
  + "<td class='td-data'><span id='txtservice_url'>" + txtservice_url + "</span></td>"
  + "<td class='td-data'>" + "<button id='btnShowEditRow' class='tblBtnEditClass'>&#9998;</button>" + "</td>"
  + "<td class='td-data'>" + "<button id='btnDeleteRow' class='tblBtnDelClass'>&#10006;</button>" + "</td>"
  + "</tr>";

  var body = document.getElementById('tblbody');
  var rows = body.rows;

  // pick the last and prepend
  rows[rows.length - 1].insertAdjacentHTML('beforebegin', tableRow);
  document.getElementById('txtenv_defname').value = "";
  document.getElementById('txtservice_defurl').value = "";

  loadButtonActions();
};

function showEditRow(event) {
  console.log("showEditRow");
  var rowdataId = event.target.parentNode.parentNode.id;
  var dataRow = document.getElementById(rowdataId);
  var data = dataRow.querySelectorAll(".td-data");

  var envname = data[1].innerText;
  var servurl = data[2].innerText;
  console.log("showEditRow :: envname="+envname+" servurl="+servurl);

  data[0].innerHTML = '<input name="btnSelectedRow" id="btnSelectedRow" type="radio" checked/>';
  data[1].innerHTML = '<input name="txtenv_name" class="tblInput servtype" id="txtenv_name" value="' + envname + '"/>';
  data[2].innerHTML = '<input name="txtservice_url" class="tblInput servurl" id="txtservice_url" value="' + servurl + '"/>';
  data[3].innerHTML = "<button id='btnUpdateData' class='tblBtnEditClass'>&#10004;</button>";
  data[4].innerHTML = "<button id='btnDeleteRow' class='tblBtnDelClass'>&#10006;</button>";

  loadButtonActions();
}

function deleteRow(event) {
  console.log("deleteRow");
  var rowdataId = event.target.parentNode.parentNode.id;
  document.getElementById(rowdataId).remove();

  loadButtonActions();
}

function updateData(event) {
  console.log("updateDataRow");
  var rowdataId = event.target.parentNode.parentNode.id;
  var dataRow = document.getElementById(rowdataId); 
  var datatr = dataRow.querySelectorAll(".td-data");

  var envname = datatr[1].querySelector('input[id="txtenv_name"]').value;
  var servurl = datatr[2].querySelector('input[id="txtservice_url"]').value;
  console.log("updateDataRow :: radio=checked" + " envname="+envname+" servurl="+servurl);

  if (!envname) {
    tblmsg.innerHTML = "&#9888; Environment name can't be blank";
    setTimeout(function() {
      tblmsg.innerHTML = "";
    }, 1500);
    return false;
  }
  if (!servurl) {
    tblmsg.innerHTML = "&#9888; Service url can't be blank";
    setTimeout(function() {
      tblmsg.innerHTML = "";
    }, 1500);
    return false;
  }
    
  datatr[0].innerHTML = '<input name="btnSelectedRow" id="btnSelectedRow" type="radio" checked/>';
  datatr[1].innerHTML = "<span id='txtenv_name'>" + envname + "</span>";
  datatr[2].innerHTML = "<span id='txtservice_url'>" + servurl + "</span>";
  datatr[3].innerHTML = "<button id='btnShowEditRow' class='tblBtnEditClass'>&#9998;</button>";
  datatr[4].innerHTML = "<button id='btnDeleteRow' class='tblBtnDelClass'>&#10006;</button>";

  loadButtonActions();
}

function selectRow(event) {
  console.log("selectRow");
  var rowdataId = event.target.parentNode.parentNode.id;
  var dataRow = document.getElementById(rowdataId); 
  var datatr = dataRow.querySelectorAll(".td-data");

  var selenv, selservurl;
  var selrbs = document.getElementsByName('btnSelectedRow');
  for(var i = 0; i < selrbs.length; i++){
    if(selrbs[i].checked){
        selrb = selrbs[i].value;
        selenv = datatr[1].innerText;
        selservurl = datatr[2].innerText;
        chrome.storage.sync.set({
          'selectedServiceUrl'  : selservurl
        });

        datatr[0].innerHTML = "<input type='radio' name='btnSelectedRow' id='btnSelectedRow' checked>";
	      datatr[1].innerHTML = "<span id='txtenv_name'>" + selenv + "</span>";
	      datatr[2].innerHTML = "<span id='txtservice_url'>" + selservurl + "</span>";
        datatr[3].innerHTML = "<button id='btnShowEditRow' class='tblBtnEditClass'>&#9998;</button>";
        datatr[4].innerHTML = "<button id='btnDeleteRow' class='tblBtnDelClass'>&#10006;</button>";

        loadButtonActions();
        console.log("selectRow :: sel_rb= "+selrb+" sel_env= "+selenv+" sel_serv_url= "+selservurl);
    }
  }
}

function loadButtonActions() {
  console.log("loadButtonActions");

  // load ShowEdit Buttons
  const tabShowEditRowButtons = document.querySelectorAll('[id="btnShowEditRow"]');
  tabShowEditRowButtons.forEach((button) => {
    button.addEventListener("click", showEditRow);
  });

  // load DeleteRow Buttons
  const tabDeleteRowButtons = document.querySelectorAll('[id="btnDeleteRow"]');
  tabDeleteRowButtons.forEach((button) => {
    button.addEventListener("click", deleteRow);
  });

  // load UpdateRow Buttons
  const tabUpdateRowButtons = document.querySelectorAll('[id="btnUpdateData"]');
  tabUpdateRowButtons.forEach((button) => {
    button.addEventListener("click", updateData);
  });

  // load SelectRow Buttons
  const tabSelectedRowButtons = document.querySelectorAll('[id="btnSelectedRow"]');
  tabSelectedRowButtons.forEach((button) => {
    button.addEventListener("click", selectRow);
  });

  // load AddRow Buttons
  const tabAddRowButtons = document.querySelectorAll('[id="btnaddRow"]');
  tabAddRowButtons.forEach((button) => {
    button.addEventListener("click", addRow);
  });

}

// Read the selectedServiceUrl
chrome.storage.sync.get('selectedServiceUrl', function(res){
  console.log("Selected Service URL :: " + res.selectedServiceUrl);
});