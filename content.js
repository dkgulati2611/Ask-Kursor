var floatingWindow = null;

function createFloatingWindow(text) {
  // var selection = window.getSelection().getRangeAt(0);
  floatingWindow = document.createElement("div");
  floatingWindow.setAttribute("id", "askKursorFloatingWindow");
  floatingWindow.style.position = "absolute";
  floatingWindow.style.border = "1px solid black";
  floatingWindow.style.padding = "5px";
  floatingWindow.style.background = "#ffffff";
  floatingWindow.style.color = "black";
  floatingWindow.style.zIndex = "9999";
  floatingWindow.style.maxWidth = "400px";
  floatingWindow.style.boxShadow = "3px 3px 5px 0px rgba(0,0,0,0.75)";
  floatingWindow.style.top = 450 + "px";
  floatingWindow.style.left = 500 + "px";
  floatingWindow.innerHTML =
    "<p>" +
    text +
    "</p><div><button id='askKursorCopyButton'>Copy</button><button id='askKursorEditButton'>Edit</button><button id='askKursorShareButton'>Share</button><button id='askKursorCloseButton'>Close</button></div>";
  document.body.appendChild(floatingWindow);
  var copyButton = document.getElementById("askKursorCopyButton");
  copyButton.onclick = function () {
    var temp = document.createElement("textarea");
    document.body.appendChild(temp);
    temp.value = text;
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
  };
  var editButton = document.getElementById("askKursorEditButton");
  editButton.onclick = function () {
    var editableText = document.createElement("textarea");
    editableText.setAttribute("id", "askKursorEditableText");
    editableText.style.width = "100%";
    editableText.style.minHeight = "100px";
    editableText.value = text;
    floatingWindow.innerHTML = "";
    floatingWindow.appendChild(editableText);
    var saveButton = document.createElement("button");
    saveButton.innerText = "Save";
    var cancelButton = document.createElement("button");
    cancelButton.innerText = "Cancel";

    var buttonDiv = document.createElement("div");
    buttonDiv.appendChild(saveButton);
    buttonDiv.appendChild(cancelButton);
    floatingWindow.appendChild(buttonDiv);


    saveButton.onclick = function () {
      var newText  = editableText.value;
      floatingWindow.parentElement.removeChild(floatingWindow);
      createFloatingWindow(newText);
    };
    cancelButton.innerText = "Cancel";
    cancelButton.onclick = function () {
      floatingWindow.parentElement.removeChild(floatingWindow);
      createFloatingWindow(text);
    };
    
  };

  var shareButton = document.getElementById("askKursorShareButton");
  shareButton.onclick = function () {
    navigator.share({
      title: document.title,
      text: text,
      url: window.location.href
    });
  };

  
  var closeButton = document.getElementById("askKursorCloseButton");
  closeButton.onclick = function () {
    floatingWindow.parentElement.removeChild(floatingWindow);
  };

  floatingWindow.addEventListener("mousedown", dragStartHandler);
  var offset = {x: 0, y: 0};
  function dragStartHandler(event) {
    offset.x = event.offsetX;
    offset.y = event.offsetY;
    floatingWindow.style.cursor = "move";
    document.addEventListener("mousemove", dragHandler);
    document.addEventListener("mouseup", dragEndHandler);
  }

  function dragHandler(event) {
    floatingWindow.style.left = event.clientX - offset.x + "px";
    floatingWindow.style.top = event.clientY - offset.y + "px";
  }

  function dragEndHandler(event) {
    offset.x = event.offsetX;
    offset.y = event.offsetY;
    
    document.removeEventListener("mousemove", dragHandler);
    document.removeEventListener("mouseup", dragEndHandler);
    
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "askKursor") {
    var selectedText = window.getSelection().toString();
    if (selectedText && selectedText.trim().length > 0) {
      createFloatingWindow(selectedText);
    }
  }
});

document.addEventListener("mousedown", function (event) {
  if (floatingWindow && !floatingWindow.contains(event.target)) {
    if (floatingWindow && floatingWindow.parentElement) {
      floatingWindow.parentElement.removeChild(floatingWindow);
    }
  }
});

// document.addEventListener("mousemove", function (event) {
//   if (floatingWindow) {
//     floatingWindow.style.top = 450 + "px";
//     floatingWindow.style.left = 500 + "px";
//   }
// });



