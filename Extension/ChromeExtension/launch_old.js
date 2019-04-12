chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
	id: "mainwin",
    innerBounds: {
      width: 320,
      height: 240
    }
  });
});

function clicked() {
  chrome.tabs.executeScript({
    file: 'httpGet.js'
  })
}

document.getElementById('clickme').addEventListener('click', clicked);
