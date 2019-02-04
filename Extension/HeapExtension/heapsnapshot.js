/*
  Creation Date: Feburary 2, 2019
  Original author: imdark
  Original author repository: https://github.com/imdark/heap-dump-chrome-extension
  Authors of modifications: Tony Qian
  Contents: Contains the heap snapshot dump process for our chrome extension
*/

// manages the browser extension button
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.debugger.attach({tabId:tab.id}, version,
      onAttach.bind(null, tab.id));
});

var version = "1.0";

// function to be called when process attaches to a tab
function onAttach(tabId) {
  if (chrome.runtime.lastError) {
    alert(chrome.runtime.lastError.message);
    return;
  }

  // attatches to chrome debugger and requests snapshot
  chrome.debugger.onEvent.addListener(onEvent);
  chrome.debugger.sendCommand({tabId:tabId}, 'HeapProfiler.takeHeapSnapshot', {reportProgress: false}, function() {
    chrome.downloads.download({
      url: window.URL.createObjectURL(new Blob([json], {type: 'application/json'})),
      filename: new Date().toISOString().replace(/:/g,'.') + ".heapsnapshot"
    });

    chrome.debugger.detach({tabId:tabId});
  });

  var json = '';
  function onEvent(debuggeeId, message, params) {
    if (tabId == debuggeeId.tabId && message == 'HeapProfiler.addHeapSnapshotChunk' && typeof(params.chunk) !== 'undefined') {
      debugger;
      json += params.chunk;
    }
  }
}
