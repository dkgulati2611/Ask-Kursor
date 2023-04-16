var floatingWindow = null;
var isDragging = false;
var offset = { x: 0, y: 0 };

function createFloatingWindow(text) {
  floatingWindow = document.createElement("div");
  floatingWindow.setAttribute("id", "askKursorFloatingWindow");
  floatingWindow.style.position = "absolute";
  floatingWindow.style.border = "1px solid black";
  floatingWindow.style.padding = "5px";
  floatingWindow.style.background = "#ffffff";
  floatingWindow.style.zIndex = "9999";
  floatingWindow.style.maxWidth = "400px";
  floatingWindow.style.boxShadow = "3px 3px 5px 0px rgba(0,0,0,0.75)";
  floatingWindow.innerHTML = "<p>" + text + "</p><div><button id='askKursorCopyButton'>Copy</button><button id='askKursorEditButton'>Edit</button><button id='askKursorCloseButton'>Close</button></div>";
  document.body.appendChild(floatingWindow);
  var copyButton = document.getElementById("askKursorCopyButton");
  copyButton.onclick = function() {
    var temp = document.createElement("textarea");
    document.body.appendChild(temp);
    temp.value = text;
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
  };
  var editButton = document.getElementById("askKursorEditButton");
  editButton.onclick = function() {
    var editableText = document.createElement("textarea");
    editableText.setAttribute("id", "askKursorEditableText");
    editableText.style.width = "100%";
    editableText.style.minHeight = "100px";
    editableText.value = text;
    floatingWindow.innerHTML = "";
    floatingWindow.appendChild(editableText);
    var saveButton = document.createElement("button");
    saveButton.innerText = "Save";
    saveButton.onclick = function() {
      var newText = editableText.value;
      createFloatingWindow(newText);
      if (floatingWindow && floatingWindow.parentElement) {
        floatingWindow.parentElement.removeChild(floatingWindow);
      }
    };
    var cancelButton = document.createElement("button");
    cancelButton.innerText = "Cancel";
    cancelButton.onclick = function() {
      createFloatingWindow(text);
      if (floatingWindow && floatingWindow.parentElement) {
        floatingWindow.parentElement.removeChild(floatingWindow);
      }
    };
    var buttonDiv = document.createElement("div");
    buttonDiv.appendChild(saveButton);
    buttonDiv.appendChild(cancelButton);
    floatingWindow.appendChild(buttonDiv);
  };
  var closeButton = document.getElementById("askKursorCloseButton");
  closeButton.onclick = function() {
    if (floatingWindow && floatingWindow.parentElement) {
      floatingWindow.parentElement.removeChild(floatingWindow);
    }
  };
  var dragHandle = document.createElement("div");
  dragHandle.style.width = "100%";
  dragHandle.style.height = "20px";
  dragHandle.style.position = "absolute";
  dragHandle.style.top = "0";
  dragHandle.style.left = "0";
  dragHandle.style.cursor = "move";
  floatingWindow.appendChild(dragHandle);
  dragHandle.addEventListener("mousedown", function(event) {
    isDragging = true;
    mouseOffset.x = event.clientX - floatingWindow.offsetLeft;
    mouseOffset.y = event.clientY - floatingWindow.offsetTop;
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "askKursor") {
    var selectedText = window.getSelection().toString();
    if (selectedText && selectedText.trim().length > 0) {
      createFloatingWindow(selectedText);
    }
  }
});

  
  // add mousedown event listener to start dragging the floating window
  floatingWindow.addEventListener("mousedown", function(event) {
    isDragging = true;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    floatingWindow.style.cursor = "move";
  });
  document.removeEventListener("mousemove", moveHandler);
  oatingWindow.addEventListener("mousedown", dragStartHandler);

  function dragStartHandler(event) {
    offset.x = event.offsetX;
    offset.y = event.offsetY;
    document.addEventListener("mousemove", dragHandler);
    document.addEventListener("mouseup", dragEndHandler);
  }
  
  function dragHandler(event) {
    floatingWindow.style.left = event.clientX - offset.x + "px";
    floatingWindow.style.top = event.clientY - offset.y + "px";
  }
  
  function dragEndHandler(event) {
    document.removeEventListener("mousemove", dragHandler);
    document.removeEventListener("mouseup", dragEndHandler);
  }
  