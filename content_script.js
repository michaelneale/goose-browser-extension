(function() {
  function scrapePageContent() {
    return {
      url: window.location.href,
      title: document.title,
      visible_text: getVisibleText(document.body)
    };
  }

  function getVisibleText(element) {
    let text = [];
    try {
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
    } catch (error) {
      console.error("Error getting visible text:", error);
    }
    return text;
  }

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "injectContext" && request.text) {
      const element = document.querySelector('[contenteditable="true"]');
      if (element && element.isContentEditable) {
        element.textContent = request.text;
        sendResponse({status: "success"});
      } else {
        sendResponse({status: "failed", error: "Element not found or not editable"});
      }
      return true;
    }
    if (request.action === "scrape") {
      try {
        const scrapedData = scrapePageContent();
        sendResponse({data: scrapedData});
      } catch (error) {
        console.error("Error scraping page:", error);
        sendResponse({error: "Failed to scrape page content"});
      }
    }
    return true;
  });
  
  // Expose functions for testing when in a test environment
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    module.exports = {
      scrapePageContent,
      getVisibleText
    };
  }
})();
