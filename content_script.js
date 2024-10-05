chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "scrape") {
    const scrapedData = scrapePageContent();
    sendResponse({data: scrapedData});
  }
  return true;
});

function scrapePageContent() {
  return [
    {type: 'visible_text', content: getVisibleText(document.body)}
  ];
}

function getVisibleText(element) {
  let text = [];
  
  if (element.nodeType === Node.TEXT_NODE) {
    if (element.textContent.trim()) {
      text.push(element.textContent.trim());
    }
  } else if (element.nodeType === Node.ELEMENT_NODE) {
    const style = window.getComputedStyle(element);
    if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
      for (let child of element.childNodes) {
        text = text.concat(getVisibleText(child));
      }
    }
  }
  
  return text;
}