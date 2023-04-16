chrome.contextMenus.create({
    id: "askkursor",
    title: "Ask Kursor",
    contexts: ["selection"]
});
  
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == "askkursor") {
        chrome.tabs.sendMessage(tab.id, {text: info.selectionText, action : "askKursor"});
    }
});
  

