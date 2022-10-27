const renderNeedHelp=()=>{

    chrome.storage.local.get([
        'applicationType'
        
        ], function(res){
          chrome.runtime.sendMessage({
            type: "log",
            log: {
              type: "Info",
              message: "Need Help Tab Intializing ...",
              timestamp: new Date(),
            },
          });
            var check=res.applicationType;
            console.log('Need Help Page',res.applicationType);
            if (res.applicationType=="Cosmos React"){
      
              document.getElementById("notPega").style.display = "none";
              document.getElementById("angularStarter").style.display = "none";
              document.getElementById("angularSDK").style.display = "none";
              document.getElementById("reactStarter").style.display = "none";
              document.getElementById("reactSDK").style.display = "none";
              document.getElementById("cosmosReact").style.display = "block";
              }

              else if (res.applicationType=="Pega React SDK"){
                
                document.getElementById("notPega").style.display = "none";
              document.getElementById("angularStarter").style.display = "none";
              document.getElementById("angularSDK").style.display = "none";
              document.getElementById("reactStarter").style.display = "none";
              document.getElementById("reactSDK").style.display = "block";
              document.getElementById("cosmosReact").style.display = "none";
              }
              else if (res.applicationType=="Pega React Starter Pack"){
      
                document.getElementById("notPega").style.display = "none";
              document.getElementById("angularStarter").style.display = "none";
              document.getElementById("angularSDK").style.display = "none";
              document.getElementById("reactStarter").style.display = "block";
              document.getElementById("reactSDK").style.display = "none";
              document.getElementById("cosmosReact").style.display = "none";
              }
              else if (res.applicationType=="Pega Angular SDK"){
                
                document.getElementById("notPega").style.display = "none";
              document.getElementById("angularStarter").style.display = "none";
              document.getElementById("angularSDK").style.display = "block";
              document.getElementById("reactStarter").style.display = "none";
              document.getElementById("reactSDK").style.display = "none";
              document.getElementById("cosmosReact").style.display = "none";
              }
               else if (res.applicationType=="Pega Angular Starter Pack"){
                
                document.getElementById("notPega").style.display = "none";
              document.getElementById("angularStarter").style.display = "block";
              document.getElementById("angularSDK").style.display = "none";
              document.getElementById("reactStarter").style.display = "none";
              document.getElementById("reactSDK").style.display = "none";
              document.getElementById("cosmosReact").style.display = "none";
              }
              
              else{
                document.getElementById("notPega").style.display = "block";
                document.getElementById("angularStarter").style.display = "none";
                document.getElementById("angularSDK").style.display = "none";
                document.getElementById("reactStarter").style.display = "none";
                document.getElementById("reactSDK").style.display = "none";
                document.getElementById("cosmosReact").style.display = "none";
                }
                chrome.runtime.sendMessage({
                  type: "log",
                  log: {
                    type: "Info",
                    message: "Need Help Tab Setup Completed",
                    timestamp: new Date(),
                  },
                });
        }
    )
}

renderNeedHelp();









