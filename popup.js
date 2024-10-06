document.addEventListener('DOMContentLoaded', function() {
  const scrapeButton = document.getElementById('scrapeButton');

  function scrapeAndSend() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (!tabs || tabs.length === 0) {
        console.error('Error: No active tab found');
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, {action: "scrape"}, function(response) {
        if (chrome.runtime.lastError) {
          console.error('Error:', chrome.runtime.lastError.message);
          return;
        }

        if (response && response.data) {
          const jsonData = JSON.stringify(response.data);
          
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
            console.log('Data sent to localhost:9898');
          })
          .catch(error => {
            console.error('Error sending data to localhost:9898:', error.message);
          });
        } else {
          console.error('Error: Could not scrape data');
        }
      });
    });
  }

  // Scrape when the button is clicked
  scrapeButton.addEventListener('click', scrapeAndSend);
});