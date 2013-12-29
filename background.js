chrome.extension.onRequest.addListener(function(request) {
    // maybe the tab is active...
    chrome.windows.getCurrent(function(w) {
        chrome.tabs.getSelected(w.id, function(tab) {
            chrome.tabs.sendMessage(tab.id, request);
        });
    });
});

