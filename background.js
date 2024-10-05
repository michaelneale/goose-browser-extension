chrome.runtime.onInstalled.addListener(() => {
  console.log('Web Scraper to JSONL extension installed');
});

// This keeps the service worker active
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked');
});