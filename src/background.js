
  chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: "chrome-extension://jgemdnchpaekhennoogjcpemfikaipph/index.html" });
  });