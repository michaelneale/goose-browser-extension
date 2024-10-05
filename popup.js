document.addEventListener('DOMContentLoaded', function() {
  const resultDiv = document.getElementById('result');

  function scrapeAndDisplay() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (!tabs || tabs.length === 0) {
        resultDiv.textContent = 'Error: No active tab found';
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, {action: "scrape"}, function(response) {
        if (chrome.runtime.lastError) {
          resultDiv.textContent = 'Error: ' + chrome.runtime.lastError.message;
          return;
        }

        if (response && response.data) {
          const jsonData = JSON.stringify(response.data, null, 2); // Pretty-print JSON
          
          // Display scraped content
          resultDiv.innerHTML = '<pre>' + jsonData + '</pre>';

          // Send data to localhost:9898
          fetch('http://localhost:9898', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: jsonData,
          })
          .then(response => response.text())
          .then(result => {
            resultDiv.innerHTML += '<p>Data sent to localhost:9898</p>';
          })
          .catch(error => {
            resultDiv.innerHTML += '<p>Error sending data to localhost:9898: ' + error.message + '</p>';
          });
        } else {
          resultDiv.textContent = 'Error: Could not scrape data';
        }
      });
    });
  }

  // Scrape immediately when the popup opens
  scrapeAndDisplay();
});