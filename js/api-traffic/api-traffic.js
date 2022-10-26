function dragElement(element, direction, id1, id2)
{
    var   md; 
    const first  = document.getElementById(id1);
    const second = document.getElementById(id2);

    element.onmousedown = onMouseDown;

    function onMouseDown(e)
    {
        md = {e,
              offsetLeft:  element.offsetLeft,
              offsetTop:   element.offsetTop,
              firstWidth:  first.offsetWidth,
              secondWidth: second.offsetWidth
             };

        document.onmousemove = onMouseMove;
        document.onmouseup = () => {
            document.onmousemove = document.onmouseup = null;
        }
    }

    function onMouseMove(e)
    {
        var delta = {x: e.clientX - md.e.clientX,
                     y: e.clientY - md.e.clientY};

        if (direction === "H" )
        {
            delta.x = Math.min(Math.max(delta.x, -md.firstWidth),
                       md.secondWidth);

            element.style.left = md.offsetLeft + delta.x + "px";
            first.style.width = (md.firstWidth + delta.x) + "px";
            second.style.width = (md.secondWidth - delta.x) + "px";
        }
    }
}


dragElement( document.getElementById("separator"), "H" , "endpoint","details");
<<<<<<< Updated upstream
dragElement( document.getElementById("separator2"), "H" , "request","response");
=======
dragElement( document.getElementById("separator2"), "H" , "request","response");


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "networkdata") {
      console.log("API Traffic", request);
     
    }
  });
>>>>>>> Stashed changes
