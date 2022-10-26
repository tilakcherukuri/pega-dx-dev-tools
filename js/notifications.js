var notifications_options = {
    type: "basic",
    title: "",
    message: "",
    iconUrl: "/assets/images/logo.png"
};  

var notification_preferences = false;
var selectedServiceUrlValue = "";

chrome.storage.sync.get([
'notficationSelection',
'selectedServiceUrl'
], function(res){
    notification_preferences = res.notificationSelection;
    selectedServiceUrlValue = res.selectedServiceUrl;
});

function publishnotification(notifications_options, notification_preferences){
    if(notification_preferences){
        chrome.notifications.create(notifications_options, function(){
            console.log("Triggered Notification Successfully!");
        });
    }else{
        console.log("Notification are in Silent");
    }

}